import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from '../routes/auth.routes.js';
import productsRoutes from '../routes/products.routes.js'
import cartRoutes from '../routes/cart.routes.js'

dotenv.config();

const app = express();
app.use(cors(({
  origin: process.env.CORS_ORIGIN || "*", 
})));
app.use(express.json());
//starter
app.get('/starter', (_req, res) => {
    res.json({ status: "ok", message: 'Welcome to the Kaizen' });
})
//auth
app.use("/api/auth", authRoutes);
//products
app.use("/api/products", productsRoutes);
//cart
app.use("/api/cart", cartRoutes);

export default app;