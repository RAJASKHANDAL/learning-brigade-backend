const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const { uploadNote, getMyNotes, deleteNote } = require("../controllers/notesController");

router.post("/upload", auth, upload.single("noteFile"), uploadNote);
router.get("/my-notes", auth, getMyNotes);
router.delete("/:id", auth, deleteNote);

module.exports = router;
