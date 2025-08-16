import User from "../models/userModel.js";

const addToCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { itemId, size } = req.body;

    if (!itemId || !size) {
      return res.status(400).json({ success: false, message: "Item and size are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!user.cartData) user.cartData = {};
    if (!user.cartData[itemId]) user.cartData[itemId] = {};
    if (!user.cartData[itemId][size]) user.cartData[itemId][size] = 0;

    user.cartData[itemId][size] += 1;

    // 👇 Tell Mongoose the nested object changed
    user.markModified("cartData");

    await user.save();

    res.json({
      success: true,
      message: "Item added to cart",
      cartData: user.cartData,
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// Update cart quantity
const updateCart = async (req, res) => {
  try {
    const { itemId, size, quantity } = req.body;
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    if (quantity <= 0) {
      if (user.cartData[itemId]) {
        delete user.cartData[itemId][size];
        if (Object.keys(user.cartData[itemId]).length === 0)
          delete user.cartData[itemId];
      }
    } else {
      if (!user.cartData[itemId]) user.cartData[itemId] = {};
      user.cartData[itemId][size] = quantity;
    }

    await user.updateOne({ cartData: user.cartData });

    res.json({ success: true, message: "Cart updated successfully" });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get user cart
const getUserCart = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res.json({ success: true, cartData: user.cartData });
  } catch (error) {
    console.error("Error getting user cart:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export { addToCart, updateCart, getUserCart };
