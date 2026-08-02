const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  registerUser,
  loginUser,
  getUsers,
} = require("../controllers/userController");

router.get("/", protect, getUsers);
router.post("/register", registerUser);
router.post("/login", loginUser);


module.exports = router;