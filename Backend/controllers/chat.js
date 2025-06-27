import { generateStreamToken } from "../config/stream.js"



const getstreamtoken = async (req, res) => {
    try {
        const token = generateStreamToken(req.user.id)
        res.json({ token })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export {getstreamtoken}