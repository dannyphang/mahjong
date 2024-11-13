import { Router } from "express";
import express from "express";
const router = Router();
import * as db from "../firebase/firebase-admin.js";
import responseModel from "../shared/function.js";

router.use(express.json());

const roomCollectionName = "Room";

// create new room
router.post("/", async (req, res) => {
  try {
    let newRef = db.default.db.collection(roomCollectionName).doc();
    let room = {
      roomId: newRef.id,
      statusId: 1,
      playerList: [],
      gameStarted: true,
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

// get room by id
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const snapshot = await db.default.db.collection(roomCollectionName).doc(id).get();

    const room = snapshot.data().statusId == 1 ? snapshot.data() : {};

    res.status(200).json(responseModel({ data: room }));
  } catch (error) {}
});

export default router;
