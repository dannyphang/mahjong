function calculateFlowerTilePoints(mahjong, player) {
    if (mahjong.direction === player.direction || mahjong.direction === 0) {
        return 1;
    } else if (mahjong.code === "east" && player.direction === 1) {
        return 2;
    } else {
        return 0;
    }
}

function calculateMahjongSetPoints(mahjong, player) {
    return new Promise(async function (resolve, reject) {
        let finalPoint = 0;
        let combination = {
            isDuiDuiHu: false,
            isPingHu: false,
            isQuanTongZi: false,
            isYaoJiu: false,
            isQuanZi: false,
            isKanKanHu: false,
            isDaSanYuan: false,
            isXiaoSanYuan: false,
            isDaSiXi: false,
            isXiaoSiXi: false,
            isMenQianQing: false,
            isKongShangKong: false,
            isHaiDiLauYue: false,
            isHuaShang: false,
            isKongShang: false,
        };

        let mahjongList = [];
        // insert public tile tile to mahjong list
        mahjong.publicTiles.forEach((list) => {
            if (list.mahjongTile.length === 3) {
                for (const m of list.mahjongTile) {
                    mahjongList.push(m);
                }
            }
            if (list.mahjongTile.length === 4) {
                for (let i = 0; i < 3; i++) {
                    mahjongList.push(list.mahjongTile[i]);
                }
            }
        });

        // push all hand tile to the mahjong list also
        mahjong.handTiles.mahjongTile.forEach((m) => {
            mahjongList.push(m);
        });

        if (isWinningList(mahjongList)) {
            try {
                // is 对对胡?
                combination.isDuiDuiHu = isDuiDuiHu(mahjongList);

                // check if 全同子?
                // every() : Checks if all elements in the array satisfy the condition
                let tempMahjongListForQuanTongZi = mahjongList.filter((m) => !m.joker);
                combination.isQuanTongZi = tempMahjongListForQuanTongZi.every((m) => m.type === "Circles");

                // check if 平胡?
                combination.isPingHu = combination.isQuanTongZi && checkPingHu(mahjongList) && !player.drawAction.isKaLong;

                // check if 全字?
                let tempMahjongListForQuanZi = mahjongList.filter((m) => !m.joker);
                combination.isQuanZi = tempMahjongListForQuanZi.every((m) => m.type !== "Circles");

                // check if 幺九
                combination.isYaoJiu = isYaokyuu(mahjongList);

                // check if 大三元?
                combination.isDaSanYuan = isBigThreeDragons(mahjongList);

                // check if 小三元?
                combination.isXiaoSanYuan = isSmallThreeDragons(mahjongList);

                // check if 大四喜?
                combination.isDaSiXi = isBigFourWinds(mahjongList);

                // check if 小四喜?
                combination.isXiaoSiXi = isSmallFourWinds(mahjongList);

                // check if 门前清
                combination.isMenQianQing = player.mahjong.flowerTiles.mahjongTile.length === 0;

                // check if 坎坎胡
                combination.isKanKanHu = isDuiDuiHu(mahjongList) && (player.drawAction.isSoloDraw || player.drawAction.isSoloPong) && player.mahjong.publicTiles.length === 0;
                // check if 海底捞月
                combination.isHaiDiLauYue = player.drawAction.isDrawLastTile;

                // check if 扛上扛
                combination.isKongShangKong = player.drawAction.isDrawSecondKong;

                // check if 扛上
                combination.isKongShang = player.drawAction.isDrawKong || player.drawAction.isGetKong;

                // check if 花上
                combination.isHuaShang = player.drawAction.isDrawFlower;
            } catch (err) {
                console.log(err);
                resolve({
                    points: -1,
                    combination: combination,
                });
            }

            // check point
            finalPoint += player.mahjong.flowerTiles.point;

            finalPoint += getPointsFromCanon(mahjongList, player);

            // check player draw action
            finalPoint += getPointsFromDrawAction(player);

            if (combination.isQuanTongZi) {
                if (combination.isDuiDuiHu || combination.isPingHu) {
                    finalPoint += 4;
                } else {
                    finalPoint += 2;
                }
            } else if (combination.isDuiDuiHu) {
                finalPoint += 2;
            }

            if (combination.isYaoJiu) {
                finalPoint += 1;
            }

            if (
                combination.isQuanZi ||
                combination.isKanKanHu ||
                combination.isDaSanYuan ||
                combination.isDaSiXi ||
                combination.isXiaoSiXi ||
                combination.isMenQianQing ||
                combination.isHaiDiLauYue ||
                combination.isKongShangKong
            ) {
                finalPoint = 10;
            } else if (combination.isXiaoSanYuan) {
                finalPoint += 1;
            }

            resolve({
                points: finalPoint,
                combination: combination,
            });
        } else {
            resolve({
                points: -2,
                combination: combination,
            });
        }
    });
}

