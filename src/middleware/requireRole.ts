import type { NextFunction, Request, Response } from "express";
import type { IUser } from "../models/User";

// Defined for use once wired onto routes in the next phase — not yet applied
// anywhere, matching current (unenforced) behavior.
export function requireRole(...roles: IUser["role"][]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role as IUser["role"])) {
      return res.status(403).json({ message: "Access denied. You do not have permission." });
    }
    next();
  };
}
