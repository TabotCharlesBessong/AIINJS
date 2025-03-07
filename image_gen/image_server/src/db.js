import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoUri =
  process.env.MONGO_URI || "mongodb://localhost:27017/image_gen";

async function connectToDatabase() {
  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB with Mongoose");
    return mongoose.connection;
  } catch (error) {
    console.error("Could not connect to MongoDB", error);
    process.exit(1);
  }
}

export { connectToDatabase };
