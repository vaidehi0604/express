const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");

const { createComment } = require("../controller/commentController");
const { deleteComment } = require("../controller/commentController");
const { getPostComment } = require("../controller/commentController");

router.post("/post", verifyToken, createComment); 
router.delete("/delete", verifyToken, deleteComment); 
router.get("/get", verifyToken, getPostComment); 

module.exports.commentRoutes = router;
