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

      for (let j = 0; j < handTileAmount; j++) {
        room.playerList[i].mahjong.handTiles.mahjongTile.push(newMahjongList[0]);
        newMahjongList.shift();
      }
    }

    room.gameStarted = true;

    let newRef = db.default.db.collection(roomCollectionName).doc(room.roomId);

    await newRef.update(room);

    resolve({
      ...room,
      updateMessage: `Game started!`,
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

    let newRef = db.default.db.collection(roomCollectionName).doc(room.roomId);

    await newRef.update(room);

    resolve({
      ...room,
      updateMessage: `${player.playerName} is joined the room.`,
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

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

export { createGame, playerJoinRoom, updateRoom };
