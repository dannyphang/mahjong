import * as db from "../firebase/firebase-admin.js";

const roomCollectionName = "room";
const mahjongCollectionName = "mahjong";
const playerCollectionName = "player";

function createGame(room) {
    return new Promise(async function (resolve, reject) {
        // get all mahjong tile
        const snapshot = await db.default.db.collection(mahjongCollectionName).orderBy("id").where("statusId", "==", 1).get();

        const mahjongList = snapshot.docs.map((doc) => {
            return doc.data();
        });

        // init default data
        room.gameStarted = true;
        room.gameOrder = 1;
        room.mahjong.discardTiles = [];
        room.mahjong.remainingTiles = [];

        // shuffle mahjong list
        const newMahjongList = shuffleArray(mahjongList);

        // shuffle directions
        const directions = [1, 2, 3];
        const shuffledDirections = shuffleArray(directions);

        room.playerList.forEach((player, index) => {
            player.direction = shuffledDirections[index];
        });

        for (let i = 0; i < room.playerList.length; i++) {
            // check is the player direction is East, if so 14 tiles, else 13 tiles
            let handTileAmount = room.playerList[i].direction === 1 ? 14 : 13;

            // reset flower and hand tiles and points
            room.playerList[i].mahjong.publicTiles.mahjongTile = [];
            room.playerList[i].mahjong.handTiles.mahjongTile = [];
            room.playerList[i].mahjong.flowerTiles.mahjongTile = [];
            room.playerList[i].mahjong.publicTiles.point = 0;
            room.playerList[i].mahjong.handTiles.point = 0;
            room.playerList[i].mahjong.flowerTiles.point = 0;

            // reset action to init value
            room.playerList[i].action.isPongable = false;
            room.playerList[i].action.isKongable = false;
            room.playerList[i].action.isChowable = false;
            room.playerList[i].action.isWinnable = false;

            for (let j = 0; j < handTileAmount; j++) {
                // set hand tile and flower tile
                let newMahjong;
                do {
                    newMahjong = newMahjongList[0];
                    if (newMahjong.type !== "Flower") {
                        room.playerList[i].mahjong.handTiles.mahjongTile.push(newMahjong);
                    } else {
                        room.playerList[i].mahjong.flowerTiles.mahjongTile.push(newMahjong);
                        room.playerList[i].mahjong.flowerTiles.point += calculateMahjongTilePoints(newMahjong, room.playerList[i]);
                    }

                    newMahjongList.shift();
                } while (newMahjong.type === "Flower");

                // sort the mahjong handtile list
                room.playerList[i].mahjong.handTiles.mahjongTile.sort((a, b) => a.order - b.order);
            }

            // store the rest mahjong list to remaining mahjong set
            room.mahjong.remainingTiles = newMahjongList;

            // check if the flower tile set got 'flower gang', then +1 more extra point (2 + 1 = 3)
            if (
                room.playerList[i].mahjong.flowerTiles.mahjongTile.find((m) => m.code === "spring") &&
                room.playerList[i].mahjong.flowerTiles.mahjongTile.find((m) => m.code === "summer") &&
                room.playerList[i].mahjong.flowerTiles.mahjongTile.find((m) => m.code === "autumn") &&
                room.playerList[i].mahjong.flowerTiles.mahjongTile.find((m) => m.code === "winter")
            ) {
                room.playerList[i].mahjong.flowerTiles.point++;
            }
            if (
                room.playerList[i].mahjong.flowerTiles.mahjongTile.find((m) => m.code === "plum") &&
                room.playerList[i].mahjong.flowerTiles.mahjongTile.find((m) => m.code === "orchid") &&
                room.playerList[i].mahjong.flowerTiles.mahjongTile.find((m) => m.code === "chrysanthemum") &&
                room.playerList[i].mahjong.flowerTiles.mahjongTile.find((m) => m.code === "bamboo")
            ) {
                room.playerList[i].mahjong.flowerTiles.point++;
            }

            updatePlayer(room.playerList[i]).then((playerU) => {});
        }

        updateRoom(room).then((roomU) => {
            resolve({
                ...roomU,
                response: {
                    isSuccess: true,
                    updateMessage: `Game started!`,
                },
            });
        });
    });
}