function isDuiDuiHu(mahjongList) {
    if (mahjongList.length !== 14) return false;
    const sets = [];
    for (let i = 0; i < 12; i += 3) {
        sets.push(mahjongList.slice(i, i + 3));
    }
    const pair = mahjongList.slice(12, 14);

    // Validate each set
    for (const set of sets) {
        if (!isValidSet(set, true)) {
            return false;
        }
    }

    // Validate the pair
    if (!isValidPair(pair)) {
        return false;
    }

    return true;
}

function checkPingHu(mahjongList) {
    if (mahjongList.length !== 14) return false;

    const sets = [];
    for (let i = 0; i < 12; i += 3) {
        sets.push(mahjongList.slice(i, i + 3));
    }
    const pair = mahjongList.slice(12, 14);

    // Validate each set
    for (const set of sets) {
        if (!isConsecutive(set[0].code, set[1].code, set[2].code)) {
            return false;
        }
    }

    // Validate the pair
    if (!isValidPair(pair)) {
        return false;
    }
}

function isBigThreeDragons(mahjongList) {
    // Filter the tiles into groups based on their type
    const groupedTiles = mahjongList.reduce(
        (groups, tile) => {
            if (tile.joker) {
                groups.jokers++;
            } else if (tile.code === "green") {
                groups.green++;
            } else if (tile.code === "red") {
                groups.red++;
            } else if (tile.code === "white") {
                groups.white++;
            }
            return groups;
        },
        { green: 0, red: 0, white: 0, jokers: 0 }
    );

    // Calculate remaining tiles needed for each set
    const greenNeeded = Math.max(0, 3 - groupedTiles.green);
    const redNeeded = Math.max(0, 3 - groupedTiles.red);
    const whiteNeeded = Math.max(0, 3 - groupedTiles.white);

    // Check if the available jokers can fulfill the missing tiles
    const totalNeeded = greenNeeded + redNeeded + whiteNeeded;

    return groupedTiles.jokers >= totalNeeded;
}

function isSmallThreeDragons(mahjongList) {
    // Group tiles by type and count jokers separately
    const groupedTiles = mahjongList.reduce(
        (groups, tile) => {
            if (tile.joker) {
                groups.jokers++;
            } else if (tile.code === "green") {
                groups.green++;
            } else if (tile.code === "red") {
                groups.red++;
            } else if (tile.code === "white") {
                groups.white++;
            }
            return groups;
        },
        { green: 0, red: 0, white: 0, jokers: 0 }
    );

    // Try every possible combination for the pair and triplets
    const dragonTypes = ["green", "red", "white"];

    for (let pair of dragonTypes) {
        // Determine triplet dragon types
        const triplets = dragonTypes.filter((dragon) => dragon !== pair);

        // Calculate shortfall for the pair and triplets
        const pairNeeded = Math.max(0, 2 - groupedTiles[pair]);
        const tripletNeeded1 = Math.max(0, 3 - groupedTiles[triplets[0]]);
        const tripletNeeded2 = Math.max(0, 3 - groupedTiles[triplets[1]]);

        const totalNeeded = pairNeeded + tripletNeeded1 + tripletNeeded2;

        // Check if jokers can cover the shortfall
        if (groupedTiles.jokers >= totalNeeded) {
            return true;
        }
    }

    return false;
}

