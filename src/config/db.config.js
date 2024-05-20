import mongoose from "mongoose";
import { config } from "dotenv";
config();

const connectDb = () => {
  return mongoose.connect(process.env.MONGO_URI);
};

export default connectDb;
