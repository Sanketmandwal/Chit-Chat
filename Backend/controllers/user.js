import validator from 'validator'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import usermodel from '../models/user.js'
import { createStreamuser } from '../config/stream.js'
import FriendRequest from '../models/friendrequest.js'

const login = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await usermodel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "No User Found of this email please Register" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.cookie("jwt", token, {
                maxAge: 7 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                sameSite: "strict",
                secure: process.env.NODE_ENV === 'production'
            })
            return res.json({ success: true, user })
        }
        else {
            res.json({ success: false, message: 'Incorrect Password' })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Invalid Credentials" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Enter a Valid Email" });
        }

        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Enter a Strong Password" });
        }

        const existingUser = await usermodel.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ success: false, message: "Email already registered" });
        }

        const salt = await bcrypt.genSalt(10)
        const hashedpass = await bcrypt.hash(password, salt)

        const idx = Math.floor(Math.random() * 100) + 1
        const img = `https://avatar.iran.liara.run/public/${idx}.png`
        const userData = {
            name,
            email,
            password: hashedpass,
            image: img,
        }


        const newuser = new usermodel(userData)
        await newuser.save()

        try {
            await createStreamuser({
                id: newuser._id,
                name: newuser.name,
                image: newuser.image,
            })
            console.log("Stream User Created")
        } catch (error) {
            console.log(error.message)
        }

        const token = jwt.sign({ id: newuser._id }, process.env.JWT_SECRET)

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === 'production'
        })

        return res.status(201).json({ success: true, user: userData })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
}

const logout = async (req, res) => {
    res.clearCookie("jwt");
    res.json({ success: true, message: "Logout SuccessFull" })
}

const onboarding = async (req, res) => {
    try {
        const userId = req.user._id;
        const { address, gender, dob, phone, bio } = req.body;
        if (!address || !address.line1 || !address.line2 || !gender || !dob || !phone || !bio) {
            return res.json({ success: false, message: "All Field Required" })
        }

        const updateddata = await usermodel.findByIdAndUpdate(userId, {
            ...req.body,
            isonboarded: true,
        }, { new: true })

        try {
            await createStreamuser({
                id: updateddata._id,
                name: updateddata.name,
                image: updateddata.image,
            })
            console.log("Stream User Updated")
        } catch (error) {
            console.log(error.message)
        }

        if (!updateddata) {
            return res.json({ success: false, message: "User not Found" })
        }

        res.json({ success: true, message: "User Updated", updateddata })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const getrecommendedusers = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = req.user;
        const rusers = await usermodel.find({
            $and: [
                { _id: { $ne: userId } },
                { _id: { $nin: user.friends } },
                { isonboarded: true }
            ]
        })
        res.json(rusers)
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const getfriends = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await usermodel.findById(userId).select("friends")
            .populate('friends', 'name phone dob gender bio image')

        res.json(user.friends)

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const sendfriendrequest = async (req, res) => {
    try {
        const myid = req.user._id;
        const { id } = req.params
        if (myid == id) {
            return res.json({ success: false, message: "You cannot send friend request to yourself" })
        }

        const recipient = await usermodel.findById(id)

        if (!recipient) {
            return res.json({ success: false, message: "Recipient Not Found" })
        }

        if (Array.isArray(recipient.friends) && recipient.friends.includes(myid)) {
            return res.json({ success: false, message: "You are already friends with user" })
        }

        const existingrequest = await FriendRequest.findOne({
            $or: [
                { sender: myid, recipient: id },
                { sender: id, recipient: myid },
            ],
        })

        if (existingrequest) {
            return res.json({ message: "A Friend Request Already exists between you and this user" })
        }

        const request = await FriendRequest.create({
            sender: myid,
            recipient: id,
        })

        res.json(request)
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const acceptfriendrequest = async (req, res) => {
    try {
        const { id } = req.params

        const friendrequest = await FriendRequest.findById(id)

        if (!friendrequest) {
            return res.json({ message: "friend request not found" })
        }

        if (friendrequest.recipient.toString() !== req.user._id.toString()) {
            return res.json({ message: "You are not authorized to accept the request" })
        }

        friendrequest.status = "accepted"
        await friendrequest.save()

        await usermodel.findByIdAndUpdate(friendrequest.sender, {
            $addToSet: { friends: friendrequest.recipient }
        })

        await usermodel.findByIdAndUpdate(friendrequest.recipient, {
            $addToSet: { friends: friendrequest.sender }
        })

        res.json({ message: "Friend Request Accepted" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const getfriendrequest = async (req, res) => {
    try {
        const incomereqs = await FriendRequest.find({
            recipient: req.user.id,
            status: "pending",
        }).populate("sender", "name phone dob gender bio image")

        const acceptedreq = await FriendRequest.find({
            sender: req.user.id,
            status: "accepted",
        }).populate("recipient", "name phone dob gender bio image")

        res.json({ incomereqs, acceptedreq })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const getoutgoingfriendreq = async (req, res) => {
    try {
        const onreqs = await FriendRequest.find({
            sender: req.user.id,
            status: "pending",
        }).populate("recipient", "name phone dob gender bio image")
        return res.json(onreqs)
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { login, signup, logout, onboarding, getrecommendedusers, getfriends, sendfriendrequest, acceptfriendrequest, getfriendrequest, getoutgoingfriendreq }