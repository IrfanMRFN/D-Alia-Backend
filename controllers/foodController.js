import foodModel from "../models/foodModel.js";
import fs from "fs";

// Menambahkan menu
const addFood = async (req, res) => {
  const imageFilename = req.file.filename;

  const food = new foodModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: imageFilename,
  });

  try {
    await food.save();
    res
      .status(201)
      .json({ success: true, message: "Menu baru berhasil ditambah" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error menambah menu baru" });
  }
};

// Daftar semua menu
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.status(200).json({ success: true, data: foods });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil daftar menu",
    });
  }
};

// Memperbarui menu
const updateFood = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const updateData = { name, description, price, category };

    // Untuk menangani pembaruan file jika ada file gambar baru
    if (req.file) {
      const food = await foodModel.findById(req.params.id);
      if (food && food.image) {
        fs.unlink(`uploads/${food.image}`, (err) => {
          if (err) console.error(err);
        });
      }
      updateData.image = req.file.filename;
    }

    const updatedFood = await foodModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
      }
    );

    if (updatedFood) {
      res.status(200).json({
        success: true,
        message: "Menu berhasil diperbarui",
        data: updatedFood,
      });
    } else {
      res.status(404).json({ success: false, message: "Menu tidak ditemukan" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat memperbarui menu",
    });
  }
};

// Menghapus menu
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.params.id);
    if (food) {
      if (food.image) {
        fs.unlink(`uploads/${food.image}`, (err) => {
          if (err) console.error(err);
        });
      }

      await foodModel.findByIdAndDelete(req.params.id);
      res.status(200).json({ success: true, message: "Menu berhasil dihapus" });
    } else {
      res.status(404).json({ success: false, message: "Menu tidak ditemukan" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat menghapus menu",
    });
  }
};

export { addFood, listFood, updateFood, removeFood };
