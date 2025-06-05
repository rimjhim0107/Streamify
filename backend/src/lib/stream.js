import { StreamChat } from "stream-chat"
import "dotenv/config"

const apiKey = process.env.STREAM_API_KEY
const apiSecret = process.env.STREAM_API_SECRET

if(!apiKey || !apiSecret){
    console.error("Stream API key or secret is missing");
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (userData) => {
    try{
        await streamClient.upsertUsers([userData]);   //upsert means create if dont exist otherwise update
        return userData;
    }
    catch(err){
        console.error("Error upserting Stream user: ",err);
    }
}

export const generateStreamToken = (userId) => {
    try{
        //ensure userId is a string
        const userIdStr = userId.toString();
        return streamClient.createToken(userIdStr);
    }
    catch(err){
        console.error("Error generating Stream Token: ",err);
    }
};