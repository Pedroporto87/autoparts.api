import { Router } from "express";
import { registerValidator, loginValidator } from "../validator/auth.js";
import { register, login, logout } from "../controllers/auth.controllers.js";

const router = Router();

router.post("/register", registerValidator, register);
router.post("/login",    loginValidator,    login);
router.post("/logout",   logout);

export default router;