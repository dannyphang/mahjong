import * as config from "../config/envConfig.js";
import axios from "axios";

const http = axios.create({
    baseURL: config.apiBaseUrl,
});

const httpLog = axios.create({
    baseURL: config.logBaseUrl,
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
    return http.post("mahjong/isNextPlayer", {
        room: room,
        currentPlayer: currentPlayer,
        targetPlayer: targetPlayer,
    });
}

function checkChow(mahjongTile, discardedMahjongTile) {
    return http.post("mahjong/checkChow", {
        mahjongTile: mahjongTile,
        discardedMahjongTile: discardedMahjongTile,
    });
}

function calculateFlowerTilePoints(newMahjong, player) {
    return http.post("mahjong/calculateFlowerTilePoints", { mahjong: newMahjong, player: player });
}

function isKongableFromHandSet(newMahjong, mahjongList) {
    return http.post("mahjong/isKongableFromHandSet", {
        newMahjong: newMahjong,
        mahjongList: mahjongList,
    });
}

function isConsecutive(code1, code2, code3) {
    return http.post("mahjong/isConsecutive", { code1: code1, code2: code2, code3: code3 });
}

function checkWin(player) {
    return http.post("mahjong/calculate_points", { player: player });
}

function quitRoom(room, player) {
    return http.post("room/quit_room", { room: room, player: player });
}

function createLog(error, statusCode, module, socket) {
    const errorDetails = {
        project: "Mahjong",
        module: module,
        server: "Server Socket",
        serverType: "SOCKET",
        message: error?.message || null,
        stack: error?.stack || null,
        statusCode: statusCode,
        socket: {
            clientIp: socket?.handshake?.address || "Unknown IP",
            baseUrl: socket?.handshake?.headers?.host || "Unknown origin",
            path: socket?.handshake?.url || "Unknown path",
            clientId: socket?.id || "No client ID",
        },
    };
    return httpLog.post("exception", { errorDetails });
}

export {
    getMahjong,
    getMahjongByUid,
    getPlayerByUid,
    updateRoom,
    updatePlayer,
    isNextPlayer,
    checkChow,
    calculateFlowerTilePoints,
    isKongableFromHandSet,
    isConsecutive,
    checkWin,
    quitRoom,
    createLog,
};
