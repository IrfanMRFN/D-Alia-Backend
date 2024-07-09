import mongoose from "mongoose";

const DB_URL = process.env.DB_URL;

export const connectDB = async () => {
  try {
    await mongoose.connect(DB_URL);
    console.log("Database terhubung");
  } catch (error) {
    console.log("Gagal terhubung ke database", err);
    process.exit(1);
  }
};
