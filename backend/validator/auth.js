import { body } from 'express-validator';

export const registerValidator = [
    body("name").trim().notEmpty().withMessage("Nome é obrigatório"),
  body("email").trim().isEmail().withMessage("E-mail inválido"),
  body("password").isString().isLength({ min: 6 }).withMessage("Senha deve ter 6+ caracteres"),
];

export const loginValidator = [
    body("email")
    .trim()
    .isEmail()
    .withMessage("E-mail inválido"),
  body("password")
    .isString()
    .isLength({ min: 6 })
    .withMessage("Senha deve ter 6+ caracteres"),
];