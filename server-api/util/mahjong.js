import { Router } from "express";
import express from "express";
const router = Router();
import * as db from "../firebase/firebase-admin.js";
import responseModel from "../shared/function.js";
import * as games from "../util/game.js";
import * as API from "./log.js";

router.use(express.json());

const mahjongCollectionName = "mahjong";
const combinationCollectionName = "combination";
const logModule = "mahjong";

// create new mahjong
router.post("/", async (req, res) => {
    try {
        const list = JSON.parse(JSON.stringify(req.body));

        if (list.length > 0) {
            list.forEach(async (m, index) => {
                let newRef = db.default.db.collection(mahjongCollectionName).doc();
                m.uid = newRef.id;
                m.statusId = 1;

                await newRef.set(m);

                if (index === list.length - 1) {
                    res.status(200).json(responseModel({ responseMessage: "Created " + list.length + " record(s)." }));
                }
            });
        } else {
            res.status(200).json(responseModel({ data: list }));
        }
    } catch (error) {
        console.log("error", error);
        API.createLog(error, req, res, 500, logModule);
        res.status(500).json(
            responseModel({
                isSuccess: false,
                responseMessage: error,
            })
        );
    }
});

// get all mahjong
router.get("/", async (req, res) => {
    try {
        const snapshot = await db.default.db.collection(mahjongCollectionName).orderBy("order").where("statusId", "==", 1).get();

        const list = snapshot.docs.map((doc) => doc.data());

        res.status(200).json(responseModel({ data: list }));
    } catch (error) {
        console.error("Error fetching Mahjong data:", error);
        API.createLog(error, req, res, 500, logModule);
        res.status(500).json(
            responseModel({
                isSuccess: false,
                responseMessage: error.message,
            })
        );
    }
});

// get mahjong by uid
router.get("/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const snapshot = await db.default.db.collection(mahjongCollectionName).where("statusId", "==", 1).where("uid", "==", id).get();

        const list = snapshot.docs.map((doc) => doc.data());

        res.status(200).json(responseModel({ data: list[0] }));
    } catch (error) {
        console.error("Error fetching Mahjong data:", error);
        API.createLog(error, req, res, 500, logModule);
        res.status(500).json(
            responseModel({
                isSuccess: false,
                responseMessage: error.message,
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
    } catch (error) {
        console.log("error", error);
        API.createLog(error, req, res, 500, logModule);
        res.status(500).json(
            responseModel({
                isSuccess: false,
                responseMessage: error,
            })
        );
    }
});

// router.post("/combination", async (req, res) => {
//     try {
//         const list = JSON.parse(JSON.stringify(req.body));

//         list.forEach(async (m, index) => {
//           let newRef = db.default.db.collection(combinationCollectionName).doc();
//           m.uid = newRef.id;
//           m.statusId = 1;

//           await newRef.set(m);

//           if (index === list.length - 1) {
//               res.status(200).json(responseModel({ responseMessage: "Created " + list.length + " record(s)." }));
//           }
//       });
//     } catch (error) {}
// });

router.post("/calculate_points", async (req, res) => {
    try {
        let player = req.body.player;
        let mahjong = player.mahjong;

        games
            .calculateMahjongSetPoints(mahjong, player)
            .then((r) => {
                if (r.points >= 0) {
                    res.status(200).json(responseModel({ data: r }));
                } else {
                    res.status(200).json(
                        responseModel({
                            data: r,
                            isSuccess: false,
                            responseMessage: "This set is not winning.",
                        })
                    );
                }
            })
            .catch((error) => {
                console.log("error", error);
                API.createLog(error, req, res, 400, logModule);
                res.status(400).json(
                    responseModel({
                        isSuccess: false,
                        responseMessage: error,
                    })
                );
            });
    } catch (error) {
        console.log("error", error);
        API.createLog(error, req, res, 500, logModule);
        res.status(500).json(
            responseModel({
                isSuccess: false,
                responseMessage: error,
            })
        );
    }
});

// get FlowerTilePoints
router.post("/calculateFlowerTilePoints", async (req, res) => {
    try {
        res.status(200).json(responseModel({ data: games.calculateFlowerTilePoints(req.body.mahjong, req.body.player) }));
    } catch (error) {
        console.error("Error:", error);
        API.createLog(error, req, res, 500, logModule);
        res.status(500).json(
            responseModel({
                isSuccess: false,
                responseMessage: error.message,
            })
        );
    }
});

// get kongableFromHandSet
router.post("/isKongableFromHandSet", async (req, res) => {
    try {
        res.status(200).json(
            responseModel({
                data: games.isKongableFromHandSet(req.body.newMahjong, req.body.mahjongList),
            })
        );
    } catch (error) {
        console.error("Error:", error);
        API.createLog(error, req, res, 500, logModule);
        res.status(500).json(
            responseModel({
                isSuccess: false,
                responseMessage: error.message,
            })
        );
    }
});

// get checkChow
router.post("/checkChow", async (req, res) => {
    try {
        res.status(200).json(
            responseModel({
                data: games.checkChow(req.body.mahjongTile, req.body.discardedMahjongTile),
            })
        );
    } catch (error) {
        console.error("Error:", error);
        API.createLog(error, req, res, 500, logModule);
        res.status(500).json(
            responseModel({
                isSuccess: false,
                responseMessage: error.message,
            })
        );
    }
});

// get isNextPlayer
router.post("/isNextPlayer", async (req, res) => {
    try {
        res.status(200).json(
            responseModel({
                data: games.isNextPlayer(req.body.room, req.body.currentPlayer, req.body.targetPlayer),
            })
        );
    } catch (error) {
        console.error("Error:", error);
        API.createLog(error, req, res, 500, logModule);
        res.status(500).json(
            responseModel({
                isSuccess: false,
                responseMessage: error.message,
            })
        );
    }
});

// get isConsecutive
router.post("/isConsecutive", async (req, res) => {
    try {
        res.status(200).json(responseModel({ data: games.isConsecutive(req.body.code1, req.body.code2, req.body.code3) }));
    } catch (error) {
        console.error("Error:", error);
        API.createLog(error, req, res, 500, logModule);
        res.status(500).json(
            responseModel({
                isSuccess: false,
                responseMessage: error.message,
            })
        );
    }
});

export default router;
