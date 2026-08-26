import { Router } from "express";
import { protect } from "../middleware/protect";
import { upload } from "../middleware/upload";
import { uploadNote, getMyNotes, deleteNote } from "../controllers/notesController";

const router = Router();

router.post("/upload", protect, upload.single("noteFile"), uploadNote);
router.get("/my-notes", protect, getMyNotes);
router.delete("/:id", protect, deleteNote);

export default router;
