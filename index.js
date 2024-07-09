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
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

// Route to serve images with dynamic content type
app.get("/images/:filename", (req, res) => {
  const imagePath = path.join(__dirname, "public", req.params.filename);

  // Determine content type based on file extension
  let contentType;
  const ext = path.extname(imagePath).toLowerCase();
  switch (ext) {
    case ".jpg":
    case ".jpeg":
      contentType = "image/jpeg";
      break;
    case ".png":
      contentType = "image/png";
      break;
    case ".gif":
      contentType = "image/gif";
      break;
    default:
      contentType = "application/octet-stream"; // fallback to binary data if type is unknown
  }

  // Set the content type header
  res.type(contentType);

  // Send the file
  res.sendFile(imagePath);
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