function playerJoinRoom(player, room) {
    return new Promise(async function (resolve, reject) {
        if (!room.playerList.find((p) => p.playerId === player.playerId)) {
            if (room.playerList.length <= 3) {
                room.playerList.push(player);
            } else {
                resolve({
                    ...room,
                    updateMessage: `Room player cannot more than 3 players`,
                });
            }
        }

        updateRoom(room).then((roomU) => {
            resolve({
                ...roomU,
                response: {
                    isSuccess: true,
                    updateMessage: `${player.playerName} is joined the room.`,
                },
            });
        });
    });
}

function updateRoom(room) {
    return new Promise(async function (resolve, reject) {
        let newRef = db.default.db.collection(roomCollectionName).doc(room.roomId);
        await newRef.update(room);

        resolve(room);
    });
}

function updatePlayer(player) {
    return new Promise(async function (resolve, reject) {
        let newRef = db.default.db.collection(playerCollectionName).doc(player.playerId);
        await newRef.update(player);

        resolve(player);
    });
}

function updateRoomAndPlayer(room, player) {
    return new Promise(async function (resolve, reject) {
        let newRef = db.default.db.collection(roomCollectionName).doc(room.roomId);
        await newRef.update(room);

        let newRef2 = db.default.db.collection(playerCollectionName).doc(player.playerId);
        await newRef2.update(player);

        resolve({ room, player });
    });
}

function playerQuitRoom(room, player) {
    return new Promise(async function (resolve, reject) {
        updateRoom(room).then((roomU) => {
            resolve({
                ...roomU,
                response: {
                    isSuccess: true,
                    updateMessage: `${player.playerName} quited the room.`,
                },
            });
        });
    });
}

function discardMahjong(room, player, discardedMahjongTile) {
    return new Promise(async function (resolve, reject) {
        // check if other player can do any action
        room.playerList.forEach((p) => {
            if (p.playerId !== player.playerId) {
                let jokerCount = 0;
                let sameMahjongCount = 0;

                p.mahjong.handTiles.mahjongTile.forEach((m) => {
                    if (m.joker) {
                        jokerCount++;
                    }
                    if (m.code === discardedMahjongTile.code) {
                        sameMahjongCount++;
                    }
                });

                // TODO: pong
                if (sameMahjongCount >= 2 || (jokerCount >= 1 && sameMahjongCount >= 1)) {
                    p.action.isPongable = true;
                } else {
                    p.action.isPongable = false;
                }

                // TODO: kong
                if (sameMahjongCount === 3) {
                    p.action.isKongable = true;
                } else {
                    p.action.isKongable = false;
                }
            }
        });

        // TODO: chow (chi)
        // TODO: win

        room.mahjong.discardTiles.push({
            ...discardedMahjongTile,
            isSelected: false,
        });

        room.playerList.find((p) => p.id === player.id).mahjong.handTiles.mahjongTile = room.playerList
            .find((p) => p.id === player.id)
            .mahjong.handTiles.mahjongTile.filter((m) => m.id !== discardedMahjongTile.id);

        updateRoom(room).then((roomU) => {
            nextTurn(roomU).then((roomNU) => {
                resolve({
                    ...roomNU,
                    response: {
                        isSuccess: true,
                        updateMessage: `${player.playerName} discarded ${discardedMahjongTile.name}.`,
                    },
                });
            });
        });

        // room.playerList.forEach((p) => {
        //   if (p.playerId === player.playerId) {
        //     updatePlayer(p).then((playerU) => {
        //       updateRoom(room).then((roomU) => {
        //         nextTurn(roomU).then((roomNU) => {
        //           resolve({
        //             ...room,
        //             updateMessage: `${player.playerName} discarded ${discardedMahjongTile.name}.`,
        //           });
        //         });
        //       });
        //     });
        //   }
        // });
    });
}

function drawMahjong(room, player) {
    return new Promise(async function (resolve, reject) {
        // check if the player is drawable
        if ((player.mahjong.handTiles.mahjongTile.length - 2) % 3 !== 0) {
            let newMahjong;
            do {
                newMahjong = room.mahjong.remainingTiles[0];
                room.mahjong.remainingTiles.shift();
                if (newMahjong.type !== "Flower") {
                    room.playerList.find((p) => p.playerId === player.playerId).mahjong.handTiles.mahjongTile.push(newMahjong);
                } else {
                    room.playerList.find((p) => p.playerId === player.playerId).mahjong.flowerTiles.mahjongTile.push(newMahjong);
                    room.playerList.find((p) => p.playerId === player.playerId).mahjong.flowerTiles.point += calculateMahjongTilePoints(
                        newMahjong,
                        room.playerList.find((p) => p.playerId === player.playerId)
                    );
                }
            } while (newMahjong.type === "Flower");

            updatePlayer(room.playerList.find((p) => p.playerId === player.playerId)).then((playerU) => {});

            updateRoom(room).then((roomU) => {
                resolve({
                    ...roomU,
                    response: {
                        isSuccess: true,
                    },
                });
            });
        } else {
            resolve({
                ...room,
                response: {
                    isSuccess: false,
                    updateMessage: `You cannot draw now, please discard a mahjong tile.`,
                },
            });
        }
    });
}

