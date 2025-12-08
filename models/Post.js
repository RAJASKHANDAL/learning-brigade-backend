const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
    teacherName: { type: String, required: true },
    content: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
