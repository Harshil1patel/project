const Complaint = require("../models/Complaint");

// Create Complaint
const createComplaint = async (req, res) => {
  try {
    const { title, description, category, location } = req.body;

    const complaint = await Complaint.create({
      title,
      description,
      category,
      location,
      image: req.file ? req.file.filename : "",
      status: "Pending",
    });

    res.status(201).json({
      message: "Complaint Submitted Successfully",
      complaint,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Create Complaint from AI Backend
const createAIComplaint = async (req, res) => {
  try {

    const { title, description, category, location } = req.body;

    const complaint = await Complaint.create({
      title,
      description,
      category,
      location,
      image: req.file ? req.file.filename : "",
      status: "Pending",
    });

    res.status(201).json({
      message: "AI Complaint Saved Successfully",
      complaint,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

// Get All Complaints
const getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });

    res.status(200).json(complaints);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Single Complaint
const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint Not Found",
      });
    }

    res.status(200).json(complaint);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Claim Complaint (Officer assigns complaint to themselves and sets status to In Progress)
const claimComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint Not Found",
      });
    }

    complaint.officer = req.user.id;
    complaint.status = "In Progress";

    await complaint.save();

    res.status(200).json({
      message: "Complaint Claimed Successfully",
      complaint,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Complaint Status & Add Remarks
const updateComplaintStatus = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint Not Found",
      });
    }

    if (req.body.status) {
      complaint.status = req.body.status;
    }

    if (req.body.remark && req.body.remark.trim() !== "") {
      complaint.remarks.push({
        text: req.body.remark.trim(),
        officer: req.user?.name || "Officer",
        timestamp: new Date(),
      });
    }

    await complaint.save();

    res.status(200).json({
      message: "Status Updated Successfully",
      complaint,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Complaint
const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint Not Found",
      });
    }

    await complaint.deleteOne();

    res.status(200).json({
      message: "Complaint Deleted Successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Dashboard Stats
const getDashboardStats = async (req, res) => {
  try {
    const total = await Complaint.countDocuments();

    const pending = await Complaint.countDocuments({
      status: "Pending",
    });

    const progress = await Complaint.countDocuments({
      status: "In Progress",
    });

    const resolved = await Complaint.countDocuments({
      status: "Resolved",
    });

    res.status(200).json({
      total,
      pending,
      progress,
      resolved,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createComplaint,
  createAIComplaint,
  getComplaints,
  getComplaintById,
  claimComplaint,
  updateComplaintStatus,
  deleteComplaint,
  getDashboardStats,
};