import type { Request, Response } from "express";
import { Notes } from "../models/Notes";
import { uploadToStorage, deleteFromStorage } from "../utils/storage";

export async function uploadNote(req: Request, res: Response) {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    if (!req.user) return res.status(401).json({ message: "Not authorized" });

    const fileURL = await uploadToStorage({
      folder: "notes",
      originalName: req.file.originalname,
      buffer: req.file.buffer,
      contentType: req.file.mimetype,
    });

    const newNote = await Notes.create({
      userId: req.user._id,
      filename: req.file.originalname,
      fileURL,
      uploadedAt: new Date(),
    });

    res.json({ message: "Uploaded successfully", note: newNote });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Upload failed" });
  }
}

export async function getMyNotes(req: Request, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ message: "Not authorized" });

    const notes = await Notes.find({ userId: req.user._id }).sort({ uploadedAt: -1 });
    res.json({ notes });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch notes" });
  }
}

export async function deleteNote(req: Request, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ message: "Not authorized" });

    const note = await Notes.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    if (note.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only delete your own notes" });
    }

    await deleteFromStorage(note.fileURL);
    await note.deleteOne();

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
}
