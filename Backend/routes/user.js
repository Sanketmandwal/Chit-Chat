import express from 'express'
import { acceptfriendrequest, getfriendrequest, getfriends, getoutgoingfriendreq, getrecommendedusers, login, logout, onboarding, sendfriendrequest, signup } from '../controllers/user.js';
import authuser from '../middleware/authuser.js';


const userrouter = express.Router();

userrouter.post('/signup', signup)
userrouter.post('/login', login)
userrouter.post('/logout', logout)
userrouter.post('/onboarding', authuser, onboarding)
userrouter.get('/', authuser, getrecommendedusers)
userrouter.get('/friends', authuser, getfriends)
userrouter.post('/friend-request/:id',authuser,sendfriendrequest)
userrouter.put('/friend-request/:id/accept',authuser,acceptfriendrequest)
userrouter.get('/friend-request',authuser,getfriendrequest)
userrouter.get('/outgoing-friend-request',authuser,getoutgoingfriendreq)

userrouter.get("/me", authuser, (req, res) => {
    res.json({ success: true, user: req.user })
})


export default userrouter;