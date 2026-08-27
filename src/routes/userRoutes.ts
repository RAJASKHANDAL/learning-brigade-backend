import { Router } from "express";
import { protect } from "../middleware/protect";
import { validateBody } from "../middleware/validate";
import { asyncHandler } from "../middleware/asyncHandler";
import { AppError } from "../middleware/AppError";
import { User } from "../models/User";
import { setRoleSchema, studentSetupSchema, joinClassSchema, studentDetailsSchema } from "../schemas";

const router = Router();

// GET /api/users?role=teacher — directory listing, safe field allowlist only
// (never email/mobile/password), auth-protected since this is in-app data.
router.get(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const { role } = req.query;
    const filter = typeof role === "string" ? { role } : {};

    const users = await User.find(filter).select("name interestField profileImage role");

    res.json({ success: true, users });
  })
);

// GET /api/users/me
router.get(
  "/me",
  protect,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user!.id).select("-password");
    if (!user) throw new AppError("User not found", 404);

    res.json({ success: true, user });
  })
);

// POST /api/users/set-role (called right after Google login).
// Auth-protected: the target user is always the caller, never a
// client-supplied id, to prevent one account setting another's role.
router.post(
  "/set-role",
  protect,
  validateBody(setRoleSchema),
  asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(
      req.user!.id,
      { role: req.body.role, profileCompleted: false },
      { new: true }
    );

    if (!user) throw new AppError("User not found", 404);

    res.json({ success: true, user });
  })
);

// PUT /api/users/student/setup
router.put(
  "/student/setup",
  protect,
  validateBody(studentSetupSchema),
  asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(
      req.user!.id,
      { interestField: req.body.interestField, subInterests: req.body.subInterests, profileCompleted: true },
      { new: true }
    );

    res.json({ success: true, user });
  })
);

// PUT /api/users/student/join-class
router.put(
  "/student/join-class",
  protect,
  validateBody(joinClassSchema),
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user!.id);
    if (!user) throw new AppError("User not found", 404);

    if (!user.joinedClasses.includes(req.body.className)) {
      user.joinedClasses.push(req.body.className);
      await user.save();
    }

    res.json({ success: true, joinedClasses: user.joinedClasses });
  })
);

// PUT /api/users/student/details
router.put(
  "/student/details",
  protect,
  validateBody(studentDetailsSchema),
  asyncHandler(async (req, res) => {
    const { studentType, name, age, mobile, studentEmail } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user!.id,
      { studentType, name, age, mobile, email: studentEmail },
      { new: true }
    );

    res.json({ success: true, user });
  })
);

export default router;
