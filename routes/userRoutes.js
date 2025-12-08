const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/user");

// GET /api/users/me
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ success: true, user });
  } catch (error) {
    console.error("GET /me error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/users/set-role  (called right after Google login)
router.post("/set-role", async (req, res) => {
  try {
    const { uid, role } = req.body;

    if (!uid || !role) {
      return res.status(400).json({ message: "uid and role are required" });
    }

    const user = await User.findByIdAndUpdate(
      uid,
      { role, profileCompleted: false },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ success: true, user });
  } catch (err) {
    console.error("set-role error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/users/student/setup
router.put("/student/setup", auth, async (req, res) => {
  const { interestField, subInterests } = req.body;

  if (!interestField) {
    return res.status(400).json({ message: "Select your interest field" });
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      interestField,
      subInterests,
      profileCompleted: true,
    },
    { new: true }
  );

  res.json({ success: true, user });
});

// PUT /api/users/student/join-class
router.put("/student/join-class", auth, async (req, res) => {
  const { className } = req.body;

  const user = await User.findById(req.user.id);

  if (!user.joinedClasses.includes(className)) {
    user.joinedClasses.push(className);
    await user.save();
  }

  res.json({ success: true, joinedClasses: user.joinedClasses });
});

// PUT /api/users/student/details
router.put("/student/details", auth, async (req, res) => {
  try {
    const { studentType, name, age, mobile, studentEmail } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        studentType,
        name,
        age,
        mobile,
        email: studentEmail,
      },
      { new: true }
    );

    res.json({ success: true, user });
  } catch (err) {
    console.error("Details save error:", err);
    res.status(500).json({ message: "Server error while saving details" });
  }
});

module.exports = router;
