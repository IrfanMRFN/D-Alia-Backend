import adminModel from "../models/adminModel.js";
import jwt from "jsonwebtoken";
import argon2 from "argon2";

// Membuat token admin
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Registrasi admin
const registerAdmin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const exists = await adminModel.findOne({ username });
    if (exists) {
      return res
        .status(400)
        .json({ success: false, message: "Admin sudah terdaftar" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ success: false, message: "Masukkan kata sandi yang kuat" });
    }

    // Hash kata sandi
    const hashedPassword = await argon2.hash(password);

    const newAdmin = new adminModel({
      username,
      password: hashedPassword,
    });

    const admin = await newAdmin.save();
    const token = createToken(admin._id);

    res
      .status(201)
      .json({ success: true, message: "Admin berhasil terdaftar", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mendaftarkan admin",
    });
  }
};

// Login admin
const loginAdmin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await adminModel.findOne({ username });
    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "Admin tidak ditemukan" });
    }

    // Verifikasi kata sandi
    const match = await argon2.verify(admin.password, password);
    if (match) {
      const token = createToken(admin._id);
      res.json({ success: true, token });
    } else {
      res
        .status(401)
        .json({ success: false, message: "Data yang dimasukkan tidak sesuai" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Terjadi kesalahan saat login" });
  }
};

export { registerAdmin, loginAdmin };
