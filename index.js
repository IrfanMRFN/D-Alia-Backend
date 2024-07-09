import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDB } from "./config/connectDB.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import adminRouter from "./routes/adminRoute.js";

// Konfigurasi app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Rute utama
app.get("/", (req, res) => {
  res.send("API Working");
});

// Koneksi database
connectDB();

// Rute API
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/admin", adminRouter);

// Menjalankan server
app.listen(PORT, () => {
  console.log(`Server dimulai di port ${PORT}`);
});
