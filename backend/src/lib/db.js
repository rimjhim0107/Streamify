import mongoose from "mongoose"

export const ConnectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected : ${conn.connection.host}`);
    }
    catch(err){
        console.log("Error in connecting to MongoDB: ",err);
        process.exit(1);  // 1 means failure

    }
}