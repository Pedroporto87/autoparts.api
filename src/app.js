import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors(({
  origin: process.env.CORS.ORIGIN || "*", 
})));
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Kaizen' });
})