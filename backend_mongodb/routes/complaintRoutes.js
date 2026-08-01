const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

const {
  createComplaint,
  createAIComplaint,
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
  deleteComplaint,
  getDashboardStats,
} = require("../controllers/complaintController");

// Citizen - Create Complaint
router.post("/", protect, upload.single("image"), createComplaint);
router.post("/ai", upload.single("image"), createAIComplaint);
// Anyone logged in - View Complaints
router.get("/", protect, getComplaints);

// Dashboard (Admin Only)
router.get("/stats", protect, admin, getDashboardStats);

// Get Single Complaint
router.get("/:id", protect, getComplaintById);

// Update Complaint Status (Admin Only)
router.put("/:id", protect, admin, updateComplaintStatus);

// Delete Complaint (Admin Only)
router.delete("/:id", protect, admin, deleteComplaint);

module.exports = router;