import { Router } from "express";
import { googleAuthController } from "../controllers/googleAuthController";
import { validateBody } from "../middleware/validate";
import { googleAuthSchema } from "../schemas";

const router = Router();

router.post("/google", validateBody(googleAuthSchema), googleAuthController);

router.get("/google", (req, res) => {
  res.json({ message: "POST only" });
});

export default router;
