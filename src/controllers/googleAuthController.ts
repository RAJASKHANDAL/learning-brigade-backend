import jwt from "jsonwebtoken";
import type { Request, Response } from "express";
import admin from "../config/firebaseAdmin";
import { User } from "../models/User";
import { env } from "../config/env";

export async function googleAuthController(req: Request, res: Response) {
  try {
    const { credential } = req.body;

    const decoded = await admin.auth().verifyIdToken(credential);
    const { email, name, picture } = decoded;

    if (!email) {
      return res.status(400).json({ message: "Google account has no email" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name: name ?? "Google User",
        email,
        profileImage: picture ?? null,
      });
    }

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email, role: user.role },
      env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, user });
  } catch (err) {
    console.error("Google Auth Error:", err);
    res.status(500).json({ message: "Google login failed" });
  }
}
