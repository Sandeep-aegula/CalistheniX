import mongoose from 'mongoose'

const connectDB = async()=>{
    try {
        if (!process.env.MONGODB_URL) {
            throw new Error('MONGODB_URL is not defined in environment variables');
        }
        
        if (mongoose.connection.readyState === 1) {
            console.log('Already connected to MongoDB');
            return;
        }
        
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to MongoDB successfully");
        
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        throw error;
    }
}

export default connectDB;