function nextTurn(room) {
    return new Promise(async function (resolve, reject) {
        room.gameOrder++;
        if (room.gameOrder > 3) {
            room.gameOrder = 1;
        }

        updateRoom(room).then((roomU) => {
            resolve({
                ...roomU,
                response: {
                    isSuccess: true,
                    updateMessage: `Player ${room.gameOrder}'s turn.`,
                },
            });
        });
    });
}

function actions(action, room, player, selectedMahjong) {
    return new Promise(async function (resolve, reject) {
        console.log(player);

        // set the selected mahjong isTaken = true
        selectedMahjong.isTaken = true;
        room.mahjong.discardTiles.find((m) => m.id === selectedMahjong.id).isTaken = true;

        switch (action) {
            case "pong":
                room.playerList.forEach((p) => {
                    if (p.playerId === player.playerId) {
                        // reset isPongable
                        p.action.isPongable = false;
                        p.action.isKongable = false;
                        p.action.isChowable = false;

                        let sameTileCount = 0;
                        // priotize 2 same tile then only come to pong with joker
                        p.mahjong.handTiles.mahjongTile.forEach((m) => {
                            if (m.code === selectedMahjong.code) {
                                sameTileCount++;
                            }
                        });

                        p.mahjong.publicTiles.mahjongTile.push(selectedMahjong);

                        // check if got 2 same tiles, else use joker
                        if (sameTileCount >= 2) {
                            // push to public tile set
                            for (let i = 0; i < 2; i++) {
                                let pongTileInHand = p.mahjong.handTiles.mahjongTile.find((m) => m.code === selectedMahjong.code);
                                p.mahjong.handTiles.mahjongTile = p.mahjong.handTiles.mahjongTile.filter((m) => m.id !== pongTileInHand.id);
                                p.mahjong.publicTiles.mahjongTile.push(pongTileInHand);
                            }
                        } else {
                            // use joker
                            let pongTileInHand = p.mahjong.handTiles.mahjongTile.find((m) => m.code === selectedMahjong.code);
                            p.mahjong.handTiles.mahjongTile = p.mahjong.handTiles.mahjongTile.filter((m) => m.id !== pongTileInHand.id);
                            p.mahjong.publicTiles.mahjongTile.push(pongTileInHand);

                            let jokerTileInHand = p.mahjong.handTiles.mahjongTile.find((m) => m.joker);
                            p.mahjong.handTiles.mahjongTile = p.mahjong.handTiles.mahjongTile.filter((m) => m.id !== jokerTileInHand.id);
                            p.mahjong.publicTiles.mahjongTile.push(jokerTileInHand);
                        }
                    }
                });
                break;
            case "kong":
                room.playerList.forEach((p) => {
                    if (p.playerId === player.playerId) {
                        // reset isPongable
                        p.action.isPongable = false;
                        p.action.isKongable = false;
                        p.action.isChowable = false;

                        for (let i = 0; i < 3; i++) {
                            let pongTileInHand = p.mahjong.handTiles.mahjongTile.find((m) => m.code === selectedMahjong.code);
                            p.mahjong.handTiles.mahjongTile = p.mahjong.handTiles.mahjongTile.filter((m) => m.id !== pongTileInHand.id);
                            p.mahjong.publicTiles.mahjongTile.push(pongTileInHand);
                        }
                    }
                });
                break;
        }

        room.gameOrder = player.direction;
        console.log(room.gameOrder);
        updateRoom(room).then((roomU) => {
            resolve(roomU);
        });
    });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}

function calculateMahjongTilePoints(mahjong, player) {
    if (mahjong.direction === player.direction || mahjong.direction === 0) {
        return 1;
    } else if (mahjong.code === "east" && player.direction === 1) {
        return 2;
    } else {
        return 0;
    }
}

