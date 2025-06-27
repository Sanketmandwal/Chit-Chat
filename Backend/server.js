import express from 'express'
import connectDB from './config/mongodb.js'
import dotenv from 'dotenv';
dotenv.config()
import cors from 'cors'
import userrouter from './routes/user.js';
import cookieParser from 'cookie-parser';
import chatrouter from './routes/chat.js';

const app=express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}))
app.use(cookieParser())
connectDB()

app.use('/api/user',userrouter)
app.use('/api/chat',chatrouter)


app.listen(5001,()=> console.log("Server Started"))