import express from 'express'
import authuser from '../middleware/authuser.js'
import { getstreamtoken } from '../controllers/chat.js'

const chatrouter = express.Router()

chatrouter.get('/token',authuser,getstreamtoken)








export default chatrouter