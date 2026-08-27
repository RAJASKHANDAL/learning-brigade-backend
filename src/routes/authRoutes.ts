import { Router } from "express";
import { signup, login } from "../controllers/authController";
import { validateBody } from "../middleware/validate";
import { signupSchema, loginSchema } from "../schemas";

const router = Router();

router.post("/signup", validateBody(signupSchema), signup);
router.post("/login", validateBody(loginSchema), login);

export default router;
