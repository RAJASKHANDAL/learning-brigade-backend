import { Router } from "express";
import { LiveClass } from "../models/LiveClass";
import { protect } from "../middleware/protect";
import { requireRole } from "../middleware/requireRole";
import { validateBody } from "../middleware/validate";
import { startLiveClassSchema } from "../schemas";
import { asyncHandler } from "../middleware/asyncHandler";
import { AppError } from "../middleware/AppError";

const router = Router();

// Start a live class
router.post(
  "/start",
  protect,
  requireRole("teacher"),
  validateBody(startLiveClassSchema),
  asyncHandler(async (req, res) => {
    const { title, description, roomId } = req.body;

    // Make all other classes not live
    await LiveClass.updateMany({}, { isLive: false });

    const liveClass = await LiveClass.create({
      title,
      description,
      roomId,
      teacherId: req.user!._id,
      teacherName: req.user!.name,
      isLive: true,
      startedAt: new Date(),
    });

    res.json({ success: true, liveClass });
  })
);

// Get active live class
router.get(
  "/active",
  asyncHandler(async (req, res) => {
    const liveClass = await LiveClass.findOne({ isLive: true });
    res.json({ liveClass });
  })
);

// End the currently active class — only the teacher who started it can end it
router.post(
  "/end",
  protect,
  requireRole("teacher"),
  asyncHandler(async (req, res) => {
    const liveClass = await LiveClass.findOne({ isLive: true });

    if (liveClass && liveClass.teacherId.toString() !== req.user!._id.toString()) {
      throw new AppError("Only the teacher who started this class can end it", 403);
    }

    await LiveClass.updateMany({}, { isLive: false });
    res.json({ success: true, message: "Live class ended" });
  })
);

export default router;
