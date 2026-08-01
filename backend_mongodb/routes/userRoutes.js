const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  registerUser,
  loginUser,
  sendOTP,
  verifyOTP,
  getUsers,
} = require("../controllers/userController");

router.get("/", protect, getUsers);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);

module.exports = router;