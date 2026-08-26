import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import { User } from "../models/User";
import { env } from "../config/env";

interface TokenPayload {
  id: string;
}

export async function protect(req: Request, res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    const token = header?.startsWith("Bearer ") ? header.slice(7).trim() : undefined;

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as TokenPayload;
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth middleware error:", (err as Error).message);
    res.status(401).json({ message: "Token invalid or expired" });
  }
}
