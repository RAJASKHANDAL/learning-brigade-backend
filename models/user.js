const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // null for Google users

    // ⭐ Role: "student" or "teacher"
    role: {
      type: String,
      enum: ["student", "teacher", "admin"],
      default: "student",
    },

    // ⭐ Student profile fields
    interestField: { type: String, default: null },          // e.g. "Web Development"
    subInterests: { type: [String], default: [] },           // e.g. ["React", "Backend"]
    joinedClasses: { type: [String], default: [] },          // list of class names

    // Other fields you already had...
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
