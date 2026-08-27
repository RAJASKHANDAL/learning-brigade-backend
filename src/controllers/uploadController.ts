import type { Request, Response } from "express";
import { User } from "../models/User";
import { uploadToStorage, deleteFromStorage } from "../utils/storage";

export async function uploadProfileImage(req: Request, res: Response) {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    if (!req.user) return res.status(401).json({ message: "Not authorized" });

    const url = await uploadToStorage({
      folder: "profile-images",
      originalName: req.file.originalname,
      buffer: req.file.buffer,
      contentType: req.file.mimetype,
    });

    const previousImage = req.user.profileImage;

    await User.findByIdAndUpdate(req.user._id, { profileImage: url });

    if (previousImage) {
      await deleteFromStorage(previousImage);
    }

    res.json({ url });
  } catch (err) {
    console.error("Profile upload error:", err);
    res.status(500).json({ message: "Upload failed" });
  }
}
