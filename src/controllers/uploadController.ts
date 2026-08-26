import type { Request, Response } from "express";
import { User } from "../models/User";

export async function uploadProfileImage(req: Request, res: Response) {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    if (!req.user) return res.status(401).json({ message: "Not authorized" });

    const url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    await User.findByIdAndUpdate(req.user._id, { profileImage: url });

    res.json({ url });
  } catch (err) {
    console.error("Profile upload error:", err);
    res.status(500).json({ message: "Upload failed" });
  }
}
