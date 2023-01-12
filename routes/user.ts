import express from "express";
import checkToken from "../helpers/checkToken";
import {getUsers, createUser} from "../controllers/userController";

const router = express.Router();

router.post("/", (req, res) => {
    checkToken(req, res, () => {
        createUser(req, res, false);
    });
});
router.patch("/:id", (req, res) => {
    console.log("a");
});
router.delete("/:id", (req, res) => {
    console.log("a");
});
router.get("/", (req, res) => {
    checkToken(req, res, () => {
        getUsers(req, res);
    });
});
router.get("/:id");

export default router;