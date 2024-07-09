import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  placeOrder,
  userOrder,
  listOrders,
  updateStatus,
  updatePayment,
} from "../controllers/orderController.js";

const orderRouter = new express.Router();

orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/status", authMiddleware, updateStatus);
orderRouter.post("/payment", authMiddleware, updatePayment);
orderRouter.post("/userorders", authMiddleware, userOrder);
orderRouter.get("/list", listOrders);

export default orderRouter;
