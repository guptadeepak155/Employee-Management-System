import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import employeeRoutes from "./routes/employeeRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

// update connection string if needed
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/employeeDB";

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Mongo error:", err));

app.use("/api/employees", employeeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
