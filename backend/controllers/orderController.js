import orderModel from "../models/orderModel.js";
import Stripe from "stripe";
import Razorpay from "razorpay";

const stripe = new Stripe("your_stripe_secret_key");
const razorpay = new Razorpay({
  key_id: "your_key_id",
  key_secret: "your_key_secret",
});

// Place a normal order
const placeOrder = async (req, res) => {
  try {
    const newOrder = new orderModel(req.body);
    await newOrder.save();
    res.status(200).json(newOrder);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Place an order via Stripe
const placeOrderStripe = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "T-shirt",
            },
            unit_amount: 2000,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
    });
    res.status(200).json(session);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Place an order via Razorpay
const placeOrderRazorpay = async (req, res) => {
  try {
    const options = {
      amount: req.body.amount * 100,
      currency: "INR",
      receipt: "order_rcptid_12",
    };
    const response = await razorpay.orders.create(options);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Get orders of a specific user
const getUserOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.params.id });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    order.status = req.body.status;
    await order.save();
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json(error);
  }
};

export {
  placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  getAllOrders,
  getUserOrders,
  updateOrderStatus,
};
