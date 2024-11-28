import * as db from "../firebase/firebase-admin.js";

const roomCollectionName = "room";
const mahjongCollectionName = "mahjong";
const playerCollectionName = "player";

function createGame(room) {
  return new Promise(async function (resolve, reject) {
    newGame(room).then((fU) => {
      room = {
        ...fU,
      };
      room.playerList.sort((a, b) => a.direction - b.direction);
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
  });
}

function newGame(room) {
  return new Promise(async function (resolve, reject) {
    // get all mahjong tile
    const snapshot = await db.default.db
      .collection(mahjongCollectionName)
      .orderBy("id")
      .where("statusId", "==", 1)
      .get();

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

    // store the rest mahjong list to remaining mahjong set
    room.mahjong.remainingTiles = newMahjongList;

    room.playerList.forEach((player, index) => {
      player.direction = shuffledDirections[index];
    });

    for (let i = 0; i < room.playerList.length; i++) {
      // check is the player direction is East, if so 14 tiles, else 13 tiles
      let handTileAmount = room.playerList[i].direction === 1 ? 14 : 13;

      // reset flower and hand tiles and points
      room.playerList[i].mahjong.publicTiles = [];
      room.playerList[i].mahjong.handTiles.mahjongTile = [];
      room.playerList[i].mahjong.flowerTiles.mahjongTile = [];
      room.playerList[i].mahjong.handTiles.point = 0;
      room.playerList[i].mahjong.flowerTiles.point = 0;

      // reset action to init value
      room.playerList[i].action.isPongable = false;
      room.playerList[i].action.isKongable = false;
      room.playerList[i].action.isChowable = false;
      room.playerList[i].action.isWinnable = false;
      room.playerList[i].action.isSelfKongable = false;
      room.playerList[i].action.isSecondPongable = false;

      for (let j = 0; j < handTileAmount; j++) {
        drawMahjong(room, room.playerList[i], true).then((drawMahjongU) => {
          room = {
            ...drawMahjongU,
          };

          // sort the mahjong handtile list
          room.playerList[i].mahjong.handTiles.mahjongTile.sort((a, b) => a.order - b.order);

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
            room.playerList[i].mahjong.flowerTiles.mahjongTile.find(
              (m) => m.code === "chrysanthemum"
            ) &&
            room.playerList[i].mahjong.flowerTiles.mahjongTile.find((m) => m.code === "bamboo")
          ) {
            room.playerList[i].mahjong.flowerTiles.point++;
          }

          updatePlayer(room.playerList[i]).then((playerU) => {
            if (i == 2 && j == handTileAmount - 1) {
              resolve(room);
            }
          });
        });
      }
    }
  });
}

function testGame(room) {
  return new Promise(async function (resolve, reject) {
    const snapshot = await db.default.db
      .collection(mahjongCollectionName)
      .orderBy("id")
      .where("statusId", "==", 1)
      .get();

    const mahjongList = snapshot.docs.map((doc) => {
      return doc.data();
    });

    let playerOneHand = [
      {
        id: 19,
        order: 17,
        type: "joker",
        joker: true,
        name: "Joker",
        code: "joker",
        direction: 0,
        uid: "L0rOu9lDFAmC9LJ54l1B",
        statusId: 1,
      },
      {
        id: 69,
        order: 18,
        type: "Circles",
        joker: false,
        name: "1 Circle",
        code: "circle_1",
        direction: 0,
        uid: "2mnOpSjM9vYhc01lLfxo",
        statusId: 1,
      },
      {
        id: 53,
        order: 18,
        type: "Circles",
        joker: false,
        name: "1 Circle",
        code: "circle_1",
        direction: 0,
        uid: "aM1zvpSANLK7oMJddhxC",
        statusId: 1,
      },
      {
        id: 37,
        order: 18,
        type: "Circles",
        joker: false,
        name: "1 Circle",
        code: "circle_1",
        direction: 0,
        uid: "jpqhUVUXonb9Myf2YUbw",
        statusId: 1,
      },
      {
        id: 38,
        order: 19,
        type: "Circles",
        joker: false,
        name: "2 Circle",
        code: "circle_2",
        direction: 0,
        uid: "RRpGX0p60t8dKtgYYQqM",
        statusId: 1,
      },
      {
        id: 22,
        order: 19,
        type: "Circles",
        joker: false,
        name: "2 Circle",
        code: "circle_2",
        direction: 0,
        uid: "Y47cBGXNTFoiFRNGC25d",
        statusId: 1,
      },
      {
        id: 54,
        order: 19,
        type: "Circles",
        joker: false,
        name: "2 Circle",
        code: "circle_2",
        direction: 0,
        uid: "vygvhjggvOA9L8I7VL2O",
        statusId: 1,
      },
      {
        id: 71,
        order: 20,
        type: "Circles",
        joker: false,
        name: "3 Circle",
        code: "circle_3",
        direction: 0,
        uid: "MBxdGVSKBspUFrDbQ8Gf",
        statusId: 1,
      },
      {
        id: 55,
        order: 20,
        type: "Circles",
        joker: false,
        name: "3 Circle",
        code: "circle_3",
        direction: 0,
        uid: "MO7ZVRZmUSYHhQIRntV3",
        statusId: 1,
      },
      {
        id: 23,
        order: 20,
        type: "Circles",
        joker: false,
        name: "3 Circle",
        code: "circle_3",
        direction: 0,
        uid: "Plbvk0YFEJuU5lHQE08r",
        statusId: 1,
      },
      {
        id: 24,
        order: 21,
        type: "Circles",
        joker: false,
        name: "4 Circle",
        code: "circle_4",
        direction: 0,
        uid: "WJlyo2bYsiKi0yThAFWM",
        statusId: 1,
      },
      {
        id: 56,
        order: 21,
        type: "Circles",
        joker: false,
        name: "4 Circle",
        code: "circle_4",
        direction: 0,
        uid: "fIFNuQbkfZ8xMFCSwFZe",
        statusId: 1,
      },
      {
        id: 40,
        order: 21,
        type: "Circles",
        joker: false,
        name: "4 Circle",
        code: "circle_4",
        direction: 0,
        uid: "wXzTYMysrJmFacQmnHRQ",
        statusId: 1,
      },
      {
        id: 73,
        order: 22,
        type: "Circles",
        joker: false,
        name: "5 Circle",
        code: "circle_5",
        direction: 0,
        uid: "5dQUHAdFXssznn5bnXeZ",
        statusId: 1,
      },
    ];

    let playerTwoHand = [
      {
        id: 20,
        order: 17,
        type: "joker",
        joker: true,
        name: "Joker",
        code: "joker",
        direction: 0,
        uid: "hrxs8fPTP46Z7GxMrShB",
        statusId: 1,
      },
      {
        id: 84,
        order: 33,
        type: "Dragons",
        joker: false,
        name: "White",
        code: "white",
        direction: 0,
        uid: "kutusocsDgONXGMUtObJ",
        statusId: 1,
      },
      {
        id: 46,
        order: 27,
        type: "Winds",
        joker: false,
        name: "East",
        code: "east",
        direction: 1,
        uid: "9FtzRW64cvUU27HC3IPC",
        statusId: 1,
      },
      {
        id: 78,
        order: 27,
        type: "Winds",
        joker: false,
        name: "East",
        code: "east",
        direction: 1,
        uid: "AaF9iFhMZgmlpVzNhmTs",
        statusId: 1,
      },
      {
        id: 30,
        order: 27,
        type: "Winds",
        joker: false,
        name: "East",
        code: "east",
        direction: 1,
        uid: "qQYHU5c7ubZNqzwbtzJa",
        statusId: 1,
      },
      {
        id: 79,
        order: 28,
        type: "Winds",
        joker: false,
        name: "South",
        code: "south",
        direction: 2,
        uid: "PekTBkxY58qJ5BIMTYUK",
        statusId: 1,
      },
      {
        id: 47,
        order: 28,
        type: "Winds",
        joker: false,
        name: "South",
        code: "south",
        direction: 2,
        uid: "SAFeBKfZch8kbxR80z97",
        statusId: 1,
      },
      {
        id: 31,
        order: 28,
        type: "Winds",
        joker: false,
        name: "South",
        code: "south",
        direction: 2,
        uid: "Tyx03ownCDLDhpM6zsSr",
        statusId: 1,
      },
      {
        id: 48,
        order: 29,
        type: "Winds",
        joker: false,
        name: "West",
        code: "west",
        direction: 3,
        uid: "47QftjV7lOGmyYqMc5aY",
        statusId: 1,
      },
      {
        id: 64,
        order: 29,
        type: "Winds",
        joker: false,
        name: "West",
        code: "west",
        direction: 3,
        uid: "ELTnKq3VAXi3HPeH1Xw3",
        statusId: 1,
      },
      {
        id: 32,
        order: 29,
        type: "Winds",
        joker: false,
        name: "West",
        code: "west",
        direction: 3,
        uid: "PSH5JmSswJzjuPEQCFLf",
        statusId: 1,
      },
      {
        id: 49,
        order: 30,
        type: "Winds",
        joker: false,
        name: "North",
        code: "north",
        direction: 0,
        uid: "D5NxetC3AILl1nc9RuKX",
        statusId: 1,
      },
      {
        id: 17,
        order: 17,
        type: "joker",
        joker: true,
        name: "Joker",
        code: "joker",
        direction: 0,
        uid: "lsJgbn47P96ipbQzYgCS",
        statusId: 1,
      },
    ];

    let playerThreeHand = [
      {
        id: 18,
        order: 17,
        type: "joker",
        joker: true,
        name: "Joker",
        code: "joker",
        direction: 0,
        uid: "WbrzzlCmwF2bOK09KO4J",
        statusId: 1,
      },
      {
        id: 21,
        order: 18,
        type: "Circles",
        joker: false,
        name: "1 Circle",
        code: "circle_1",
        direction: 0,
        uid: "t8NvErq9eSIKD1AaAfmj",
        statusId: 1,
      },
      {
        id: 70,
        order: 19,
        type: "Circles",
        joker: false,
        name: "2 Circle",
        code: "circle_2",
        direction: 0,
        uid: "3mvdQhog5IoUZuUe9vEc",
        statusId: 1,
      },
      {
        id: 39,
        order: 20,
        type: "Circles",
        joker: false,
        name: "3 Circle",
        code: "circle_3",
        direction: 0,
        uid: "g6ux22H0zwWkcTNe6eDZ",
        statusId: 1,
      },
      {
        id: 72,
        order: 21,
        type: "Circles",
        joker: false,
        name: "4 Circle",
        code: "circle_4",
        direction: 0,
        uid: "JPqx5tnoikmXfg9376EP",
        statusId: 1,
      },
      {
        id: 25,
        order: 22,
        type: "Circles",
        joker: false,
        name: "5 Circle",
        code: "circle_5",
        direction: 0,
        uid: "31q7fTYIER8D4D9Hcw3w",
        statusId: 1,
      },
      {
        id: 50,
        order: 31,
        type: "Dragons",
        joker: false,
        name: "Red",
        code: "red",
        direction: 0,
        uid: "6goDQz6Ncz0Y712gl1ru",
        statusId: 1,
      },
      {
        id: 82,
        order: 31,
        type: "Dragons",
        joker: false,
        name: "Red",
        code: "red",
        direction: 0,
        uid: "AM7ly2gAZcAo7Jw8RWyr",
        statusId: 1,
      },
      {
        id: 66,
        order: 31,
        type: "Dragons",
        joker: false,
        name: "Red",
        code: "red",
        direction: 0,
        uid: "ClATKlda2F0B10OaSa5Q",
        statusId: 1,
      },
      {
        id: 51,
        order: 32,
        type: "Dragons",
        joker: false,
        name: "Green",
        code: "green",
        direction: 0,
        uid: "8eWK1btVQgfdStz8AoSy",
        statusId: 1,
      },
      {
        id: 35,
        order: 32,
        type: "Dragons",
        joker: false,
        name: "Green",
        code: "green",
        direction: 0,
        uid: "SoDyQ4bY71uyNgYAaNds",
        statusId: 1,
      },
      {
        id: 36,
        order: 33,
        type: "Dragons",
        joker: false,
        name: "White",
        code: "white",
        direction: 0,
        uid: "5Ulfr9WRNwzmnSkscwhf",
        statusId: 1,
      },
      {
        id: 68,
        order: 33,
        type: "Dragons",
        joker: false,
        name: "White",
        code: "white",
        direction: 0,
        uid: "FyoRuw1F5mGIhllbOFaC",
        statusId: 1,
      },
    ];

    let remainingTiles = mahjongList;

    playerOneHand.forEach((h) => {
      remainingTiles = remainingTiles.filter((m) => m.id != h.id);
    });

    playerTwoHand.forEach((h) => {
      remainingTiles = remainingTiles.filter((m) => m.id != h.id);
    });

    playerThreeHand.forEach((h) => {
      remainingTiles = remainingTiles.filter((m) => m.id != h.id);
    });

    // shuffle directions
    const directions = [1, 2, 3];
    const shuffledDirections = shuffleArray(directions);

    room.playerList.forEach((player, index) => {
      player.direction = shuffledDirections[index];
    });

    room.playerList.forEach((p) => {
      p.mahjong.flowerTiles = {
        mahjongTile: [],
        point: 0,
      };
      p.mahjong.publicTiles = [];
      if (p.direction === 1) {
        p.mahjong.handTiles.mahjongTile = playerOneHand;
      } else if (p.direction === 2) {
        p.mahjong.handTiles.mahjongTile = playerTwoHand;
      } else if (p.direction === 3) {
        p.mahjong.handTiles.mahjongTile = playerThreeHand;
      }
      updatePlayer(p).then((playerU) => {});
    });
    // sort player by direction
    room.playerList.sort((a, b) => a.direction - b.direction);

    assignWinnable(room).then((roomWin) => {
      room.playerList = roomWin.playerList;
    });

    room.mahjong.remainingTiles = remainingTiles;
    room.mahjong.discardTiles = [];
    room.gameOrder = 1;

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

function assignWinnable(room) {
  return new Promise(async function (resolve, reject) {
    room.playerList.forEach((p) => {
      let mahjongList = [];
      // insert public tile tile to mahjong list
      p.mahjong.publicTiles.forEach((list) => {
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
      p.mahjong.handTiles.mahjongTile.forEach((m) => {
        mahjongList.push(m);
      });

      if (isWinningList(mahjongList)) {
        p.action.isWinnable = true;
      }
    });

    resolve(room);
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
    // check player handtile number
    if ((player.mahjong.handTiles.mahjongTile.length - 2) % 3 === 0) {
      // check if discarded tile is joker
      if (discardedMahjongTile.joker) {
        discardedMahjongTile.isSelected = false;
        player.mahjong.flowerTiles.mahjongTile.push(discardedMahjongTile);
        player.mahjong.flowerTiles.point++;

        room.playerList.find((p) => p.playerId === player.playerId).mahjong.flowerTiles =
          player.mahjong.flowerTiles;
        room.playerList.find((p) => p.playerId === player.playerId).mahjong.handTiles.mahjongTile =
          room.playerList
            .find((p) => p.playerId === player.playerId)
            .mahjong.handTiles.mahjongTile.filter((m) => m.id !== discardedMahjongTile.id);

        player = room.playerList.find((p) => p.playerId === player.playerId);

        drawMahjong(room, player).then((du) => {
          updatePlayer(player).then((playerU) => {});
          updateRoom(du).then((roomU) => {
            resolve({
              ...roomU,
              response: {
                isSuccess: true,
                updateMessage: `${player.playerName} discarded ${discardedMahjongTile.name}.`,
              },
            });
          });
        });
      } else {
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

            // pong
            p.action.isPongable = sameMahjongCount >= 2;
            p.action.isSecondPongable =
              jokerCount >= 1 && sameMahjongCount >= 1 && !p.action.isPongable;

            // kong (hand)
            p.action.isKongable = sameMahjongCount === 3;

            // Chow (only for the next player in sequence)
            p.action.isChowable =
              isNextPlayer(room, player, p) &&
              checkChow(p.mahjong.handTiles.mahjongTile, discardedMahjongTile);
          }
        });

        room.mahjong.discardTiles.push({
          ...discardedMahjongTile,
          isSelected: false,
        });

        room.playerList.find((p) => p.playerId === player.playerId).mahjong.handTiles.mahjongTile =
          room.playerList
            .find((p) => p.playerId === player.playerId)
            .mahjong.handTiles.mahjongTile.filter((m) => m.id !== discardedMahjongTile.id);

        player = room.playerList.find((p) => p.playerId === player.playerId);

        updatePlayer(player).then((playerU) => {
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
        });
      }
    } else {
      resolve({
        ...room,
        response: {
          isSuccess: false,
          updateMessage: `You cannot discard tile now.`,
        },
      });
    }
  });
}

function drawMahjong(room, player, isStartGame = false) {
  return new Promise(async function (resolve, reject) {
    // check if the player is drawable
    if ((player.mahjong.handTiles.mahjongTile.length - 2) % 3 !== 0 || isStartGame) {
      let newMahjong;
      do {
        // check is this mahjong tile is last tile from the remaining list
        let isLastTile = room.mahjong.remainingTiles.length === 0;

        newMahjong = room.mahjong.remainingTiles[0];
        room.mahjong.remainingTiles.shift();

        if (newMahjong.type !== "Flower") {
          // add mahjong to hand tile list
          room.playerList
            .find((p) => p.playerId === player.playerId)
            .mahjong.handTiles.mahjongTile.push(newMahjong);
        } else {
          // flower tile list add mahjong tile
          room.playerList
            .find((p) => p.playerId === player.playerId)
            .mahjong.flowerTiles.mahjongTile.push(newMahjong);

          // add flower points
          room.playerList.find((p) => p.playerId === player.playerId).mahjong.flowerTiles.point +=
            calculateFlowerTilePoints(
              newMahjong,
              room.playerList.find((p) => p.playerId === player.playerId)
            );

          room.playerList.find((p) => p.playerId === player.playerId).drawAction = {
            isDrawFlower: true,
            isDrawKong: false,
            isDrawSecondKong: false,
            isGetKong: false,
            isGetPong: false,
            isStealKong: false,
            isKaLong: false,
            isSoloPong: false,
            isDrawLastTile: isLastTile,
            isSoloDraw: true,
          };
        }
      } while (newMahjong.type === "Flower");

      room.playerList.forEach((p) => {
        p.action = {
          isPongable: false,
          isSecondPongable: false,
          isKongable: false,
          isChowable: false,
          isSelfKongable:
            p.playerId === player.playerId &&
            isKongableFromHandSet(newMahjong, player.mahjong.handTiles.mahjongTile),
          isWinnable: false,
        };
        updatePlayer(p).then((playerU) => {});
      });

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
          updateMessage: `Player ${
            room.playerList.find((p) => p.direction === room.gameOrder).playerName
          }'s turn.`,
        },
      });
    });
  });
}