function calculateMahjongSetPoints(mahjongList) {
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
        };

        // is 对对胡?
        if (isDuiDuiHu(mahjongList) || isDuiDuiHuWithJokers(mahjongList)) {
            combination.isDuiDuiHu = true;
        }

        // check if 全同子?
        // every() : Checks if all elements in the array satisfy the condition
        let tempMahjongListForQuanTongZi = mahjongList.filter((m) => !m.joker);
        if (tempMahjongListForQuanTongZi.every((m) => m.type === "Circles")) {
            combination.isQuanTongZi = true;
        }

        // check if 平胡?
        if (combination.isQuanTongZi && (checkPingHu(mahjongList) || isPingHuWithJokers(mahjongList))) {
            combination.isPingHu = true;
        }

        // check if 全字?
        let tempMahjongListForQuanZi = mahjongList.filter((m) => !m.joker);
        if (tempMahjongListForQuanZi.every((m) => m.type !== "Circles")) {
            combination.isQuanZi = true;
        }

        if (isYaokyuu(mahjongList)) {
            combination.isYaoJiu = true;
        }

        // check if 大三元?
        if (isBigThreeDragons(mahjongList)) {
            combination.isDaSanYuan = true;
        }

        // check if 小三元?
        if (isSmallThreeDragons(mahjongList)) {
            combination.isXiaoSanYuan = true;
        }

        // check if 大四喜?
        if (isBigFourWinds(mahjongList)) {
            combination.isDaSiXi = true;
        }

        // check if 小四喜?
        if (isSmallFourWinds(mahjongList)) {
            combination.isXiaoSiXi = true;
        }

        // check point
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

        if (combination.isQuanZi || combination.isKanKanHu || combination.isDaSanYuan || combination.isDaSiXi || combination.isXiaoSiXi) {
            finalPoint += 10;
        } else if (combination.isXiaoSanYuan) {
            finalPoint += 3;
        }

        resolve({
            points: finalPoint,
            combination: combination,
        });
    });
}

function isDuiDuiHu(mahjongList) {
    // Group tiles by code
    const groupedTiles = mahjongList.reduce((groups, tile) => {
        groups[tile.code] = (groups[tile.code] || 0) + 1;
        return groups;
    }, {});

    let tripletCount = 0;
    let pairCount = 0;

    // Check each group
    for (const count of Object.values(groupedTiles)) {
        if (count === 3) {
            tripletCount++;
        } else if (count === 2) {
            pairCount++;
        } else {
            // Invalid group size for 对对胡
            return false;
        }
    }

    // Validate total tiles and pattern
    const totalTiles = mahjongList.length;
    return totalTiles % 3 === 2 && pairCount === 1 && tripletCount === (totalTiles - 2) / 3;
}

function isDuiDuiHuWithJokers(mahjongList) {
    // Group tiles by code
    const groupedTiles = mahjongList.reduce((groups, tile) => {
        if (tile.joker) {
            groups["joker"] = (groups["joker"] || 0) + 1;
        } else {
            groups[tile.code] = (groups[tile.code] || 0) + 1;
        }
        return groups;
    }, {});

    const jokerCount = groupedTiles["joker"] || 0;
    delete groupedTiles["joker"];

    let availableJokers = jokerCount;
    let pairCount = 0;
    let isValid = true;

    // Check each group
    for (const count of Object.values(groupedTiles)) {
        if (count === 3) {
            // Valid triplet
            continue;
        } else if (count === 2) {
            // Valid pair (only one pair allowed)
            pairCount++;
            if (pairCount > 1) {
                isValid = false;
                break;
            }
        } else if (count === 1) {
            // Use 2 jokers to form a triplet
            if (availableJokers >= 2) {
                availableJokers -= 2;
            } else {
                isValid = false;
                break;
            }
        } else if (count === 0) {
            // Use 3 jokers to form a triplet
            if (availableJokers >= 3) {
                availableJokers -= 3;
            } else {
                isValid = false;
                break;
            }
        } else if (count === 2) {
            // Complete a triplet with 1 joker
            if (availableJokers >= 1) {
                availableJokers--;
            } else {
                isValid = false;
                break;
            }
        } else {
            isValid = false;
            break;
        }
    }

    // Ensure total tiles fit the formula 3n + 2 and only one pair exists
    const totalTiles = mahjongList.length;
    return isValid && totalTiles % 3 === 2 && pairCount === 1;
}

