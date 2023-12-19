const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const upload = require("../middlewares/upload");
const {
  getProfile,
  uploadProfilePic,
  multipleUpload,
  getAllUser,
} = require("../controller/userController");

router.post("/uploadProfilePic", upload.single("profilePic"), uploadProfilePic);
router.post("/uploads", upload.array("files", 5), multipleUpload);

router.get("/profile", verifyToken, getProfile);
router.get("/data", getAllUser);

module.exports.userRoutes = router;
