import { Router } from "express";
import express from "express";
const router = Router();
import * as db from "../firebase/firebase-admin.js";
import * as func from "../shared/function.js";
import { FieldValue } from "firebase-admin/firestore";
import * as API from "./log.js";

router.use(express.json());

const roomCollectionName = "room";
const playerCollectionName = "player";
const logModule = "Room";

// create new room
router.post("/", async (req, res) => {
    try {
        let newRef = db.default.db.collection(roomCollectionName).doc();
        let room = {
            roomId: newRef.id,
            roomCode: Math.floor(100000 + Math.random() * 900000).toString(),
            statusId: 1,
            playerList: [],
            gameStarted: true,
            gameOrder: 0,
            roomOwnerId: "",
            mahjong: {
                discardTiles: [],
                remainingTiles: [],
                setting: {
                    minPoints: 5,
                    score: 1,
                    initTotalScore: 100,
                },
                takenTiles: [],
            },
        };

        await newRef.set(room);

        res.status(200).json(func.responseModel({ data: room }));
    } catch (error) {
        console.log("error", error);
        API.createLog(error, 500, logModule);
        res.status(500).json(
            func.responseModel({
                isSuccess: false,
                responseMessage: error,
            })
        );
    }
});

// get room by room code
router.get("/:id", async (req, res) => {
    const code = req.params.id;
    try {
        const snapshot = await db.default.db.collection(roomCollectionName).where("statusId", "==", 1).where("roomCode", "==", code).get();

        const list = snapshot.docs.map((doc) => {
            return doc.data();
        });

        if (list.length > 0) {
            res.status(200).json(func.responseModel({ data: list[0] }));
        } else {
            API.createLog(error, req, res, 400, logModule);
            res.status(400).json(
                func.responseModel({
                    isSuccess: false,
                    responseMessage: "Room is not found.",
                })
            );
        }
    } catch (error) {
        API.createLog(error, 500, logModule);
        res.status(500).json(
            func.responseModel({
                isSuccess: false,
                responseMessage: error,
            })
        );
    }
});

// update room
router.put("/", async (req, res) => {
    try {
        let room = req.body.room;

        room.playerList = room.playerList.map((item) => item.playerId ?? item);
        room.mahjong.remainingTiles = room.mahjong.remainingTiles?.map((item) => item.uid ?? item) ?? [];
        room.mahjong.discardTiles = room.mahjong.discardTiles?.map((item) => item.uid ?? item) ?? [];
        room.mahjong.takenTiles = room.mahjong.takenTiles?.map((item) => item.uid ?? item) ?? [];
        room.waitingPlayer = room.waitingPlayer?.playerId ?? room.waitingPlayer ?? null;

        let newRef = db.default.db.collection(roomCollectionName).doc(room.roomId);
        await newRef.update(room);

        await getAllPlayerList(room)
            .then((newPlayerList) => {
                room.playerList = newPlayerList;
                room.waitingPlayer = newPlayerList.find((p) => p.playerId === room.waitingPlayer);
                res.status(200).json(func.responseModel({ data: room }));
            })
            .catch((error) => {
                API.createLog(error, req, res, 400, logModule);
                res.status(400).json(
                    func.responseModel({
                        isSuccess: false,
                        responseMessage: error,
                    })
                );
            });
    } catch (error) {
        console.log(error);
        API.createLog(error, 500, logModule);
        res.status(400).json(
            func.responseModel({
                isSuccess: false,
                responseMessage: error,
            })
        );
    }
});

// player quit room
router.post("/quit_room", async (req, res) => {
    try {
        let player = req.body.player;
        let room = req.body.room;

        let newRef = db.default.db.collection(roomCollectionName).doc(room.roomId);

        await newRef.update({
            playerList: FieldValue.arrayRemove(player.playerId),
        });

        res.status(200).json(func.responseModel({ data: player }));
    } catch (error) {
        console.log("error", error);
        API.createLog(error, 500, logModule);
        res.status(500).json(
            func.responseModel({
                isSuccess: false,
                responseMessage: error,
            })
        );
    }
});

async function getAllPlayerList(room) {
    return new Promise(async (resolve, reject) => {
        try {
            let plist = [];

            // Use Promise.all to handle async operations in parallel
            await Promise.all(
                room.playerList.map(async (player) => {
                    const snapshot = await db.default.db.collection(playerCollectionName).where("statusId", "==", 1).where("playerId", "==", player).get();

                    const list = snapshot.docs.map((doc) => doc.data());

                    if (list.length > 0) {
                        plist.push(list[0]);
                    }
                })
            );

            // Resolve with the list of players
            if (plist.length > 0) {
                resolve(plist);
            } else {
                resolve("No players found.");
            }
        } catch (error) {
            reject(error);
        }
    });
}

export default router;