function checkPingHu(mahjongList) {
    if (mahjongList.length !== 14) return false;

    // Group tiles by type
    const grouped = mahjongList.reduce((acc, tile) => {
        acc[tile.type] = acc[tile.type] || [];
        acc[tile.type].push(tile);
        return acc;
    }, {});

    // Sort each group by tile order
    for (const type in grouped) {
        grouped[type].sort((a, b) => a.order - b.order);
    }

    // Recursive function to check sets
    function canFormPingHu(tiles, melds = 0, pairFound = false) {
        if (tiles.length === 0) return melds === 4 && pairFound;

        for (let i = 0; i < tiles.length; i++) {
            // Check for pair
            if (!pairFound && i + 1 < tiles.length && tiles[i].code === tiles[i + 1].code) {
                const remainingTiles = tiles.filter((_, idx) => idx !== i && idx !== i + 1);
                if (canFormPingHu(remainingTiles, melds, true)) return true;
            }

            // Check for Pung
            if (i + 2 < tiles.length && tiles[i].code === tiles[i + 1].code && tiles[i].code === tiles[i + 2].code) {
                const remainingTiles = tiles.filter((_, idx) => idx !== i && idx !== i + 1 && idx !== i + 2);
                if (canFormPingHu(remainingTiles, melds + 1, pairFound)) return true;
            }

            // Check for Chow (3 consecutive tiles in the same type)
            if (
                i + 2 < tiles.length &&
                tiles[i + 1].order === tiles[i].order + 1 &&
                tiles[i + 2].order === tiles[i].order + 2 &&
                tiles[i].type === tiles[i + 1].type &&
                tiles[i].type === tiles[i + 2].type
            ) {
                const remainingTiles = tiles.filter((_, idx) => idx !== i && idx !== i + 1 && idx !== i + 2);
                if (canFormPingHu(remainingTiles, melds + 1, pairFound)) return true;
            }
        }

        return false;
    }

    // Flatten grouped tiles and validate
    const allTiles = Object.values(grouped).flat();
    return canFormPingHu(allTiles);
}

function isPingHuWithJokers(mahjongList) {
    // Separate jokers and non-joker tiles
    const jokers = mahjongList.filter((tile) => tile.joker);
    const tiles = mahjongList.filter((tile) => !tile.joker);

    // Group tiles by their codes
    const groupedTiles = tiles.reduce((groups, tile) => {
        groups[tile.code] = groups[tile.code] || [];
        groups[tile.code].push(tile);
        return groups;
    }, {});

    const jokerCount = jokers.length;

    // Helper to check if a hand is valid
    function canFormPingHu(tilesLeft, jokersLeft) {
        if (tilesLeft.length === 0) {
            return jokersLeft === 0; // Valid if no tiles or jokers remain
        }

        // Try forming a pair first
        for (let code in groupedTiles) {
            if (groupedTiles[code].length >= 2) {
                // Use 2 tiles for the pair
                groupedTiles[code].splice(0, 2);
                if (canFormPingHu(tilesLeft - 2, jokersLeft)) return true;
                groupedTiles[code].splice(0, 0, ...Array(2).fill(code)); // Backtrack
            }
            // Use 1 tile and a joker for the pair
            if (groupedTiles[code].length >= 1 && jokersLeft > 0) {
                groupedTiles[code].splice(0, 1);
                if (canFormPingHu(tilesLeft - 2, jokersLeft - 1)) return true;
                groupedTiles[code].splice(0, 0, code); // Backtrack
            }
        }

        // Try forming a sequence
        for (let i = 1; i <= 7; i++) {
            // e.g., "circle_1" to "circle_9"
            const seq = [`circle_${i}`, `circle_${i + 1}`, `circle_${i + 2}`];
            const missing = seq.filter((code) => !groupedTiles[code] || groupedTiles[code].length === 0);

            if (missing.length <= jokersLeft) {
                // Use jokers to complete the sequence
                missing.forEach((code) => {
                    if (groupedTiles[code]) groupedTiles[code].splice(0, 1);
                });
                if (canFormPingHu(tilesLeft - 3, jokersLeft - missing.length)) return true;
                missing.forEach((code) => {
                    if (groupedTiles[code]) groupedTiles[code].push(code); // Backtrack
                });
            }
        }

        return false; // No valid hand found
    }

    // Total tiles must satisfy 3n+2
    if (mahjongList.length % 3 !== 2) return false;

    return canFormPingHu(mahjongList.length, jokerCount);
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

export { createGame, playerJoinRoom, updateRoom, playerQuitRoom, discardMahjong, nextTurn, drawMahjong, updatePlayer, actions, updateRoomAndPlayer, calculateMahjongSetPoints };
