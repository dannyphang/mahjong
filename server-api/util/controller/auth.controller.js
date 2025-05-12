import { Router } from "express";
import express from "express";
const router = Router();
import * as API from "../log.js";
import * as func from "../../shared/function.js";
import * as authImpl from "../implementation/auth.js";

router.use(express.json());

const logModule = "user";

// sign up
router.post("/signup", async (req, res) => {
    try {
        authImpl
            .createUser({ user: func.body(req).data.user })
            .then((newUser) => {
                res.status(200).json(func.responseModel({ data: newUser }));
            })
            .catch(async (error) => {
                console.log("error", error);
                await API.createLog(error, req, res, 500, logModule);
                res.status(500).json(
                    func.responseModel({
                        isSuccess: false,
                        responseMessage: error,
                    })
                );
            });
    } catch (error) {
        console.log("error", error);
        await API.createLog(error, req, res, 500, logModule);
        res.status(500).json(
            func.responseModel({
                isSuccess: false,
                responseMessage: error,
            })
        );
    }
});

// sign in
router.post("/signin", async (req, res) => {
    try {
        authImpl
            .getUserByAuthUid({ authId: func.body(req).data.authId })
            .then((user) => {
                res.status(200).json(func.responseModel({ data: user }));
            })
            .catch(async (error) => {
                console.log("error", error);
                await API.createLog(error, req, res, 500, logModule);
                res.status(500).json(
                    func.responseModel({
                        isSuccess: false,
                        responseMessage: error,
                    })
                );
            });
    } catch (error) {
        console.log("error", error);
        await API.createLog(error, req, res, 500, logModule);
        res.status(500).json(
            func.responseModel({
                isSuccess: false,
                responseMessage: error,
            })
        );
    }
});

// update user
router.put("/", async (req, res) => {
    try {
        authImpl
            .updateUser({ user: func.body(req).data.user })
            .then((user) => {
                res.status(200).json(func.responseModel({ data: user }));
            })
            .catch(async (error) => {
                console.log("error", error);
                await API.createLog(error, req, res, 500, logModule);
                res.status(500).json(
                    func.responseModel({
                        isSuccess: false,
                        responseMessage: error,
                    })
                );
            });
    } catch (error) {
        console.log("error", error);
        await API.createLog(error, req, res, 500, logModule);
        res.status(500).json(
            func.responseModel({
                isSuccess: false,
                responseMessage: error,
            })
        );
    }
});

// get user by uid
router.get("/:uid", async (req, res) => {
    try {
        authImpl
            .getUserByUid({ uid: req.params.uid })
            .then((user) => {
                res.status(200).json(func.responseModel({ data: user }));
            })
            .catch(async (error) => {
                console.log("error", error);
                await API.createLog(error, req, res, 500, logModule);
                res.status(500).json(
                    func.responseModel({
                        isSuccess: false,
                        responseMessage: error,
                    })
                );
            });
    } catch (error) {
        console.log("error", error);
        await API.createLog(error, req, res, 500, logModule);
        res.status(500).json(
            func.responseModel({
                isSuccess: false,
                responseMessage: error,
            })
        );
    }
});

// get user by auth uid
router.get("/authUser/:authId", async (req, res) => {
    try {
        authImpl
            .getUserByAuthUid({ authId: req.params.authId })
            .then((user) => {
                res.status(200).json(func.responseModel({ data: user }));
            })
            .catch(async (error) => {
                console.log("error", error);
                await API.createLog(error, req, res, 500, logModule);
                res.status(500).json(
                    func.responseModel({
                        isSuccess: false,
                        responseMessage: error,
                    })
                );
            });
    } catch (error) {
        console.log("error", error);
        await API.createLog(error, req, res, 500, logModule);
        res.status(500).json(
            func.responseModel({
                isSuccess: false,
                responseMessage: error,
            })
        );
    }
});

// create user
router.post("/createUser", async (req, res) => {
    try {
        authImpl
            .createUser({ user: func.body(req).data.user })
            .then((newUser) => {
                res.status(200).json(func.responseModel({ data: newUser }));
            })
            .catch(async (error) => {
                console.log("error", error);
                await API.createLog(error, req, res, 500, logModule);
                res.status(500).json(
                    func.responseModel({
                        isSuccess: false,
                        responseMessage: error,
                    })
                );
            });
    } catch (error) {
        console.log("error", error);
        await API.createLog(error, req, res, 500, logModule);
        res.status(500).json(
            func.responseModel({
                isSuccess: false,
                responseMessage: error,
            })
        );
    }
});

export default router;
