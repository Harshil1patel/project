const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Pending", "Verified", "Assigned", "In Progress", "Resolved"],
      default: "Pending",
    },

    officer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    remarks: [
      {
        text: String,
        officer: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    citizen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Complaint", complaintSchema);

