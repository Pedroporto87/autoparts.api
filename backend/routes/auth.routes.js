import { Router } from "express";
import { registerValidator, loginValidator } from "../validator/auth.js";
import { register, login, logout, me } from "../controllers/auth.controllers.js";
import { auth } from "../middleware/auth.js";

const router = Router();

router.post("/register", registerValidator, register);
router.post("/login",    loginValidator,    login);
router.post("/logout",   logout);
router.get("/me", auth, me);

export default router;