import express from "express";
import adminAuth from "./../middleware/adminAuth.js";
import authUser from "./../middleware/auth.js";
import {
  getAllOrders,          // ✅ admin: get all orders
  getUserOrders,         // ✅ user: get their orders
  placeOrder,
  placeOrderRazorpay,
  placeOrderStripe,
  updateOrderStatus,
  verifyRazorpay,
  verifyStripe,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

// 🛒 USER ROUTES
orderRouter.post("/place", authUser, placeOrder);
orderRouter.post("/stripe", authUser, placeOrderStripe);
orderRouter.post("/verifystripe", authUser, verifyStripe);
orderRouter.post("/razorpay", authUser, placeOrderRazorpay);
orderRouter.post("/verifyrazorpay", authUser, verifyRazorpay);
orderRouter.post("/userorders", authUser, getUserOrders);   // ✅ fixed

// 🔑 ADMIN ROUTES
orderRouter.post("/list", adminAuth, getAllOrders);
orderRouter.post("/status", adminAuth, updateOrderStatus);

export default orderRouter;
