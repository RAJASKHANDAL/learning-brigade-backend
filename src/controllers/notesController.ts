import type { Request, Response } from "express";
import { Notes } from "../models/Notes";

export async function uploadNote(req: Request, res: Response) {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    if (!req.user) return res.status(401).json({ message: "Not authorized" });

    const newNote = await Notes.create({
      userId: req.user._id,
      filename: req.file.originalname,
      fileURL: `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`,
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
    await Notes.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
}
