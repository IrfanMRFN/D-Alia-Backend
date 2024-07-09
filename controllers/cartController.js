import userModel from "../models/userModel.js";

// Menambahkan item ke keranjang pengguna
const addToCart = async (req, res) => {
  try {
    const { userId, itemId } = req.body;
    const userData = await userModel.findById(userId);
    const cartData = userData.cartData || {};

    cartData[itemId] = (cartData[itemId] || 0) + 1;

    await userModel.findByIdAndUpdate(userId, { cartData });
    res
      .status(200)
      .json({ success: true, message: "Berhasil ditambahkan ke keranjang" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat menambahkan ke keranjang",
    });
  }
};

// Menghapus item dari keranjang pengguna
const removeFromCart = async (req, res) => {
  try {
    const { userId, itemId } = req.body;
    const userData = await userModel.findById(userId);
    const cartData = userData.cartData || {};

    if (cartData[itemId] > 0) {
      cartData[itemId]--;
    }

    await userModel.findByIdAndUpdate(userId, { cartData });
    res
      .status(200)
      .json({ success: true, message: "Berhasil dihapus dari keranjang" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat menghapus dari keranjang",
    });
  }
};

// Mengambil data keranjang pengguna
const getCart = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await userModel.findById(userId);
    const cartData = userData.cartData || {};

    res.status(200).json({ success: true, cartData });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil data keranjang",
    });
  }
};

export { addToCart, removeFromCart, getCart };
