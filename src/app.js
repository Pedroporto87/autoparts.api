import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from '../routes/auth.routes.js';

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

export default app;