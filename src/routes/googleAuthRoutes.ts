import { Router } from "express";
import { googleAuthController } from "../controllers/googleAuthController";

const router = Router();

router.post("/google", googleAuthController);

router.get("/google", (req, res) => {
  res.json({ message: "POST only" });
});

export default router;
