const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");

const {
  createPost,
  getAllPost,
  getPost,
  deletePost,
} = require("../controller/postController");

router.post("/", verifyToken, createPost);
router.get("/get", getPost);
router.get("/get/all", verifyToken, getAllPost);
router.delete("/delete", verifyToken, deletePost);

module.exports.postRoutes = router;
