import mongoose from 'mongoose'
import { MONGODB_NAME } from '../constants.js'
import { User } from '../models/user.model.js'
const connectDB = async () => {
    //console.log("a",process.env.CLOUDINARY_API_KEY)
    try {
        const connectinInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${MONGODB_NAME}`)
        console.log("-------------- MongoDB Connected Successfully! ->", connectinInstance.connection.host)
        const result = await User.deleteMany({ username: null });
        console.log(`🧹 Deleted ${result.deletedCount} user(s) with null username`);
    } catch (error) {
        console.log("Error Connecting to the database! Connect Again", error)
        throw error;
    }
}

export default connectDB