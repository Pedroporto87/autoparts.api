import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { addItemValidator, updateItemValidator } from "../validator/cart.js";
import { getCart, addItem, updateItem, removeItem } from "../controllers/cartItem.controllers.js";

const router = Router();
router.use(auth); 

router.get("/", getCart);
router.post("/", addItemValidator, addItem);
router.put("/:id", updateItemValidator, updateItem);
router.delete("/:id", removeItem);

export default router;
