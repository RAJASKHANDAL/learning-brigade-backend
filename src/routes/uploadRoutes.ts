import { Router } from "express";
import { protect } from "../middleware/protect";
import { upload } from "../middleware/upload";
import { uploadProfileImage } from "../controllers/uploadController";

const router = Router();

router.post("/profile", protect, upload.single("image"), uploadProfileImage);

export default router;