function isBigFourWinds(mahjongList) {
    // Group tiles by type and count jokers
    const groupedTiles = mahjongList.reduce(
        (groups, tile) => {
            if (tile.joker) {
                groups.jokers++;
            } else if (tile.code === "east") {
                groups.east++;
            } else if (tile.code === "south") {
                groups.south++;
            } else if (tile.code === "west") {
                groups.west++;
            } else if (tile.code === "north") {
                groups.north++;
            } else {
                groups.others.push(tile);
            }
            return groups;
        },
        { east: 0, south: 0, west: 0, north: 0, jokers: 0, others: [] }
    );

    // Calculate how many tiles are needed to complete the four Wind triplets
    const windsNeeded = [Math.max(0, 3 - groupedTiles.east), Math.max(0, 3 - groupedTiles.south), Math.max(0, 3 - groupedTiles.west), Math.max(0, 3 - groupedTiles.north)];
    const totalWindsNeeded = windsNeeded.reduce((sum, n) => sum + n, 0);

    // Check if jokers can cover the shortfall for the Winds
    if (groupedTiles.jokers < totalWindsNeeded) {
        return false;
    }

    // Check if the remaining tiles can form a valid pair
    const remainingJokers = groupedTiles.jokers - totalWindsNeeded;
    const remainingTiles = groupedTiles.others.map((tile) => tile.code);
    const tileCounts = {};

    // Count occurrences of each tile in the remaining tiles
    remainingTiles.forEach((code) => {
        tileCounts[code] = (tileCounts[code] || 0) + 1;
    });

    // Check if any tile (or jokers) can form a pair
    const pairPossible = Object.values(tileCounts).some((count) => count >= 2) || remainingJokers >= 2;

    return pairPossible;
}

function isSmallFourWinds(mahjongList) {
    // Group tiles by type and count jokers
    const groupedTiles = mahjongList.reduce(
        (groups, tile) => {
            if (tile.joker) {
                groups.jokers++;
            } else if (tile.code === "east") {
                groups.east++;
            } else if (tile.code === "south") {
                groups.south++;
            } else if (tile.code === "west") {
                groups.west++;
            } else if (tile.code === "north") {
                groups.north++;
            } else {
                groups.others.push(tile);
            }
            return groups;
        },
        { east: 0, south: 0, west: 0, north: 0, jokers: 0, others: [] }
    );

    // Calculate how many tiles are needed to form three Pungs (triplets)
    const windsNeededForPungs = [Math.max(0, 3 - groupedTiles.east), Math.max(0, 3 - groupedTiles.south), Math.max(0, 3 - groupedTiles.west), Math.max(0, 3 - groupedTiles.north)];

    const pungsPossible = windsNeededForPungs.filter((n) => n === 0).length;
    if (pungsPossible < 3) return false; // Must have exactly 3 Pungs of Winds

    // Identify the Wind type that should form the pair
    const pairCandidateIndex = windsNeededForPungs.findIndex((n) => n > 0);
    if (pairCandidateIndex === -1 || windsNeededForPungs[pairCandidateIndex] > 2) return false;

    const remainingJokers = groupedTiles.jokers - windsNeededForPungs.reduce((sum, n) => sum + n, 0);
    if (remainingJokers < 0) return false;

    // Check for the pair in the fourth Wind or use Jokers
    const pairWindCounts = [groupedTiles.east, groupedTiles.south, groupedTiles.west, groupedTiles.north][pairCandidateIndex];

    const pairNeeded = Math.max(0, 2 - pairWindCounts);
    if (pairNeeded > remainingJokers) return false;

    return true;
}

