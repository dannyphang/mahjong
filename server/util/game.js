import * as db from "../firebase/firebase-admin.js";

const roomCollectionName = "Room";

function createGame() {
  return new Promise(function (resolve, reject) {
    resolve("dfwqadw");
  });
}

function playerJoinRoom(player, room) {
  return new Promise(async function (resolve, reject) {
    if (!room.playerList.find((p) => p.playerId === player.playerId)) {
      room.playerList.push(player);
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

export { createGame, playerJoinRoom, updateRoom };
