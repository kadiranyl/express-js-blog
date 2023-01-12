import express from "express";
import { login, createUser } from "../controllers/userController";

const router = express.Router();

router.post("/login", login);
router.post("/register", (req, res) => {
    createUser(req, res);
});

export default router;