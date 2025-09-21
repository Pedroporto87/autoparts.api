import { validationResult } from "express-validator";  
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from '../models/index.js'

const isProd = process.env.NODE_ENV === "production"
const cookieOpts = {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: 24*60*60*1000,
}

export const register = async ( req, res ) => {
    try {
        const exists = await User.findOne({ where: { email: req.body.email}})
        if(exists){ return res.status(400).json({ success: false, message: "Email já cadastrado"}) }

        const passwordHash = await bcrypt.hash(req.body.password, 10)
        const user = await User.create({ name, email, password: passwordHash })

        return res.status(201).json({
            success: true,
            data: { id: user.id, name: user.name, email: user.email }
        });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Erro na criação do usuário" });
    }
}

export const login = async ( req, res ) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json({ success: true, message: "E-mail inválido"})
    }

    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email }});
        if(!user){
            return res.status(400).json({ success: false, message: "Senha inválida"})
        }

        const ok = await bcrypt.compare(password, user.passwordHash)
        if(!ok){
            return res.status(400).json({ success: false, message: "Senha inválida"})
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_EXPIRES,
            { expiresIn: process.env.JWT_EXPIRES || '1d' }
        )

        res.cookie("access_token", token, cookieOpts)

        return res.json({
            success: true,
            data: { user: { id: user.id, name: user.name, email: user.email } },
          });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Erro no login" });
        
    }
}

export const logout = async (_req, res) => {
    res.clearCookie("access_token", { path: "/" });
    return res.json({ success: true });
  };

  export const me = async (req, res) => {
    return res.json({ success: true, data: { id: req.user.id, email: req.user.email } });
  };