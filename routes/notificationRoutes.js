const express = require("express");
const Notification = require("../models/notification");

const router = express.Router();

// Get notifications for a user
router.get("/:userId", async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });

    res.json({ notifications });
  } catch (err) {
    res.status(500).json({ message: "Error loading notifications" });
  }
});

// Mark notification as seen
router.post("/seen/:id", async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { seen: true });
    res.json({ message: "Marked as seen" });
  } catch (err) {
    res.status(500).json({ message: "Error updating notification" });
  }
});

// Create notification
router.post("/", async (req, res) => {
  try {
    const { userId, message, link } = req.body;

    await Notification.create({ userId, message, link });

    res.json({ message: "Notification created" });
  } catch (err) {
    res.status(500).json({ message: "Error creating notification" });
  }
});

module.exports = router;
