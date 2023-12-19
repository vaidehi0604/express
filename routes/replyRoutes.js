const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");

const { createReply, deleteReply } = require("../controller/replyController");

router.post("/create", verifyToken, createReply);
router.delete("/delete", verifyToken, deleteReply);
module.exports.replyRoutes = router;
