const mongoose = require("mongoose");

const assignReviewSchema = new mongoose.Schema(
  {
    reviewedFor: {
      type: String,
      required: true,
    },
    reviewedBy: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const assignEmployeeReviewer = mongoose.model(
  "assignEmployeeReviewer",
  assignReviewSchema
);
module.exports = assignEmployeeReviewer;
