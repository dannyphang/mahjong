import { Router } from "express";
import express from "express";
const router = Router();
import * as db from "../firebase/firebase-admin.js";
import responseModel from "../shared/function.js";

router.use(express.json());

const playerCollectionName = "Player";

// create player
router.post("/", async (req, res) => {
  try {
    let player = req.body.player;
    let newRef = db.default.db.collection(playerCollectionName).doc();
    player.playerId = newRef.id;

    await newRef.set(player);

    res.status(200).json(responseModel({ data: player }));
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

// update player
router.put("/", async (req, res) => {
  try {
    let player = req.body.player;
    let newRef = db.default.db
      .collection(playerCollectionName)
      .doc(player.playerId);
    await newRef.update(player);

    res.status(200).json(responseModel({ data: player }));
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

// get player by name
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.default.db
      .collection(playerCollectionName)
      .where("statusId", "==", 1)
      .where("playerName", "==", req.headers.name)
      .get();

    const list = snapshot.docs.map((doc) => {
      return doc.data();
    });

    if (list.length > 0) {
      res.status(200).json(responseModel({ data: list }));
    } else {
      res.status(400).json(
        responseModel({
          isSuccess: false,
          responseMessage: "Player is not found.",
        })
      );
    }
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
