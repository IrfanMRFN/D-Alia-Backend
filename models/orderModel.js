import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  items: {
    type: Array,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  address: {
    type: Object,
    required: true,
  },
  status: {
    type: String,
    default: "Pesanan sedang diproses",
  },
  payment: {
    type: String,
    default: "Belum dibayar",
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

const orderModel = mongoose.model.order || mongoose.model("order", orderSchema);

export default orderModel;
