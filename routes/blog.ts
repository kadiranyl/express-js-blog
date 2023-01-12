import express from "express";
import { getBlogs, createBlog, getBlog, deleteBlog, updateBlog } from "../controllers/blogController";
import checkToken from "../helpers/checkToken";

const router = express.Router();

router.post("/", (req, res) => {
    checkToken(req, res, () => {
        createBlog(req, res);
    });
});
router.patch("/:id", (req, res) => {
    checkToken(req, res, () => {
        updateBlog(req, res);
    });
});
router.delete("/:id", (req, res) => {
    checkToken(req, res, () => {
        deleteBlog(req, res);
    });
});
router.get("/", getBlogs);
router.get("/:id", getBlog);

export default router;