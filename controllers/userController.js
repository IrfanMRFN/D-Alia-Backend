import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import argon2 from "argon2";
import validator from "validator";

// Fungsi untuk membuat token user
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Registrasi pengguna baru
const registerUser = async (req, res) => {
  const { name, email, password, phoneNumber } = req.body;
  try {
    // Memeriksa apakah pengguna sudah terdaftar
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res
        .status(400)
        .json({ success: false, message: "Pengguna sudah terdaftar" });
    }

    // Validasi alamat email
    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Alamat email tidak valid" });
    }

    // Password harus minimal 8 karakter
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password harus minimal 8 karakter",
      });
    }

    // Hash password
    const hashedPassword = await argon2.hash(password);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
    });

    const user = await newUser.save();
    const token = createToken(user._id);
    res
      .status(201)
      .json({ success: true, message: "Pengguna berhasil terdaftar", token });
  } catch (error) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mendaftarkan pengguna",
    });
  }
};

// Login pengguna
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Pengguna tidak ditemukan" });
    }

    // Verifikasi password
    const match = await argon2.verify(user.password, password);
    if (!match) {
      return res
        .status(401)
        .json({ success: false, message: "kredensial tidak valid" });
    }

    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Terjadi kesalahan saat login" });
  }
};

// Membuat password baru
const changePassword = async (req, res) => {
  const { email, phoneNumber, newPassword } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Pengguna tidak ditemukan" });
    }

    // Verifikasi nomor telepon
    if (user.phoneNumber !== phoneNumber) {
      return res
        .status(401)
        .json({ success: false, message: "Nomor telepon tidak valid" });
    }

    // Hash password baru
    const hashedPassword = await argon2.hash(newPassword);

    user.password = hashedPassword;
    await user.save();
    res
      .status(200)
      .json({ success: true, message: "Password berhasil diubah" });
  } catch (error) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengubah password",
    });
  }
};

export { registerUser, loginUser, changePassword };