function actions(action, room, player, selectedMahjong) {
  return new Promise(async function (resolve, reject) {
    // set the selected mahjong isTaken = true
    selectedMahjong.isTaken = true;
    mahjongInDiscardTile.isTaken = room.mahjong.discardTiles.find(
      (m) => m.id === selectedMahjong.id
    );

    switch (action) {
      case "pong":
        room.playerList.forEach((p) => {
          if (p.playerId === player.playerId) {
            let mahjongPongList = [];

            // reset
            p.action.isPongable = false;
            p.action.isSecondPongable = false;
            p.action.isKongable = false;
            p.action.isChowable = false;
            p.action.isWinnable = false;
            p.action.isSelfKongable = false;

            let sameTileCount = 0;
            // priotize 2 same tile then only come to pong with joker
            p.mahjong.handTiles.mahjongTile.forEach((m) => {
              if (m.code === selectedMahjong.code) {
                sameTileCount++;
              }
            });

            mahjongPongList.push(selectedMahjong);

            // check if got 2 same tiles, else use joker
            if (sameTileCount >= 2) {
              // push to public tile set
              for (let i = 0; i < 2; i++) {
                let pongTileInHand = p.mahjong.handTiles.mahjongTile.find(
                  (m) => m.code === selectedMahjong.code
                );
                p.mahjong.handTiles.mahjongTile = p.mahjong.handTiles.mahjongTile.filter(
                  (m) => m.id !== pongTileInHand.id
                );
                mahjongPongList.push(pongTileInHand);
              }
            } else {
              // use joker
              let pongTileInHand = p.mahjong.handTiles.mahjongTile.find(
                (m) => m.code === selectedMahjong.code
              );
              p.mahjong.handTiles.mahjongTile = p.mahjong.handTiles.mahjongTile.filter(
                (m) => m.id !== pongTileInHand.id
              );
              mahjongPongList.push(pongTileInHand);

              let jokerTileInHand = p.mahjong.handTiles.mahjongTile.find((m) => m.joker);
              p.mahjong.handTiles.mahjongTile = p.mahjong.handTiles.mahjongTile.filter(
                (m) => m.id !== jokerTileInHand.id
              );
              mahjongPongList.push(jokerTileInHand);
            }

            p.mahjong.publicTiles.push({ mahjongTile: mahjongPongList });

            p.drawAction = {
              isDrawFlower: false,
              isDrawKong: false,
              isDrawSecondKong: false,
              isGetKong: false,
              isGetPong: true,
              isStealKong: false,
              isKaLong: false,
              isSoloPong: false,
              isDrawLastTile: false,
              isSoloDraw: false,
            };
          }
        });
        break;
      case "kong":
        let mahjongKongList = [];
        room.playerList.forEach((p) => {
          if (p.playerId === player.playerId) {
            // reset
            p.action.isPongable = false;
            p.action.isSecondPongable = false;
            p.action.isKongable = false;
            p.action.isChowable = false;
            p.action.isWinnable = false;
            p.action.isSelfKongable = false;

            for (let i = 0; i < 3; i++) {
              let kongTileInHand = p.mahjong.handTiles.mahjongTile.find(
                (m) => m.code === selectedMahjong.code
              );
              p.mahjong.handTiles.mahjongTile = p.mahjong.handTiles.mahjongTile.filter(
                (m) => m.id !== kongTileInHand.id
              );
              mahjongKongList.push(kongTileInHand);
            }

            mahjongKongList.push(selectedMahjong);
            p.mahjong.publicTiles.push({ mahjongTile: mahjongKongList });

            drawMahjong(room, p).then((draw) => {});

            p.drawAction = {
              isDrawFlower: false,
              isDrawKong: false,
              isDrawSecondKong: false,
              isGetKong: true,
              isGetPong: false,
              isStealKong: false,
              isKaLong: false,
              isSoloPong: false,
              isDrawLastTile: false,
              isSoloDraw: false,
            };
          }
        });
        break;
      case "self-kong":
        let mahjongSelfKongList = [];
        room.playerList.forEach((p) => {
          if (p.playerId === player.playerId) {
            p.action.isSelfKongable = false;

            for (let i = 0; i < 3; i++) {
              let kongTileInHand = p.mahjong.handTiles.mahjongTile.find(
                (m) => m.code === selectedMahjong.code
              );
              p.mahjong.handTiles.mahjongTile = p.mahjong.handTiles.mahjongTile.filter(
                (m) => m.id !== kongTileInHand.id
              );
              mahjongSelfKongList.push(kongTileInHand);
            }
            let kongTileInHand = p.mahjong.handTiles.mahjongTile.find(
              (m) => m.code === selectedMahjong.code
            );
            p.mahjong.handTiles.mahjongTile = p.mahjong.handTiles.mahjongTile.filter(
              (m) => m.id !== kongTileInHand.id
            );

            mahjongSelfKongList.push(selectedMahjong);
            p.mahjong.publicTiles.push({ mahjongTile: mahjongSelfKongList });

            let isSecondKong = false;
            if (p.drawAction.isDrawKong || p.drawAction.isGetKong) {
              isSecondKong = true;
            }

            p.drawAction = {
              isDrawFlower: false,
              isDrawKong: true,
              isDrawSecondKong: isSecondKong,
              isGetKong: false,
              isGetPong: false,
              isStealKong: false,
              isKaLong: false,
              isSoloPong: false,
              isDrawLastTile: false,
              isSoloDraw: false,
            };

            drawMahjong(room, p).then((drawRoomU) => {
              room = {
                ...drawRoomU,
              };
            });
          }
        });
        break;
    }

    room.gameOrder = player.direction;
    updatePlayer(room.playerList.find((p) => p.playerId === player.playerId)).then((up) => {});
    updateRoom(room).then((roomU) => {
      resolve({
        ...roomU,
        response: {
          isSuccess: true,
        },
      });
    });
  });
}

