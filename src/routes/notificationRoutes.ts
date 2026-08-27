import { Router } from "express";
import { Notification } from "../models/Notification";
import { validateBody } from "../middleware/validate";
import { createNotificationSchema } from "../schemas";
import { asyncHandler } from "../middleware/asyncHandler";

const router = Router();

// Get notifications for a user
router.get(
  "/:userId",
  asyncHandler(async (req, res) => {
    const notifications = await Notification.find({ userId: req.params.userId }).sort({
      createdAt: -1,
    });

    res.json({ notifications });
  })
);

// Mark notification as seen
router.post(
  "/seen/:id",
  asyncHandler(async (req, res) => {
    await Notification.findByIdAndUpdate(req.params.id, { seen: true });
    res.json({ message: "Marked as seen" });
  })
);

// Create notification
router.post(
  "/",
  validateBody(createNotificationSchema),
  asyncHandler(async (req, res) => {
    const { userId, message, link } = req.body;
    await Notification.create({ userId, message, link });
    res.json({ message: "Notification created" });
  })
);

export default router;
