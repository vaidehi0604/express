const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const upload = require("../middlewares/upload");
const {
  register,
  login,
  forgotPassword,
  checkOtp,
  resetPassword,
  logout,
} = require("../controller/authController");

router.post("/register", register);

router.post("/login", login);

router.post("/forgotpassword", forgotPassword);

router.post("/checkotp", checkOtp);
router.post("/reset", resetPassword);

router.post("/logout", verifyToken, logout);

module.exports.authRouter = router;
