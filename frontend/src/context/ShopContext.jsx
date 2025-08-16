import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { backendUrl } from "../../config.js";
import axios from "axios";
import { toast } from "react-toastify";

export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
  const currency = "$";
  const delivery_fee = 10;

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const navigate = useNavigate();

  // Add to cart
const addToCart = async (itemId, size) => {
  const latestToken = localStorage.getItem("token");
  if (!latestToken) {
    toast.info("Please login or signup to continue");
    navigate("/login");
    return;
  }

  try {
    const response = await axios.post(
      `${backendUrl}/api/cart/add`,
      { itemId, size },
      { headers: { Authorization: `Bearer ${latestToken}` } }
    );

    // Use server response to update local state
    setCartItems(response.data.cartData); 
    toast.success("Item added to cart");
    console.log("Updated cart data from DB:", response.data.cartData);

  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.message || "Error adding item to cart");
  }
};


  // Update cart quantity
  const updateQuantity = async (itemId, size, quantity) => {
    const latestToken = localStorage.getItem("token");
    if (!latestToken) {
      toast.info("Please login or signup to continue");
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        `${backendUrl}/api/cart/update`,
        { itemId, size, quantity },
        { headers: { Authorization: `Bearer ${latestToken}` } }
      );

      const cartData = structuredClone(cartItems);
      if (quantity <= 0) {
        delete cartData[itemId][size];
        if (Object.keys(cartData[itemId]).length === 0) delete cartData[itemId];
      } else {
        if (!cartData[itemId]) cartData[itemId] = {};
        cartData[itemId][size] = quantity;
      }

      setCartItems(cartData);
      toast.success("Cart updated successfully");
      console.log("Updated cart data:", cartData);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error updating cart");
    }
  };

  // Get total cart count
  const getCartCount = () => {
    let totalCount = 0;
    for (const itemId in cartItems) {
      for (const size in cartItems[itemId]) {
        totalCount += cartItems[itemId][size];
      }
    }
    return totalCount;
  };

  // Get total cart amount
  const getCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      const product = products.find((p) => p._id === itemId);
      if (!product) continue;

      for (const size in cartItems[itemId]) {
        totalAmount += product.price * cartItems[itemId][size];
      }
    }
    return totalAmount;
  };

  // Fetch products
  const getProductsData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/products/list`);
      if (response.data.success) {
        // console.log("Fetched products:", response.data.products);
        setProducts(response.data.products);
      } else toast.error(response.data.message || "Failed to fetch products");
    } catch (error) {
      toast.error(error.message || "Error fetching products");
    }
  };

  const getUserCart = async () => {
  try {
    const response = await axios.post(
      `${backendUrl}/api/cart/get`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    // Use the correct key from backend response
    setCartItems(response.data.cartData);
  } catch (error) {
    console.error("Error fetching cart:", error);
  }
};


  useEffect(() => {
    getProductsData();
  }, []);

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
    if (token) getUserCart();
  }, [token]);

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    setCartItems,
    addToCart,
    updateQuantity,
    getCartCount,
    getCartAmount,
    navigate,
    token,
    setToken,
    getUserCart,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export default ShopContextProvider;
