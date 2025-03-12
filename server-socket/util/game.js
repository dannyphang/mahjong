import * as API from "../shared/service.js";

function getAllMahjong() {
  return new Promise(async function (resolve, reject) {
    API.getMahjong().then((res) => {
      resolve(res.data.data);
    });
  });
}

function getMahjongByUid(uid) {
  return new Promise(async function (resolve, reject) {
    API.getMahjongByUid(uid).then((res) => {
      resolve(res.data.data);
    });
  });
}

function createGame(room) {
  return new Promise(async function (resolve, reject) {
    let mahjongList = [];
    getAllMahjong().then(async (list) => {
      let playerList = room.playerList;
      mahjongList = list;

      // init default data
      room.gameStarted = true;
      room.gameOrder = 1;
      room.mahjong = {
        ...room.mahjong,
        remainingTiles: [],
        discardTiles: [],
        takenTiles: [],
      };
      room.waiting = 0;
      room.waitingPlayer = null;
      room.waitingAction = null;
      room.waitingTile = null;
      room.waitingChowTiles = [];
      room.waitingWinTiles = [];

      // shuffle mahjong list
      // the new mahjong list will be mahjong uid list only
      let newMahjongList = shuffleArray(mahjongList).map((item) => item.uid);

      // shuffle directions
      const directions = [1, 2, 3];
      const shuffledDirections = shuffleArray(directions);

      playerList.forEach((player, index) => {
        player.direction = shuffledDirections[index];
        player.action = {};
        player.drawAction = {};
      });

      for (let i = 0; i < playerList.length; i++) {
        // check is the player direction is East, if so 14 tiles, else 13 tiles
        let handTileAmount = room.playerList[i].direction === 1 ? 14 : 13;

        // reset flower and hand tiles and points
        playerList[i].mahjong.publicTiles = [];
        playerList[i].mahjong.handTiles.mahjongTile = [];
        playerList[i].mahjong.flowerTiles.mahjongTile = [];
        playerList[i].mahjong.handTiles.point = 0;
        playerList[i].mahjong.flowerTiles.point = 0;

        // reset action to init value
        playerList[i].action = {};
        playerList[i].drawAction = {};

        for (let j = 0; j < handTileAmount; j++) {
          // set hand tile and flower tile
          let newMahjong;
          do {
            newMahjong = getAllMahjongByUid(mahjongList, newMahjongList[0]);
            if (newMahjong.type !== "Flower") {
              playerList[i].mahjong.handTiles.mahjongTile.push(newMahjong);
            } else {
              room.playerList[i].mahjong.flowerTiles.mahjongTile.push(newMahjong);
              room.playerList[i].mahjong.flowerTiles.point += (
                await API.calculateFlowerTilePoints(newMahjong, room.playerList[i])
              ).data.data;
            }

            newMahjongList = newMahjongList.filter((m) => m !== newMahjong.uid);
          } while (newMahjong.type === "Flower");

          // sort the mahjong handtile list
          playerList[i].mahjong.handTiles.mahjongTile.sort((a, b) => a.order - b.order);
        }

        // store the rest mahjong list to remaining mahjong set
        room.mahjong.remainingTiles = newMahjongList;

        // check if the flower tile set got 'flower gang', then +1 more extra point (2 + 1 = 3)
        if (
          playerList[i].mahjong.flowerTiles.mahjongTile.find((m) => m.code === "spring") &&
          playerList[i].mahjong.flowerTiles.mahjongTile.find((m) => m.code === "summer") &&
          playerList[i].mahjong.flowerTiles.mahjongTile.find((m) => m.code === "autumn") &&
          playerList[i].mahjong.flowerTiles.mahjongTile.find((m) => m.code === "winter")
        ) {
          playerList[i].mahjong.flowerTiles.point++;
        }
        if (
          playerList[i].mahjong.flowerTiles.mahjongTile.find((m) => m.code === "plum") &&
          playerList[i].mahjong.flowerTiles.mahjongTile.find((m) => m.code === "orchid") &&
          playerList[i].mahjong.flowerTiles.mahjongTile.find((m) => m.code === "chrysanthemum") &&
          playerList[i].mahjong.flowerTiles.mahjongTile.find((m) => m.code === "bamboo")
        ) {
          room.playerList[i].mahjong.flowerTiles.point++;
        }

        updatePlayer(playerList[i]).then((playerU) => {});
      }

      // sort player by direction
      playerList.sort((a, b) => a.direction - b.direction);

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

function testGame(room) {
  return new Promise(async function (resolve, reject) {
    try {
      getAllMahjong().then((list) => {
        const mahjongList = list;

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

        let playerThreeHand = [
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
            id: 41,
            order: 22,
            type: "Circles",
            joker: false,
            name: "5 Circle",
            code: "circle_5",
            direction: 0,
            uid: "UwRnt75Zvu5cZ93WCbWi",
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

        const newMahjongList = shuffleArray(mahjongList).map((item) => item.uid);
        let remainingTiles = newMahjongList;

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
          player.action = {};
          player.drawAction = {};
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

        // assignWinnable(room).then((roomWin) => {
        //   room.playerList = roomWin.playerList;
        // });

        room.mahjong = {
          ...room.mahjong,
          remainingTiles: remainingTiles,
          discardTiles: [],
          takenTiles: [],
        };
        room.waitingPlayer = null;
        room.waitingAction = null;
        room.waitingTile = null;
        room.waitingChowTiles = [];
        room.waitingWinTiles = [];
        room.gameOrder = 1;
        room.gameStarted = true;

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
    } catch (error) {
      console.log(error);
    }
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
    if (!room.playerList.find((p) => p === player.playerId)) {
      if (room.playerList.length <= 3) {
        room.playerList.push(player.playerId);
      } else {
        resolve({
          ...room,
          updateMessage: `Room player cannot more than 3 players`,
        });
      }
    }

    updateRoom(room)
      .then((roomU) => {
        resolve({
          ...roomU,
          response: {
            isSuccess: true,
            updateMessage: `${player.playerName} is joined the room.`,
          },
        });
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
}

function updateRoom(room) {
  return new Promise(async function (resolve, reject) {
    API.updateRoom(room)
      .then((res) => {
        let newUpdatedRoom = res.data.data;
        resolve({
          ...newUpdatedRoom,
          response: {
            isSuccess: true,
          },
        });
      })
      .catch((error) => {
        console.log(error);
        resolve({
          response: {
            isSuccess: false,
            updateMessage: error,
          },
        });
      });
  });
}

function updatePlayer(player) {
  return new Promise(async function (resolve, reject) {
    API.updatePlayer(player)
      .then((res) => {
        resolve(player);
      })
      .catch((error) => {
        resolve(error);
      });
  });
}

function playerQuitRoom(room, player) {
  return new Promise(async function (resolve, reject) {
    room.playerList = room.playerList.filter((p) => p.playerId !== player.playerId);

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

function discardMahjongV1(room, player, discardedMahjongTile) {
  return new Promise(async function (resolve, reject) {
    // check player handtile number
    if ((player.mahjong.handTiles.mahjongTile.length - 2) % 3 === 0) {
      discardedMahjongTile.isSelected = false;
      room.mahjong.discardTiles.push(discardedMahjongTile.uid);

      room.playerList.find((p) => p.playerId === player.playerId).mahjong.handTiles.mahjongTile =
        room.playerList
          .find((p) => p.playerId === player.playerId)
          .mahjong.handTiles.mahjongTile.filter((m) => m.id !== discardedMahjongTile.id);

      player = room.playerList.find((p) => p.playerId === player.playerId);

      await updatePlayer(player);
      updateRoom(room).then((roomU) => {
        resolve({
          ...roomU,
          response: {
            isSuccess: true,
            updateMessage: `${player.playerName} discarded ${discardedMahjongTile.name}.`,
          },
        });
      });
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

function discardMahjong(room, player, discardedMahjongTile) {
  return new Promise(async function (resolve, reject) {
    // reset waiting object
    room.waiting = 0;
    room.waitingPlayer = {};
    room.waitingAction = "";

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
        let isActionWillBeTrigger = false;

        // check if other player can do any action
        await Promise.all(
          room.playerList.map(async (p) => {
            if (p.playerId !== player.playerId) {
              // reset player action & drawAction
              player.action = {};
              player.drawAction = {};

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
              if (sameMahjongCount >= 2 || (jokerCount >= 1 && sameMahjongCount >= 1)) {
                p.action.isPongable = true;
                isActionWillBeTrigger = true;
              } else {
                p.action.isPongable = false;
              }

              // kong (hand)
              if (sameMahjongCount === 3) {
                p.action.isKongable = true;
                isActionWillBeTrigger = true;
              } else {
                p.action.isKongable = false;
              }

              // Chow (only for the next player in sequence)
              const isNext = (await API.isNextPlayer(room, player, p)).data.data;
              if (isNext) {
                const chowable = (
                  await API.checkChow(p.mahjong.handTiles.mahjongTile, discardedMahjongTile)
                ).data.data;
                p.action.isChowable = chowable;
                isActionWillBeTrigger = chowable;
              } else {
                p.action.isChowable = false;
              }
            }
          })
        );

        // TODO: win

        discardedMahjongTile.isSelected = false;
        room.mahjong.discardTiles.push(discardedMahjongTile.uid);

        room.playerList.find((p) => p.playerId === player.playerId).mahjong.handTiles.mahjongTile =
          room.playerList
            .find((p) => p.playerId === player.playerId)
            .mahjong.handTiles.mahjongTile.filter((m) => m.id !== discardedMahjongTile.id);

        player = room.playerList.find((p) => p.playerId === player.playerId);

        await updatePlayer(player);
        updateRoom(room).then((roomU) => {
          if (isActionWillBeTrigger) {
            resolve({
              ...roomU,
              response: {
                isSuccess: true,
                updateMessage: `${player.playerName} discarded ${discardedMahjongTile.name}.`,
              },
            });
          } else {
            nextTurn(roomU).then((roomNU) => {
              resolve({
                ...roomNU,
                response: {
                  isSuccess: true,
                  updateMessage: `${player.playerName} discarded ${discardedMahjongTile.name}.`,
                },
              });
            });
          }
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

function drawMahjong(room, player) {
  return new Promise(async function (resolve, reject) {
    // get all mahjong from api
    let mahjongList = [];
    getAllMahjong()
      .then(async (list) => {
        mahjongList = list;

        // check if the player is drawable
        if ((player.mahjong.handTiles.mahjongTile.length - 2) % 3 !== 0) {
          let newMahjong;
          do {
            // check is this mahjong tile is last tile from the remaining list
            let isLastTile = room.mahjong.remainingTiles.length === 0;

            newMahjong = getAllMahjongByUid(mahjongList, room.mahjong.remainingTiles[0]);
            newMahjong = room.mahjong.remainingTiles[0];
            room.mahjong.remainingTiles = room.mahjong.remainingTiles.filter(
              (m) => m.id !== newMahjong.id
            );

            if (newMahjong.type !== "Flower") {
              // check if the draw tile is the mahjong that match to public tile list that pong with joker
              // if so can raise joker
              room.playerList
                .find((p) => p.playerId === player.playerId)
                .mahjong.publicTiles.forEach((list) => {
                  if (
                    list.mahjongTile.find((m) => m.joker) &&
                    list.mahjongTile.filter((tile) => tile.code === newMahjong.code).length === 2
                  ) {
                    raiseJoker = true;
                    list.mahjongTile.push(newMahjong);
                    newMahjong = list.mahjongTile.find((m) => m.joker);
                    list.mahjongTile = list.mahjongTile.filter((m) => !m.joker);
                  }
                });

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
              room.playerList.find(
                (p) => p.playerId === player.playerId
              ).mahjong.flowerTiles.point += (
                await API.calculateFlowerTilePoints(
                  newMahjong,
                  room.playerList.find((p) => p.playerId === player.playerId)
                )
              ).data.data;

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
          room.playerList.forEach(async (p) => {
            p.action = {
              isPongable: false,
              isKongable: false,
              isChowable: false,
              isSelfKongable:
                p.playerId === player.playerId &&
                (await API.isKongableFromHandSet(newMahjong, player.mahjong.handTiles.mahjongTile))
                  .data.data,
              isWinnable: false,
            };
            updatePlayer(p).then((playerU) => {});
          });

          updateRoom(room).then((roomU) => {
            resolve({
              ...roomU,
              response: {
                isSuccess: true,
                updateMessage: "Raise Joker!",
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
      })
      .catch((error) => {
        console.log(error);
        resolve({
          ...room,
          response: {
            isSuccess: false,
            updateMessage: error,
          },
        });
      });
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

function actionV1(action, room, player, selectedMahjong, selectedMahjongChow = []) {
  return new Promise(async function (resolve, reject) {
    if (room.waitingPlayer) {
      if (room.waitingAction === "cancel" && action === "cancel") {
        nextTurn(room).then(async (roomNU) => {
          resolve(roomNU);
        });
      } else {
        // if current action is chow, but the pong is in waitingAction, then set current action to pong and set the current player to the waiting player
        if (room.waitingAction !== "chow" && room.waitingAction !== "cancel") {
          player = room.playerList.find((p) => p.playerId === room.waitingPlayer);
          action = room.waitingAction;

          selectedMahjong = await getMahjongByUid(room.waitingTile);
        } else if (room.waitingAction === "chow") {
          player = room.playerList.find((p) => p.playerId === room.waitingPlayer);
          action = room.waitingAction;

          room.waitingChowTiles.forEach(async (wct) => {
            selectedMahjongChow.push(await getMahjongByUid(wct));
          });
        }
        performAction(action, room, player, selectedMahjong, selectedMahjongChow).then(
          (actionRoom) => {
            resolve(actionRoom);
          }
        );
      }
    } else {
      room.waitingPlayer = player?.playerId;
      room.waitingAction = action;
      room.waitingTile = selectedMahjong?.uid;
      room.waitingChowTiles = selectedMahjongChow?.map((item) => item.uid);

      room.mahjong.remainingTiles = room.mahjong.remainingTiles.map((item) => item.uid ?? item);
      room.mahjong.discardTiles = room.mahjong.discardTiles.map((item) => item.uid ?? item);

      room.playerList = room.playerList.map((item) => item.playerId ?? item);
      updateRoom(room).then((roomU) => {
        resolve({
          ...roomU,
          response: {
            isSuccess: true,
            updateMessage: `${player.playerName} done action.`,
          },
        });
      });
    }
  });
}

function performAction(action, room, player, selectedMahjong, selectedMahjongChow = []) {
  return new Promise(async function (resolve, reject) {
    // if the waiting player is not cancelled, then compare
    if (action === "cancel") {
      player = room.playerList.find((p) => p.playerId === room.waitingPlayer);
      action = room.waitingAction;
      selectedMahjong = await getMahjongByUid(room.waitingTile);
      if (room.waitingAction === "chow") {
        selectedMahjongChow = room.waitingChowTiles;
      } else {
        room.waitingChowTiles = [];
      }
    }

    switch (action) {
      case "pong":
        if (player) {
          let mahjongPongList = [];

          // reset
          player.action = {};

          let sameTileCount = 0;
          // priotize 2 same tile then only come to pong with joker
          player.mahjong.handTiles.mahjongTile.forEach((m) => {
            if (m.code === selectedMahjong.code) {
              sameTileCount++;
            }
          });

          mahjongPongList.push(selectedMahjong);

          // check if got 2 same tiles, else use joker
          if (sameTileCount >= 2) {
            // push to public tile set
            for (let i = 0; i < 2; i++) {
              let pongTileInHand = player.mahjong.handTiles.mahjongTile.find(
                (m) => m.code === selectedMahjong.code
              );
              player.mahjong.handTiles.mahjongTile = player.mahjong.handTiles.mahjongTile.filter(
                (m) => m.id !== pongTileInHand.id
              );
              mahjongPongList.push(pongTileInHand);
            }
          } else {
            // use joker
            let pongTileInHand = player.mahjong.handTiles.mahjongTile.find(
              (m) => m.code === selectedMahjong.code
            );
            player.mahjong.handTiles.mahjongTile = player.mahjong.handTiles.mahjongTile.filter(
              (m) => m.id !== pongTileInHand.id
            );
            mahjongPongList.push(pongTileInHand);

            let jokerTileInHand = player.mahjong.handTiles.mahjongTile.find((m) => m.joker);
            player.mahjong.handTiles.mahjongTile = player.mahjong.handTiles.mahjongTile.filter(
              (m) => m.id !== jokerTileInHand.id
            );
            mahjongPongList.push(jokerTileInHand);
          }

          if (!player.mahjong.publicTiles) {
            player.mahjong.publicTiles = [];
          }
          player.mahjong.publicTiles.push({ mahjongTile: mahjongPongList });

          if (!room.mahjong.takenTiles) {
            room.mahjong.takenTiles = [];
          }
          room.mahjong.takenTiles.push(selectedMahjong.uid);

          player.drawAction = {
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
        break;
      case "kong":
        if (player) {
          let mahjongKongList = [];

          // reset
          player.action = {};

          for (let i = 0; i < 3; i++) {
            let kongTileInHand = p.mahjong.handTiles.mahjongTile.find(
              (m) => m.code === selectedMahjong.code
            );
            player.mahjong.handTiles.mahjongTile = player.mahjong.handTiles.mahjongTile.filter(
              (m) => m.id !== kongTileInHand.id
            );
            mahjongKongList.push(kongTileInHand);
          }

          mahjongKongList.push(selectedMahjong);

          if (!player.mahjong.publicTiles) {
            player.mahjong.publicTiles = [];
          }
          player.mahjong.publicTiles.push({ mahjongTile: mahjongKongList });

          if (!room.mahjong.takenTiles) {
            room.mahjong.takenTiles = [];
          }
          room.mahjong.takenTiles.push(selectedMahjong.uid);

          await drawMahjong(room, player).then((draw) => {});

          player.drawAction = {
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
        break;
      case "self-kong":
        if (player) {
          let mahjongSelfKongList = [];
          // reset
          player.action = {};

          for (let i = 0; i < 3; i++) {
            let kongTileInHand = player.mahjong.handTiles.mahjongTile.find(
              (m) => m.code === selectedMahjong.code
            );
            player.mahjong.handTiles.mahjongTile = player.mahjong.handTiles.mahjongTile.filter(
              (m) => m.id !== kongTileInHand.id
            );
            mahjongSelfKongList.push(kongTileInHand);
          }
          let kongTileInHand = p.mahjong.handTiles.mahjongTile.find(
            (m) => m.code === selectedMahjong.code
          );
          player.mahjong.handTiles.mahjongTile = player.mahjong.handTiles.mahjongTile.filter(
            (m) => m.id !== kongTileInHand.id
          );

          mahjongSelfKongList.push(selectedMahjong);

          if (!player.mahjong.publicTiles) {
            player.mahjong.publicTiles = [];
          }
          player.mahjong.publicTiles.push({ mahjongTile: mahjongSelfKongList });

          if (!room.mahjong.takenTiles) {
            room.mahjong.takenTiles = [];
          }
          room.mahjong.takenTiles.push(selectedMahjong.uid);

          let isSecondKong = false;
          if (player.drawAction.isDrawKong || player.drawAction.isGetKong) {
            isSecondKong = true;
          }

          player.drawAction = {
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

          await drawMahjong(room, player).then((drawRoomU) => {
            room = {
              ...drawRoomU,
            };
          });
        }
        break;
      case "chow":
        if (player) {
          let list = selectedMahjongChow.concat(selectedMahjong);
          list = list.sort((a, b) => a.code - b.code);
          if ((await API.isConsecutive(list[0].code, list[1].code, list[2].code)).data.data) {
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

            if (!room.mahjong.takenTiles) {
              room.mahjong.takenTiles = [];
            }
            room.mahjong.takenTiles.push(selectedMahjong.uid);
            room.gameOrder = player.direction;

            await updatePlayer(player).then((up) => {});
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

          break;
        }
        break;
    }

    // reset
    room.waitingPlayer = null;
    room.waitingAction = null;
    room.waitingTile = null;
    room.waitingChowTiles = [];

    room.mahjong.remainingTiles = room.mahjong.remainingTiles.map((item) => item.uid ?? item);
    room.mahjong.discardTiles = room.mahjong.discardTiles.map((item) => item.uid ?? item);

    room.playerList = room.playerList.map((item) => item.playerId ?? item);

    updatePlayer(player).then((_) => {
      updateRoom(room).then((roomU) => {
        resolve({
          ...roomU,
          response: {
            isSuccess: true,
          },
        });
      });
    });
  });
}

function actions(action, room, player, selectedMahjong, selectedMahjongChow = []) {
  return new Promise(async function (resolve, reject) {
    // if current action is chow, but the pong is in waitingAction, then set current action to cancel
    if (action === "chow" && room.waitingAction === "pong") {
      action = "cancel";
    }

    // check if the action is 'cancel'
    // if yes, then check if other player is pongable
    //  - if yes, then wait for the player do the action
    //  - else next turn
    if (action === "cancel") {
      let otherPlayer =
        room.waitingPlayer ??
        room.playerList.find(
          (op) => op.direction !== room.gameOrder && op.playerId !== player.playerId
        );

      // reset player action after cancelled
      player.action = {};
      room.playerList.find((p) => p.playerId === player.playerId).action = {};

      await updatePlayer(player);
      await updateRoom(room);

      if (room.waiting === 2) {
        // now both player also cancel
        nextTurn(room).then((roomNU) => {
          resolve({
            ...roomNU,
            response: {
              isSuccess: true,
              // updateMessage: `${player.playerName} discarded ${discardedMahjongTile.name}.`,
            },
          });
        });
      } else if (room.waiting === 1) {
        // if current player is cancel then other player is alr waiting, then trigger the action function
        player = otherPlayer;
        action = room.waitingAction;
        room.waiting = 2;
      } else {
        // if current player is cancel then other player is pending to confirm the action, then room.waiting set to cancelled
        room.waiting = 2;
        updateRoom(room).then((roomU) => {
          resolve({
            ...roomU,
            response: {
              isSuccess: true,
            },
          });
        });
      }
    }

    // check if the player is top prior to do this action or not
    // yes, then no need to wait for others player and do the action function
    if (room.waiting === 2 || (await checkActionPriority(action, room, player, selectedMahjong))) {
      switch (action) {
        case "pong":
          room.playerList.forEach((p) => {
            if (p.playerId === player.playerId) {
              let mahjongPongList = [];

              // reset
              p.action = {};

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
              p.action = {};

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
              // reset
              p.action = {};

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
        case "chow":
          if (room.waiting === 2) {
            selectedMahjongChow = room.waitingChowTiles;
          }
          let list = selectedMahjongChow.concat(selectedMahjong);
          list = list.sort((a, b) => a.code - b.code);
          if ((await API.isConsecutive(list[0].code, list[1].code, list[2].code)).data.data) {
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

            room.mahjong.takenTiles.push(selectedMahjong.id);
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
          break;
      }

      // set the selected mahjong isTaken = true
      selectedMahjong.isTaken =
        action === "pong" || action === "kong" || action === "self-kong" || action === "chow";
      let mahjongInDiscardTile = room.mahjong.discardTiles.find((m) => m === selectedMahjong.uid);
      if (mahjongInDiscardTile) {
        mahjongInDiscardTile.isTaken =
          action === "pong" || action === "kong" || action === "self-kong" || action === "chow";
      }

      if (action !== "cancel") {
        room.playerList.forEach((p) => {
          p.action = {};
          if (p.playerId !== player.playerId) {
            p.drawAction = {};
          }
        });
      }

      room.waitingPlayer = {};
      room.gameOrder = action === "cancel" ? room.gameOrder : player.direction;
      updatePlayer(room.playerList.find((p) => p.playerId === player.playerId)).then((up) => {});
    } else {
      // reach here means other player also got fake or real set
      // but the current player trigger here 1st and also not next player
      room.waitingPlayer = player;
      room.waitingAction = action;
      room.waiting = 1;
      room.waitingChowTiles = selectedMahjongChow;
    }
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
    actionV1("chow", room, player, selectedMahjong, selectedMahjongChow).then((res) =>
      resolve(res)
    );
  });
}

function getAllMahjongByUid(mahjongList, uid) {
  return mahjongList.find((m) => m.uid === uid);
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

async function checkActionPriority(action, room, player, selectedMahjong) {
  let currentPlayerSameTileCount = 0;
  let otherPlayerSameTileCount = 0;

  player.mahjong.handTiles.mahjongTile.forEach((m) => {
    if (m.code === selectedMahjong.code) {
      currentPlayerSameTileCount++;
    }
  });

  // check if its real set or fake set
  // if real set then return true
  if (action === "pong" && currentPlayerSameTileCount >= 2) {
    return true;
  }

  if (action === "chow" && room.waitingAction === "pong") {
    return false;
  }

  // if the code come to here, means it is fake set
  // then check if other player got the fake or real set,
  // if no (means other player no fake and real set), then return true
  // if yes (means both player also fake set), then if this current player is next player then return true
  // else return false
  let otherPlayer = room.playerList.find(
    (op) => op.direction !== room.gameOrder && op.playerId !== player.playerId
  );
  otherPlayer.mahjong.handTiles.mahjongTile.forEach((m) => {
    if (m.code === selectedMahjong.code) {
      otherPlayerSameTileCount++;
    }
  });
  // check if other player is real set
  if (otherPlayerSameTileCount === 2) {
    // other player no fake and real set
    return false;
  } else if (otherPlayerSameTileCount === 0) {
    // other player no fake and real set
    return true;
  } else {
    let currentPlayer = player;
    let checkingPlayer = otherPlayer;
    if (action === "chow") {
      checkingPlayer = player;
      currentPlayer = room.playerList.find((op) => op.direction === room.gameOrder);
    }

    if (
      otherPlayerSameTileCount === 1 &&
      otherPlayer.mahjong.handTiles.mahjongTile.find((m) => m.joker === true) &&
      (await API.isNextPlayer(room, currentPlayer, checkingPlayer)).data.data
    ) {
      // both also fake set but current player is next player so return true
      return true;
    }
  }

  // reach here means current player is not next player but also fake set
  return false;
}

function endGame(room) {
  return new Promise(async (resolve, reject) => {
    room.gameStarted = false;

    room.mahjong = {
      ...room.mahjong,
      discardTiles: [],
      remainingTiles: [],
      takenTiles: [],
    };

    // reset player hand tiles
    // await Promise.all(
    //     room.playerList.map(async (p) => {
    //         p.mahjong = {
    //             flowerTiles: { mahjongTile: [] },
    //             handTiles: { mahjongTile: [] },
    //             publicTiles: [],
    //         };

    //         return updatePlayer(p); // Returns the promise for `Promise.all()`
    //     })
    // );

    room.waitingPlayer = null;
    room.waitingAction = null;
    room.waitingTile = null;
    room.waitingChowTiles = [];

    updateRoom(room)
      .then((roomU) => {
        resolve({
          ...roomU,
          updateMessage: "Game ended.",
        });
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function winAction(room, player, selectedMahjongSet) {
  return new Promise(async function (resolve, reject) {
    // check if both player done action
    if (
      room.waitingAction === "cancel" ||
      room.waitingAction === "win" ||
      room.gameOrder === player.direction
    ) {
      if (room.waitingAction !== "cancel") {
        // check if which player is the next player and win 1st
        // if its not, then set the waiting player into current player
        let isNextPlayer = await API.isNextPlayer(
          room,
          room.playerList.find((p) => p.direction === room.gameOrder),
          player
        );
        if (!isNextPlayer) {
          player = await API.getPlayerByUid(room.waitingPlayer);
          selectedMahjongSet = room.waitingWinTiles;
        }
      }
      // make sure the hand tile is fulfilled the win set number before sending to API
      player.mahjong.handTiles.mahjongTile = selectedMahjongSet;
      API.checkWin(player)
        .then((win) => {
          if (win.data.data.points >= room.mahjong.setting.minPoints) {
            endGame(room)
              .then((endGameUpdate) => {
                resolve({
                  ...endGameUpdate,
                  response: {
                    isSuccess: true,
                    updateMessage: `Player ${player.playerName} won the game!`,
                  },
                });
              })
              .catch((error) => {
                console.log("End game (enuf point) error: ", error);
                reject(error);
              });
          } else {
            endGame(room)
              .then((endGameUpdate) => {
                resolve({
                  ...endGameUpdate,
                  response: {
                    isSuccess: false,
                    updateMessage: `Player ${player.playerName} lost the game!`,
                  },
                });
              })
              .catch((error) => {
                console.log("End game (not enuf point) error: ", error);
                reject(error);
              });
          }
        })
        .catch((error) => {
          console.log("Check win error: ", error);
          reject(error);
        });
    } else {
      room.waitingAction = "win";
      room.waitingPlayer = player.playerId;
      room.waitingWinTiles = selectedMahjongSet;

      resolve(room);
    }
  });
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
  testGame,
  discardMahjongV1,
  actionV1,
  endGame,
  winAction,
};