function isYaokyuu(mahjongList) {
    const yaokyuuTiles = ["1", "9"]; // Only allow 1 and 9 tiles in each suit
    let jokers = 0;
    const counts = {
        circle: { 1: 0, 9: 0 },
        winds: { east: 0, south: 0, west: 0, north: 0 },
        dragons: { red: 0, green: 0, white: 0 },
    };

    // Count tiles
    mahjongList.forEach((tile) => {
        if (tile.joker) {
            jokers++;
        } else if (tile.type === "Circles" && yaokyuuTiles.includes(tile.code.slice(-1))) {
            counts.circle[tile.code.slice(-1)]++;
        } else if (tile.type === "Winds") {
            counts.winds[tile.code]++;
        } else if (tile.type === "Dragons") {
            counts.dragons[tile.code]++;
        }
    });

    // Validate that no other Circles exist
    const nonYaokyuuCircles = mahjongList.filter((tile) => tile.type === "Circles" && !yaokyuuTiles.includes(tile.code.slice(-1)));
    if (nonYaokyuuCircles.length > 0) return false;

    // Calculate how many tiles are required to form the hand
    const requiredSets = 4; // 4 sets of three
    const requiredPair = 1; // 1 pair of two
    let remainingJokers = jokers;
    let completedSets = 0;

    // Check each group for Pungs/Triplets
    const allGroups = [counts.circle, counts.winds, counts.dragons];
    allGroups.forEach((group) => {
        Object.values(group).forEach((count) => {
            while (count >= 3) {
                count -= 3;
                completedSets++;
            }
            if (count === 2 && requiredPair > 0) {
                completedSets++;
                count -= 2;
            }
            if (count === 1 && remainingJokers >= 2) {
                completedSets++;
                remainingJokers -= 2;
            }
        });
    });

    // Check if Jokers can complete remaining sets/pairs
    if (completedSets + Math.floor(remainingJokers / 3) >= requiredSets + requiredPair) {
        return true;
    }

    return false;
}

function isWinningList(mahjongList) {
    if (mahjongList.length !== 14) return false; // A valid Mahjong hand must have 14 tiles.

    const jokers = mahjongList.filter((tile) => tile.joker).length;
    const nonJokerTiles = mahjongList.filter((tile) => !tile.joker);

    // Break the list into groups of 3 (sets) and 1 group of 2 (pair)
    const sets = [];
    for (let i = 0; i < 12; i += 3) {
        sets.push(mahjongList.slice(i, i + 3));
    }
    const pair = mahjongList.slice(12, 14);

    // Validate each set
    for (const set of sets) {
        if (!isValidSet(set)) {
            return false;
        }
    }

    // Validate the pair
    if (!isValidPair(pair)) {
        return false;
    }

    return true; // All sets and the pair are valid
}

function isValidSet(set, onlyPungSet = false) {
    set = set.sort((a, b) => a.order - b.order);
    const jokers = set.filter((tile) => tile.joker).length;
    const nonJokerTiles = set.filter((tile) => !tile.joker);

    if (jokers === 3) return true; // All jokers, automatically valid

    if (nonJokerTiles.length === 3) {
        // Check for Pung (three identical tiles)
        if (nonJokerTiles[0].code === nonJokerTiles[1].code && nonJokerTiles[1].code === nonJokerTiles[2].code) {
            return true;
        }

        // Check for Chow (three consecutive tiles of the same suit)
        if (isConsecutive(nonJokerTiles[0].code, nonJokerTiles[1].code, nonJokerTiles[2].code) && !onlyPungSet) {
            return true;
        }
    }

    if (nonJokerTiles.length + jokers === 3) {
        // Use jokers to complete a Pung or Chow
        if (nonJokerTiles.length === 2) {
            // Attempt to complete a Chow
            if (isConsecutive(nonJokerTiles[0].code, nonJokerTiles[1].code, "joker") && !onlyPungSet) {
                return true;
            } // Two identical tiles

            // Attempt to complete a Pung
            if (nonJokerTiles[0].code === nonJokerTiles[1].code) {
                return true;
            } // Two identical tiles
        }

        if (nonJokerTiles.length === 1) {
            // Attempt to complete a Pung
            return true; // Any one tile + 2 jokers can always form a valid Pung
        }
    }

    return false; // Invalid set
}

function isValidPair(pair) {
    const jokers = pair.filter((tile) => tile.joker).length;
    const nonJokerTiles = pair.filter((tile) => !tile.joker);

    if (jokers === 2) return true; // Two jokers always form a valid pair
    if (jokers === 1 && nonJokerTiles.length === 1) return true; // One joker + one tile forms a pair
    if (nonJokerTiles.length === 2 && nonJokerTiles[0].code === nonJokerTiles[1].code) {
        return true;
    } // Two identical tiles

    return false; // Invalid pair
}