function chowAction(room, player, selectedMahjongChow, selectedMahjong) {
  return new Promise(async function (resolve, reject) {
    let list = selectedMahjongChow.concat(selectedMahjong);
    list = list.sort((a, b) => a.code - b.code);
    if (isConsecutive(list[0].code, list[1].code, list[2].code)) {
      player.mahjong.handTiles.mahjongTile = player.mahjong.handTiles.mahjongTile.filter(
        (m) => m.id !== selectedMahjongChow[0].id && m.id !== selectedMahjongChow[1].id
      );

      // add to public list
      let newPublicGrpList = [];
      for (let i = 0; i < 3; i++) {
        list[i].isSelected = false;
        list[i].isTaken = list[i].id === selectedMahjong.id ? true : false;
        newPublicGrpList.push(list[i]);
      }

      player.mahjong.publicTiles.push({ mahjongTile: newPublicGrpList });
      player.action.isChowable = false;

      room.mahjong.discardTiles.find((m) => m.id === selectedMahjong.id).isTaken = true;
      room.playerList.find((p) => p.playerId === player.playerId).mahjong = player.mahjong;
      room.playerList.find((p) => p.playerId === player.playerId).action = player.action;
      room.gameOrder = player.direction;

      updatePlayer(player).then((up) => {});
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
          updateMessage: "Selected tiles is not able to Chow.",
        },
      });
    }
  });
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

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
        combination.isPingHu =
          combination.isQuanTongZi && checkPingHu(mahjongList) && !player.drawAction.isKaLong;

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
        combination.isKanKanHu =
          isDuiDuiHu(mahjongList) &&
          (player.drawAction.isSoloDraw || player.drawAction.isSoloPong) &&
          player.mahjong.publicTiles.length === 0;
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
  const windsNeeded = [
    Math.max(0, 3 - groupedTiles.east),
    Math.max(0, 3 - groupedTiles.south),
    Math.max(0, 3 - groupedTiles.west),
    Math.max(0, 3 - groupedTiles.north),
  ];
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
  const pairPossible =
    Object.values(tileCounts).some((count) => count >= 2) || remainingJokers >= 2;

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
  const windsNeededForPungs = [
    Math.max(0, 3 - groupedTiles.east),
    Math.max(0, 3 - groupedTiles.south),
    Math.max(0, 3 - groupedTiles.west),
    Math.max(0, 3 - groupedTiles.north),
  ];

  const pungsPossible = windsNeededForPungs.filter((n) => n === 0).length;
  if (pungsPossible < 3) return false; // Must have exactly 3 Pungs of Winds

  // Identify the Wind type that should form the pair
  const pairCandidateIndex = windsNeededForPungs.findIndex((n) => n > 0);
  if (pairCandidateIndex === -1 || windsNeededForPungs[pairCandidateIndex] > 2) return false;

  const remainingJokers = groupedTiles.jokers - windsNeededForPungs.reduce((sum, n) => sum + n, 0);
  if (remainingJokers < 0) return false;

  // Check for the pair in the fourth Wind or use Jokers
  const pairWindCounts = [
    groupedTiles.east,
    groupedTiles.south,
    groupedTiles.west,
    groupedTiles.north,
  ][pairCandidateIndex];

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
  const nonYaokyuuCircles = mahjongList.filter(
    (tile) => tile.type === "Circles" && !yaokyuuTiles.includes(tile.code.slice(-1))
  );
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
    if (
      nonJokerTiles[0].code === nonJokerTiles[1].code &&
      nonJokerTiles[1].code === nonJokerTiles[2].code
    ) {
      return true;
    }

    // Check for Chow (three consecutive tiles of the same suit)
    if (
      isConsecutive(nonJokerTiles[0].code, nonJokerTiles[1].code, nonJokerTiles[2].code) &&
      !onlyPungSet
    ) {
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
  if (
    !isJoker(code1) &&
    !isJoker(code2) &&
    !isJoker(code3) &&
    (suit1 !== suit2 || suit2 !== suit3)
  ) {
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
      } else if (
        (set[0].direction === 0 || set[0].direction === player.direction) &&
        set[0].type !== "Circles" &&
        !set[0].joker
      ) {
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

export {
  createGame,
  playerJoinRoom,
  updateRoom,
  playerQuitRoom,
  discardMahjong,
  nextTurn,
  drawMahjong,
  updatePlayer,
  actions,
  chowAction,
  updateRoomAndPlayer,
  calculateMahjongSetPoints,
  testGame,
};
