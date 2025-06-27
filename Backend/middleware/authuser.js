import jwt from 'jsonwebtoken'
import usermodel from '../models/user.js';

const authuser = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.json({ success: false, message: "Not Authorized Login Again" })
        }
        const token_decode = jwt.verify(token, process.env.JWT_SECRET)

        const user = await usermodel.findById(token_decode.id).select("-password")

        if (!user) {
            return res.json({ success: false, message: "Unauthorized User found" })
        }

        req.user = user;

        next()
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export default authuser