function isConsecutive(code1, code2, code3) {
    const isJoker = (code) => code === "joker";

    // Extract suits and numbers
    const suit1 = isJoker(code1) ? null : code1.split("_")[0];
    const suit2 = isJoker(code2) ? null : code2.split("_")[0];
    const suit3 = isJoker(code3) ? null : code3.split("_")[0];

    // Jokers can adapt to any suit
    if (!isJoker(code1) && !isJoker(code2) && !isJoker(code3) && (suit1 !== suit2 || suit2 !== suit3)) {
        return false; // All tiles must belong to the same suit unless they are jokers
    }

    const num1 = isJoker(code1) ? null : parseInt(code1.split("_")[1], 10);
    const num2 = isJoker(code2) ? null : parseInt(code2.split("_")[1], 10);
    const num3 = isJoker(code3) ? null : parseInt(code3.split("_")[1], 10);

    // Handle cases with jokers
    const nums = [num1, num2, num3].filter((num) => num !== null).sort((a, b) => a - b);

    if (nums.length === 3) {
        // No jokers: strictly check for consecutive numbers
        return nums[1] === nums[0] + 1 && nums[2] === nums[1] + 1;
    }

    if (nums.length === 2) {
        // One joker: check if the joker can fill the gap
        const gap = nums[1] - nums[0];
        return gap <= 2; // The joker can fill gaps of up to 2
    }

    if (nums.length === 1) {
        // Two jokers: always valid with one number
        return true;
    }

    return false; // Invalid case
}

function getPointsFromCanon(mahjongList, player) {
    let points = 0;
    let sets = [];
    for (let i = 0; i < 12; i += 3) {
        sets.push(mahjongList.slice(i, i + 3));
    }

    for (let set of sets) {
        if (isValidSet(set, true)) {
            set = set.sort((a, b) => b.order - a.order);
            if (set[0].code === "east" && player.direction === 1) {
                points += 2;
            } else if ((set[0].direction === 0 || set[0].direction === player.direction) && set[0].type !== "Circles" && !set[0].joker) {
                points++;
            }
        }
    }
    return points;
}

function getPointsFromDrawAction(player) {
    if (player.drawAction.isDrawFlower) {
        return 1;
    } else if (player.drawAction.isDrawKong) {
        return 1;
    } else if (player.drawAction.isStealKong) {
        return 1;
    }

    return 0;
}

function isKongableFromHandSet(drawedMahjong, mahjongList) {
    let sameTile = 0;
    mahjongList.forEach((m) => {
        if (drawedMahjong.code === m.code) {
            sameTile++;
        }
    });
    return sameTile >= 3;
}

function checkChow(handTiles, discardedTile) {
    const suit = discardedTile.code.split("_")[0];
    const number = parseInt(discardedTile.code.split("_")[1]);

    // Possible Chow combinations
    const possibleChowSets = [
        [`${suit}_${number - 2}`, `${suit}_${number - 1}`], // E.g., 1 and 2 to form 1, 2, 3
        [`${suit}_${number - 1}`, `${suit}_${number + 1}`], // E.g., 2 and 4 to form 2, 3, 4
        [`${suit}_${number + 1}`, `${suit}_${number + 2}`], // E.g., 4 and 5 to form 3, 4, 5
    ];

    // Count jokers in hand
    const jokers = handTiles.filter((tile) => tile.joker).length;

    for (const chowSet of possibleChowSets) {
        let matchCount = 0;

        // Check how many tiles in the Chow set exist in the player's hand
        handTiles.forEach((tile) => {
            if (chowSet.includes(tile.code)) {
                matchCount++;
            }
        });

        // If missing tiles can be filled with jokers, the Chow is valid
        if (matchCount + jokers >= 2) {
            return true;
        }
    }

    return false; // No valid Chow found
}

function isNextPlayer(room, currentPlayer, targetPlayer) {
    const playerOrder = room.playerList.map((p) => p.direction);
    const currentIndex = playerOrder.indexOf(currentPlayer.direction);
    const nextIndex = (currentIndex + 1) % playerOrder.length;

    return room.playerList[nextIndex].playerId === targetPlayer.playerId;
}

export { calculateFlowerTilePoints, calculateMahjongSetPoints, isKongableFromHandSet, checkChow, isNextPlayer, isConsecutive };
