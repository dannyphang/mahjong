import * as db from "../firebase/firebase-admin.js";

const roomCollectionName = "room";
const mahjongCollectionName = "mahjong";
const playerCollectionName = "player";

function createGame(room) {
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
            room.playerList[i].mahjong.flowerTiles.point += calculateMahjongTilePoints(
              newMahjong,
              room.playerList[i]
            );
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
        room.playerList[i].mahjong.flowerTiles.mahjongTile.find(
          (m) => m.code === "chrysanthemum"
        ) &&
        room.playerList[i].mahjong.flowerTiles.mahjongTile.find((m) => m.code === "bamboo")
      ) {
        room.playerList[i].mahjong.flowerTiles.point++;
      }

      updatePlayer(room.playerList[i]).then((playerU) => {});
    }

    updateRoom(room).then((roomU) => {
      resolve({
        ...roomU,
        updateMessage: `Game started!`,
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
        updateMessage: `${player.playerName} is joined the room.`,
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
        updateMessage: `${player.playerName} quited the room.`,
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

    room.playerList.forEach((p) => {
      updatePlayer(p).then((playerU) => {});
    });

    nextTurn(room).then((roomNU) => {
      updateRoom(roomNU).then((roomU) => {
        resolve({
          ...roomU,
          updateMessage: `${player.playerName} discarded ${discardedMahjongTile.name}.`,
        });
      });
    });
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
          room.playerList
            .find((p) => p.playerId === player.playerId)
            .mahjong.handTiles.mahjongTile.push(newMahjong);
        } else {
          room.playerList
            .find((p) => p.playerId === player.playerId)
            .mahjong.flowerTiles.mahjongTile.push(newMahjong);
          room.playerList.find((p) => p.playerId === player.playerId).mahjong.flowerTiles.point +=
            calculateMahjongTilePoints(
              newMahjong,
              room.playerList.find((p) => p.playerId === player.playerId)
            );
        }
      } while (newMahjong.type === "Flower");

      updatePlayer(room.playerList.find((p) => p.playerId === player.playerId)).then(
        (playerU) => {}
      );

      updateRoom(room).then((roomU) => {
        resolve(roomU);
      });
    } else {
      resolve({
        ...room,
        updateMessage: `You cannot draw now, please discard a mahjong tile.`,
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
        updateMessage: `Player ${room.gameOrder}'s turn.`,
      });
    });
  });
}

function actions(action, room, player, selectedMahjong) {
  return new Promise(async function (resolve, reject) {
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
                let pongTileInHand = p.mahjong.handTiles.mahjongTile.find(
                  (m) => m.code === selectedMahjong.code
                );
                p.mahjong.handTiles.mahjongTile = p.mahjong.handTiles.mahjongTile.filter(
                  (m) => m.id !== pongTileInHand.id
                );
                p.mahjong.publicTiles.mahjongTile.push(pongTileInHand);
              }
            } else {
              // use joker
              let pongTileInHand = p.mahjong.handTiles.mahjongTile.find(
                (m) => m.code === selectedMahjong.code
              );
              p.mahjong.handTiles.mahjongTile = p.mahjong.handTiles.mahjongTile.filter(
                (m) => m.id !== pongTileInHand.id
              );
              p.mahjong.publicTiles.mahjongTile.push(pongTileInHand);

              let jokerTileInHand = p.mahjong.handTiles.mahjongTile.find((m) => m.joker);
              p.mahjong.handTiles.mahjongTile = p.mahjong.handTiles.mahjongTile.filter(
                (m) => m.id !== jokerTileInHand.id
              );
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
              let pongTileInHand = p.mahjong.handTiles.mahjongTile.find(
                (m) => m.code === selectedMahjong.code
              );
              p.mahjong.handTiles.mahjongTile = p.mahjong.handTiles.mahjongTile.filter(
                (m) => m.id !== pongTileInHand.id
              );
              p.mahjong.publicTiles.mahjongTile.push(pongTileInHand);
            }
          }
        });
        break;
    }

    room.gameOrder = player.direction;

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
  updateRoomAndPlayer,
};
