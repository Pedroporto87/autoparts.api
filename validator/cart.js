import { body, param } from 'express-validator';

export const addItemValidator = [
    body("productId").isInt({ min: 1 }).withMessage("productId deve ser um inteiro positivo"),
    body("quantity").optional().isInt({ min: 1 }).withMessage("quantity deve ser >= 1"),
];

export const updateItemValidator = [
    param("id").isInt({ min:1 }).withMessage("id inválido"),
    body("quantity").isInt({ min:1 }).withMessage("quantity deve ser >= 1"),
]