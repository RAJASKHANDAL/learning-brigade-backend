const mongoose = require("mongoose");

const liveClassSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  teacherName: { type: String, required: true },
  isLive: { type: Boolean, default: false },
  startedAt: { type: Date },
});

module.exports = mongoose.model("LiveClass", liveClassSchema);
