const express = require("express");
const router = express.Router();
const LiveClass = require("../models/LiveClass");
const protect = require("../middleware/auth");

// Start a live class
router.post("/start", protect, async (req, res) => {
  try {
    const { title, description } = req.body;

    // Make all other classes not live
    await LiveClass.updateMany({}, { isLive: false });

    const liveClass = await LiveClass.create({
      title,
      description,
      teacherId: req.user._id,
      teacherName: req.user.name,
      isLive: true,
      startedAt: new Date(),
    });

    res.json({ success: true, liveClass });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get active live class
router.get("/active", async (req, res) => {
  const liveClass = await LiveClass.findOne({ isLive: true });
  res.json({ liveClass });
});

// End class
router.post("/end", protect, async (req, res) => {
  await LiveClass.updateMany({}, { isLive: false });
  res.json({ success: true, message: "Live class ended" });
});

module.exports = router;
