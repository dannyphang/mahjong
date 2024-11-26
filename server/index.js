import express from "express";
import cors from "cors";
import http from "http";

const app = express();
const server = http.createServer(app);

// socket
import * as socketIo from "socket.io";

import mahjongRouter from "./util/mahjong.js";
import roomRouter from "./util/room.js";
import playerRouter from "./util/player.js";
import * as games from "./util/game.js";

const PORT = process.env.PORT || 3000;

app.all("/*", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
});

// to resolve CORS issue
app.use(cors());

app.use("/mahjong", mahjongRouter);
app.use("/room", roomRouter);
app.use("/player", playerRouter);

const io = new socketIo.Server(server, {
    cors: {
        origin: "*",
    },
});

io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("startGame", ({ room }) => {
        games.createGame(room).then((roomU) => {
            io.in(roomU.roomId).emit("roomUpdate", roomU);
        });
    });

    socket.on("testGame", ({ room }) => {
        games.testGame(room).then((roomU) => {
            io.in(roomU.roomId).emit("roomUpdate", roomU);
        });
    });

    socket.on("nextTurn", ({ room }) => {
        games.nextTurn(room).then((roomU) => {
            io.in(roomU.roomId).emit("roomUpdate", roomU);
        });
    });

    socket.on("roomUpdate", ({ room }) => {
        games.updateRoom(room).then((roomU) => {
            io.in(roomU.roomId).emit("roomUpdate", roomU);
        });
    });

    socket.on("joinRoom", ({ room, player }) => {
        socket.join(room.roomId);
        if (player) {
            games.playerJoinRoom(player, room).then((roomU) => {
                io.in(roomU.roomId).emit("joinRoom", roomU);
            });
        }
    });

    socket.on("quitRoom", ({ room, player }) => {
        games.playerQuitRoom(room, player).then((roomU) => {
            io.in(roomU.roomId).emit("roomUpdate", roomU);
        });
    });

    socket.on("discardMahjong", ({ room, player, discardedMahjongTile }) => {
        games.discardMahjong(room, player, discardedMahjongTile).then((roomU) => {
            if (roomU.response.isSuccess) {
                io.in(roomU.roomId).in(player.playerId).emit("roomUpdate", roomU);
            } else {
                socket.emit("roomUpdate", roomU);
            }
        });
    });

    socket.on("drawMahjong", ({ room, player }) => {
        games.drawMahjong(room, player).then((roomU) => {
            if (roomU.response.isSuccess) {
                io.in(roomU.roomId).in(player.playerId).emit("roomUpdate", roomU);
            } else {
                socket.emit("roomUpdate", roomU);
            }
        });
    });

    socket.on("action", ({ action, room, player, selectedMahjong }) => {
        games.actions(action, room, player, selectedMahjong).then((roomU) => {
            io.in(roomU.roomId).emit("roomUpdate", roomU);
        });
    });

    socket.on("chow", ({ room, player, selectedMahjongChow, selectedMahjong }) => {
        games.chowAction(room, player, selectedMahjongChow, selectedMahjong).then((roomU) => {
            io.in(roomU.roomId).emit("roomUpdate", roomU);
        });
    });
});

const consoleColor = {
    Reset: "\x1b[0m",
    Bright: "\x1b[1m",
    Dim: "\x1b[2m",
    Underscore: "\x1b[4m",
    Blink: "\x1b[5m",
    Reverse: "\x1b[7m",
    Hidden: "\x1b[8m",
    FgBlack: "\x1b[30m",
    FgRed: "\x1b[31m",
    FgGreen: "\x1b[32m",
    FgYellow: "\x1b[33m",
    FgBlue: "\x1b[34m",
    FgMagenta: "\x1b[35m",
    FgCyan: "\x1b[36m",
    FgWhite: "\x1b[37m",
    FgGray: "\x1b[90m",
    BgBlack: "\x1b[40m",
    BgRed: "\x1b[41m",
    BgGreen: "\x1b[42m",
    BgYellow: "\x1b[43m",
    BgBlue: "\x1b[44m",
    BgMagenta: "\x1b[45m",
    BgCyan: "\x1b[46m",
    BgWhite: "\x1b[47m",
    BgGray: "\x1b[100m",
};

server.listen(PORT, () => console.log(`${consoleColor.FgCyan}%s\x1b[0m`, "Server is running on port " + PORT));
