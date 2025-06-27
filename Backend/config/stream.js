import { StreamChat } from "stream-chat";
import 'dotenv/config';

const apikey = process.env.STREAM_API_KEY;
const apisecret = process.env.STREAM_API_SECRET;

if (!apikey || !apisecret) {
    console.error("Stream API or Stream Secret is Missing");
}

const streamClient = StreamChat.getInstance(apikey, apisecret);

export const createStreamuser = async (userdata) => {
    try {
        const result = await streamClient.upsertUsers([userdata]);
        return result;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
};

export const generateStreamToken = (userId) => {
    try {
        const useridstr = userId.toString()
        return streamClient.createToken(useridstr)
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}