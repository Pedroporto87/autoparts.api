import { Router } from 'express';
import { validationResult } from "express-validator";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { registerValidator, loginValidator } from '../validator/auth.js';
import { User } from '../models/index.js';

const router = Router();
router.post("/register", registerValidator, async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ where: { email } });
        if(existingUser) {
            return res.status(400).json({ success: false, message: "E-mail já cadastrado"});
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        const user = await User.create({ name, email, passwordHash });
        return res.status(201).json({
            success: true,
            data: { id: user.id, name: user.name, email: user.email },
          });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ success: false, message: "Erro no servidor" });
    }
})

router.post("/login", loginValidator, async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if(!user) {
            return res.status(400).json({ success: false, message: "E-mail ou senha inválidos" });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if(!isMatch) {
            return res.status(400).json({ success: false, message: "E-mail ou senha inválidos" });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES || "1d" }
        );

        return res.json({
            success: true,
            data: { token, 
                    user: { id: user.id, name: user.name, email: user.email } },
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ success: false, message: "Erro no servidor" });
    }
})

export default router;