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

const axios = require("axios");
const nodemailer = require("nodemailer");

// Helper: Send SMS via Fast2SMS API (Indian Mobile Numbers)
const sendSmsOtp = async (phone, otp) => {
  if (process.env.FAST2SMS_API_KEY) {
    try {
      await axios.get("https://www.fast2sms.com/dev/bulkV2", {
        headers: { authorization: process.env.FAST2SMS_API_KEY },
        params: {
          variables_values: otp,
          route: "otp",
          numbers: phone,
        },
      });
      console.log(`📱 Real SMS OTP (${otp}) successfully dispatched to +91 ${phone}`);
    } catch (err) {
      console.error("SMS Gateway Error:", err.response?.data || err.message);
    }
  } else {
    console.log(`📱 [SMS Simulation] OTP for +91 ${phone}: ${otp}`);
  }
};

// Helper: Send Email via Nodemailer
const sendEmailOtp = async (email, otp) => {
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      await transporter.sendMail({
        from: `"CivicLens" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your CivicLens OTP Verification Code",
        html: `<div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
          <h2 style="color: #48bb78;">CivicLens Verification Code</h2>
          <p>Your 6-digit verification code is:</p>
          <h1 style="color: #2f855a; letter-spacing: 4px;">${otp}</h1>
          <p>This code will expire in 5 minutes. Do not share it with anyone.</p>
        </div>`,
      });
      console.log(`📧 Real Email OTP (${otp}) successfully dispatched to ${email}`);
    } catch (err) {
      console.error("Email Dispatch Error:", err.message);
    }
  } else {
    console.log(`📧 [Email Simulation] OTP for ${email}: ${otp}`);
  }
};

// In-memory OTP storage: key -> { otp, expiresAt }
const otpStore = new Map();

// ================= SEND OTP =================
const sendOTP = async (req, res) => {
  try {
    const { email, phone } = req.body;

    if (!email || !phone) {
      return res.status(400).json({ message: "Both Email address and 10-digit Phone number are required to receive OTP." });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ message: "Please enter a valid email address." });
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(cleanPhone)) {
      return res.status(400).json({ message: "Please enter a valid 10-digit mobile number." });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes validity

    const storeKey = `${cleanEmail}_${cleanPhone}`;
    otpStore.set(storeKey, { otp, expiresAt });

    const isRealSmsConfigured = Boolean(process.env.FAST2SMS_API_KEY);
    const isRealEmailConfigured = Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS);

    // Dispatch SMS & Email asynchronously
    sendSmsOtp(cleanPhone, otp);
    sendEmailOtp(cleanEmail, otp);

    res.status(200).json({
      success: true,
      message: `OTP sent successfully to email (${cleanEmail}) and mobile (+91 ${cleanPhone})!`,
      demoOtp: (isRealSmsConfigured || isRealEmailConfigured) ? null : otp,
      isRealSmsConfigured,
      isRealEmailConfigured,
      email: cleanEmail,
      phone: cleanPhone,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= VERIFY OTP =================
const verifyOTP = async (req, res) => {
  try {
    const { email, phone, otp } = req.body;

    if (!email || !phone || !otp) {
      return res.status(400).json({ message: "Email, Phone number, and OTP code are required." });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();
    const storeKey = `${cleanEmail}_${cleanPhone}`;

    const record = otpStore.get(storeKey);

    if (!record) {
      return res.status(400).json({ message: "No active OTP found. Please request a new OTP." });
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(storeKey);
      return res.status(400).json({ message: "OTP has expired. Please request a new OTP." });
    }

    if (record.otp !== otp.trim()) {
      return res.status(400).json({ message: "Invalid OTP code. Please check and try again." });
    }

    // Clear OTP after successful verification
    otpStore.delete(storeKey);

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