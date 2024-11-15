import * as db from "../firebase/firebase-admin.js";

const roomCollectionName = "room";
const mahjongCollectionName = "mahjong";

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
      room.playerList[i].mahjong.handTiles.mahjongTile = [];
      room.playerList[i].mahjong.flowerTiles.mahjongTile = [];
      room.playerList[i].mahjong.handTiles.point = 0;
      room.playerList[i].mahjong.flowerTiles.point = 0;

      for (let j = 0; j < handTileAmount; j++) {
        // set hand tile and flower tile
        do {
          if (newMahjongList[0].type !== "Flower") {
            room.playerList[i].mahjong.handTiles.mahjongTile.push(newMahjongList[0]);
          } else {
            room.playerList[i].mahjong.flowerTiles.mahjongTile.push(newMahjongList[0]);
            room.playerList[i].mahjong.flowerTiles.point += calculateMahjongTilePoints(
              newMahjongList[0],
              room.playerList[i]
            );
          }

          newMahjongList.shift();
        } while (newMahjongList[0].type === "Flower");

        // sort the mahjong handtile list
        room.playerList[i].mahjong.handTiles.mahjongTile.sort((a, b) => a.order - b.order);
      }

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
    }

    room.gameStarted = true;
    room.gameOrder = 1;
    room.mahjongDiscardTiles = [];

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
    room.mahjongDiscardTiles.push({
      ...discardedMahjongTile,
      isSelected: false,
    });

    room.playerList.find((p) => p.id === player.id).mahjong.handTiles.mahjongTile = room.playerList
      .find((p) => p.id === player.id)
      .mahjong.handTiles.mahjongTile.filter((m) => m.id !== discardedMahjongTile.id);

    updateRoom(room).then((roomU) => {
      resolve({
        ...roomU,
        updateMessage: `${player.playerName} discarded ${discardedMahjongTile.name}.`,
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
        updateMessage: `Player ${room.gameOrder}'s turn.`,
      });
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

export { createGame, playerJoinRoom, updateRoom, playerQuitRoom, discardMahjong, nextTurn };
