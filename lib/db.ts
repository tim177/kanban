import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://amit18singh20:WHzaLdZOgo4fmjIa@cluster0.5w0n2ep.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
if (!MONGODB_URI)
  throw new Error("Please define the MONGODB_URI environment variable");

let isConnected = false;

export async function connectToDatabase() {
  if (isConnected) return mongoose;

  try {
    const db = await mongoose.connect(MONGODB_URI, { bufferCommands: false });
    isConnected = true;
    console.log("✅ Connected to MongoDB");
    return db;
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
    throw error;
  }
}
