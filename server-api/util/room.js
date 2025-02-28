import { Router } from "express";
import express from "express";
const router = Router();
import * as db from "../firebase/firebase-admin.js";
import responseModel from "../shared/function.js";

router.use(express.json());

const roomCollectionName = "room";

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
            },
        };

        await newRef.set(room);

        res.status(200).json(responseModel({ data: room }));
    } catch (error) {
        console.log("error", error);
        res.status(400).json(
            responseModel({
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
            res.status(200).json(responseModel({ data: list[0] }));
        } else {
            res.status(400).json(
                responseModel({
                    isSuccess: false,
                    responseMessage: "Room is not found.",
                })
            );
        }
    } catch (error) {
        res.status(400).json(
            responseModel({
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
        let newRef = db.default.db.collection(roomCollectionName).doc(room.roomId);
        await newRef.update(room);

        res.status(200).json(responseModel({ data: room }));
    } catch (error) {
        console.log("error", error);
        res.status(400).json(
            responseModel({
                isSuccess: false,
                responseMessage: error,
            })
        );
    }
});

export default router;
