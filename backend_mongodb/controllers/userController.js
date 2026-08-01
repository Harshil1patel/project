const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ================= REGISTER =================
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const cleanEmail = email ? email.toLowerCase().trim() : "";

    const userExists = await User.findOne({ email: cleanEmail });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: cleanEmail,
      password: hashedPassword,
      role: role || "citizen",
    });

    res.status(201).json({
      message: "User Registered Successfully",
      user,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= LOGIN =================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = email ? email.toLowerCase().trim() : "";

    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(400).json({
        message: "Invalid Email or Password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Email or Password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET || "civiclens_secret_key",
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      message: "Login Successful",
      token,
      user,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// In-memory OTP storage: key -> { otp, expiresAt }
const otpStore = new Map();

// ================= SEND OTP =================
const sendOTP = async (req, res) => {
  try {
    const { destination, type } = req.body; // type: 'email' or 'phone'

    if (!destination) {
      return res.status(400).json({ message: "Mobile number or Email address is required." });
    }

    const cleanDest = destination.trim().toLowerCase();

    if (type === "phone") {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(cleanDest)) {
        return res.status(400).json({ message: "Please enter a valid 10-digit mobile number." });
      }
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleanDest)) {
        return res.status(400).json({ message: "Please enter a valid email address." });
      }
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes validity

    otpStore.set(cleanDest, { otp, expiresAt });

    res.status(200).json({
      success: true,
      message: `OTP sent successfully to ${type === "email" ? "email" : "mobile number"} (${cleanDest})`,
      otp, // included for verification display
      destination: cleanDest,
      type,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= VERIFY OTP =================
const verifyOTP = async (req, res) => {
  try {
    const { destination, otp } = req.body;

    if (!destination || !otp) {
      return res.status(400).json({ message: "Destination and OTP are required." });
    }

    const cleanDest = destination.trim().toLowerCase();
    const record = otpStore.get(cleanDest);

    if (!record) {
      return res.status(400).json({ message: "No OTP sent or OTP expired. Please request a new OTP." });
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(cleanDest);
      return res.status(400).json({ message: "OTP has expired. Please request a new OTP." });
    }

    if (record.otp !== otp.trim()) {
      return res.status(400).json({ message: "Invalid OTP code. Please check and try again." });
    }

    // Clear OTP after successful verification
    otpStore.delete(cleanDest);

    res.status(200).json({
      success: true,
      message: "OTP Verified Successfully!",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  sendOTP,
  verifyOTP,
};