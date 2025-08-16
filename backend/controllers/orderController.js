import orderModel from "../models/orderModel.js";
import User from "../models/userModel.js";
import Stripe from "stripe";
import Razorpay from "razorpay";
import crypto from "crypto";
import { log } from "console";

const currency = "inr";
const deliveryCharge = 10;

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * Place a normal order (COD)
 */
const placeOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const { items, amount, address } = req.body;

    if (!items?.length)
      return res
        .status(400)
        .json({ success: false, message: "Items are required" });
    if (!amount || amount <= 0)
      return res
        .status(400)
        .json({ success: false, message: "Amount must be greater than 0" });
    if (!address || typeof address !== "object")
      return res
        .status(400)
        .json({ success: false, message: "Address is required" });

    const newOrder = await orderModel.create({
      userId,
      items,
      amount,
      address,
      status: "Order Placed",
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    });

    await User.findByIdAndUpdate(userId, { cartData: {} });

    res.status(200).json({
      success: true,
      message: "Order placed successfully",
      orderId: newOrder._id,
    });
  } catch (error) {
    console.error("Error in placeOrder:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

/**
 * Get orders of the logged-in user
 */
const getUserOrders = async (req, res) => {
  try {
    const userId = req.userId;
    const orders = await orderModel.find({ userId }).sort({ date: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error in getUserOrders:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

/**
 * Get all orders (admin)
 */
const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find()
      .sort({ date: -1 })
      .populate("userId", "name email");
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error in getAllOrders:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

/**
 * Update order status (admin)
 */
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    if (!orderId || !status)
      return res
        .status(400)
        .json({ success: false, message: "orderId and status are required" });

    const order = await orderModel.findById(orderId);
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    order.status = status;
    await order.save();

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Error in updateOrderStatus:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

/**
 * Place an order via Stripe
 */
const placeOrderStripe = async (req, res) => {
  try {
    const userId = req.userId;
    const { items, address, amount } = req.body;
    const { origin } = req.headers;

    if (!items?.length || !amount || !address)
      return res
        .status(400)
        .json({ success: false, message: "Invalid order data" });

    // Create order with payment: false
    const newOrder = await orderModel.create({
      userId,
      items,
      amount,
      address,
      status: "Order Placed",
      paymentMethod: "Stripe",
      payment: false,
      date: Date.now(),
    });

    const line_items = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.name },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${origin}/verify?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/verify?canceled=true&orderId=${newOrder._id}`,
      metadata: { orderId: newOrder._id.toString(), userId: userId.toString() },
    });

    res.status(200).json({ success: true, url: session.url });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Stripe error", error: error.message });
  }
};

const verifyStripe = async (req, res) => {
  try {
    const { session_id } = req.body;

    const session = await stripe.checkout.sessions.retrieve(session_id);
    const orderId = session.metadata.orderId;
    const userId = session.metadata.userId;

    if (session.payment_status === "paid") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      await User.findByIdAndUpdate(userId, { cartData: {} });

      return res
        .status(200)
        .json({ success: true, message: "Payment successful" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      return res
        .status(200)
        .json({ success: false, message: "Payment failed" });
    }
  } catch (error) {
    console.error("Error in verifyStripe:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

/**
 * Place an order via Razorpay
 */
/**
 * Place an order via Razorpay
 */
const placeOrderRazorpay = async (req, res) => {
  try {
    const userId = req.userId;
    const { items, address, amount } = req.body;

    if (!items?.length || !amount || !address)
      return res
        .status(400)
        .json({ success: false, message: "Invalid order data" });

    // Step 1: Create order in DB first
    const newOrder = await orderModel.create({
      userId,
      items,
      amount,
      address,
      status: "Order Placed",
      paymentMethod: "Razorpay",
      payment: false,
      date: Date.now(),
    });

    // Step 2: Create Razorpay order
    const options = {
      amount: amount * 100, // paise
      currency: "INR",
      receipt: newOrder._id.toString(), // map Razorpay order to DB order
    };

    const razorpayOrder = await razorpayInstance.orders.create(options);

    res.status(200).json({
      success: true,
      order: razorpayOrder,
      orderId: newOrder._id,
      key: process.env.RAZORPAY_KEY_ID, // send Key ID to frontend
    });
  } catch (error) {
    console.error("Error in placeOrderRazorpay:", error);
    res.status(500).json({
      success: false,
      message: "Razorpay error",
      error: error.message,
    });
  }
};

/**
 * Verify Razorpay Payment
 */

const verifyRazorpay = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;
    // console.log(razorpay_order_id,razorpay_payment_id,razorpay_signature,orderId)
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature)
      return res
        .status(400)
        .json({ success: false, message: "Invalid Razorpay response" });

    // Step 1: Verify signature
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature !== razorpay_signature) {
      await orderModel.findByIdAndDelete(orderId); // delete failed order
      return res
        .status(400)
        .json({ success: false, message: "Payment verification failed" });
    }

    // Step 2: Mark order as paid
    await orderModel.findByIdAndUpdate(orderId, { payment: true });
    await User.findByIdAndUpdate(req.userId, { cartData: {} });

    res
      .status(200)
      .json({ success: true, message: "Payment verified successfully" });
  } catch (error) {
    console.error("Error in verifyRazorpay:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export {
  placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  getAllOrders,
  getUserOrders,
  updateOrderStatus,
  verifyStripe,
  verifyRazorpay,
};
