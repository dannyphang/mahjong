import * as config from "../config/envConfig.js";
import axios from "axios";

const http = axios.create({
    baseURL: config.apiBaseUrl,
});

function getMahjong() {
    return http.get("mahjong");
}

function getMahjongByUid(uid) {
    return http.get("mahjong/" + uid);
}

function getPlayerByUid(uid) {
    return http.get(`player/${uid}`);
}

function updateRoom(room) {
    return http.put("room", { room: room });
}

function updatePlayer(player) {
    return http.put("player", { player: player });
}

function isNextPlayer(room, currentPlayer, targetPlayer) {
    return http.post("mahjong/isNextPlayer", { room: room, currentPlayer: currentPlayer, targetPlayer: targetPlayer });
}

function checkChow(mahjongTile, discardedMahjongTile) {
    return http.post("mahjong/checkChow", { mahjongTile: mahjongTile, discardedMahjongTile: discardedMahjongTile });
}

function calculateFlowerTilePoints(newMahjong, player) {
    return http.post("mahjong/calculateFlowerTilePoints", { mahjong: newMahjong, player: player });
}

function isKongableFromHandSet(newMahjong, mahjongList) {
    return http.post("mahjong/isKongableFromHandSet", { newMahjong: newMahjong, mahjongList: mahjongList });
}

function isConsecutive(code1, code2, code3) {
    return http.post("mahjong/isConsecutive", { code1: code1, code2: code2, code3: code3 });
}

export { getMahjong, getMahjongByUid, getPlayerByUid, updateRoom, updatePlayer, isNextPlayer, checkChow, calculateFlowerTilePoints, isKongableFromHandSet, isConsecutive };
