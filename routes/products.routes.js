import { Router } from "express";
import { addProduct, getProducts, getProductsById } from "../controllers/products.controllers.js";

const router = Router();
router.get("/", getProducts);   // /api/products?page=&limit=
router.get("/search", getProductsById); // /api/products/search?q=
router.post("/", addProduct);

export default router;