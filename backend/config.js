import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/employeeDB");
    console.log("MongoDB connected");
  } catch (error) {
    console.log("Error:", error);
  }
};
