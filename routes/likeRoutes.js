const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");

const {
  likePost,
  likeComment,
  likeReply,
} = require("../controller/likeController");

router.post("/post", verifyToken, likePost);
router.post("/comment", verifyToken, likeComment);
router.post("/reply", verifyToken, likeReply);

module.exports.likeRoutes = router;
