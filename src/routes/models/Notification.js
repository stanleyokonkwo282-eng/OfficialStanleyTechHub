const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["exam_completed", "certificate_issued"],
      default: "exam_completed",
    },
    courseId: { type: String, required: true },
    courseTitle: { type: String, default: "" },
    studentName: { type: String, required: true },
    studentEmail: { type: String, required: true },
    score: { type: Number, default: null },
    passed: { type: Boolean, default: null },
    channels: { type: [String], default: [] },
    delivered: { type: Object, default: {} },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
