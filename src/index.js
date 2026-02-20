import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
connectDB();

app.get('/',(req,res)=>{
    res.send('braindesk ai is running 🚀 hloo')
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log('App listening on port 3000!');
});