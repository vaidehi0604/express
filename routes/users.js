const express = require("express");
const router = express.Router();
const {
  getUsers,
  createUsers,
  editUsers,
  deleteUsers,
  getOneUsers,
} = require("../controller/user");

router.get("/", getUsers);
router.post("/", createUsers);
router.get("/:id", getOneUsers);
router.post("/:id", editUsers);
router.delete("/:id", deleteUsers);

module.exports.user = router;
