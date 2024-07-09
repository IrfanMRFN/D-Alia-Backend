import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import { sendOrderNotification } from "../services/mailer.js";

// Menempatkan pesanan pengguna untuk frontend
const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    const newOrder = new orderModel({ userId, items, amount, address });
    await newOrder.save();
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    await sendOrderNotification(newOrder);

    res.status(201).json({ success: true, message: "Pesanan berhasil dibuat" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat membuat pesanan",
    });
  }
};

// Pesanan pengguna untuk frontend
const userOrder = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await orderModel.find({ userId });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil pesanan pengguna",
    });
  }
};

// Daftar pesanan untuk admin panel
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil daftar pesanan",
    });
  }
};

// Memperbarui status pesanan
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status });
    res
      .status(200)
      .json({ success: true, message: "Status pesanan berhasil diperbarui" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat memperbarui status pesanan",
    });
  }
};

// Memperbarui status pembayaran
const updatePayment = async (req, res) => {
  try {
    const { orderId, payment } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { payment });
    res.status(200).json({
      success: true,
      message: "Status pembayaran berhasil diperbarui",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat memperbarui status pembayaran",
    });
  }
};

export { placeOrder, userOrder, listOrders, updateStatus, updatePayment };
