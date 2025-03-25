import express from "express";
import cors from "cors";
import http from "http";

const app = express();
const server = http.createServer(app);

// socket
import * as socketIo from "socket.io";
import * as games from "./util/game.js";
import * as API from "./shared/service.js";
import * as CONST from "./shared/constant.js";

const PORT = process.env.PORT || 3001;

app.all("/*", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
});

// to resolve CORS issue
app.use(cors());

const io = new socketIo.Server(server, {
    cors: {
        origin: "*",
    },
});

const logModule = "socket";

io.on("connection", (socket) => {
    console.log(CONST.consoleStr("FgMagenta"), `A user connected at ${new Date().toLocaleTimeString()}`);

    socket.on("startGame", ({ room }) => {
        games
            .testGame(room)
            .then((roomU) => {
                io.in(roomU.roomId).emit("roomUpdate", roomU);
            })
            .catch((error) => {
                API.createLog(error, 500, logModule, socket);
                socket.emit("roomError", error);
            });
    });

    socket.on("nextTurn", ({ room }) => {
        games
            .nextTurn(room)
            .then((roomU) => {
                io.in(roomU.roomId).emit("roomUpdate", roomU);
            })
            .catch((error) => {
                API.createLog(error, 500, logModule, socket);
                socket.emit("roomError", error);
            });
    });

    socket.on("roomUpdate", ({ room }) => {
        games
            .updateRoom(room)
            .then((roomU) => {
                io.in(roomU.roomId).emit("roomUpdate", roomU);
            })
            .catch((error) => {
                API.createLog(error, 500, logModule, socket);
                socket.emit("roomError", error);
            });
    });

    socket.on("gameEnd", ({ room }) => {
        games
            .endGame(room)
            .then((roomU) => {
                io.in(roomU.roomId).emit("roomUpdate", roomU);
            })
            .catch((error) => {
                API.createLog(error, 500, logModule, socket);
                socket.emit("roomError", error);
            });
    });

    socket.on("joinRoom", ({ room, player }) => {
        socket.join(room.roomId);
        if (player) {
            games
                .playerJoinRoom(player, room)
                .then((roomU) => {
                    io.in(roomU.roomId).emit("joinRoom", roomU);
                })
                .catch((error) => {
                    API.createLog(error, 500, logModule, socket);
                    socket.emit("roomError", error);
                });
        }
    });

    socket.on("quitRoom", ({ room, player }) => {
        games
            .playerQuitRoom(room, player)
            .then((roomU) => {
                io.in(roomU.roomId).emit("roomUpdate", roomU);
            })
            .catch((error) => {
                API.createLog(error, 500, logModule, socket);
                socket.emit("roomError", error);
            });
    });

    socket.on("discardMahjong", ({ room, player, discardedMahjongTile }) => {
        games
            .discardMahjongV1(room, player, discardedMahjongTile)
            .then((roomU) => {
                if (roomU.response.isSuccess) {
                    io.in(roomU.roomId).in(player.playerId).emit("roomUpdate", roomU);
                } else {
                    socket.emit("roomUpdate", roomU);
                }
            })
            .catch((error) => {
                API.createLog(error, 500, logModule, socket);
                socket.emit("roomError", error);
            });
    });

    socket.on("drawMahjong", ({ room, player }) => {
        games
            .drawMahjong(room, player)
            .then((roomU) => {
                if (roomU.response.isSuccess) {
                    io.in(roomU.roomId).in(player.playerId).emit("roomUpdate", roomU);
                } else {
                    socket.emit("roomUpdate", roomU);
                }
            })
            .catch((error) => {
                API.createLog(error, 500, logModule, socket);
                socket.emit("roomError", error);
            });
    });

    socket.on("action", ({ action, room, player, selectedMahjong }) => {
        games
            .actionV1(action, room, player, selectedMahjong)
            .then((roomU) => {
                io.in(roomU.roomId).emit("roomUpdate", roomU);
            })
            .catch((error) => {
                API.createLog(error, 500, logModule, socket);
                socket.emit("roomError", error);
            });
    });

    socket.on("chow", ({ room, player, selectedMahjongChow, selectedMahjong }) => {
        games
            .chowAction(room, player, selectedMahjongChow, selectedMahjong)
            .then((roomU) => {
                io.in(roomU.roomId).emit("roomUpdate", roomU);
            })
            .catch((error) => {
                API.createLog(error, 500, logModule, socket);
                socket.emit("roomError", error);
            });
    });

    socket.on("win", ({ room, player, selectedMahjongSet }) => {
        games
            .winAction(room, player, selectedMahjongSet)
            .then((roomU) => {
                io.in(roomU.roomId).emit("roomUpdate", roomU);
            })
            .catch((error) => {
                API.createLog(error, 500, logModule, socket);
                socket.emit("roomError", error);
            });
    });
});

server.listen(PORT, () => console.log(CONST.consoleStr("FgCyan"), "Server is running on port " + PORT));
