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
  const [cartItems, setCartItems] = useState({}); // Object: { productId: { size: qty } }
  const [products, setProducts] = useState([]);

  const navigate = useNavigate();

  // ✅ Add to cart
  const addToCart = (itemId, size) => {
    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = { [size]: 1 };
    }

    setCartItems(cartData);
  };

  // ✅ Update quantity
  const updateQuantity = (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);

    if (cartData[itemId] && cartData[itemId][size]) {
      cartData[itemId][size] = quantity;
    }

    setCartItems(cartData);
  };

  // ✅ Get total cart item count
  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const size in cartItems[items]) {
        if (cartItems[items][size] > 0) {
          totalCount += cartItems[items][size];
        }
      }
    }
    return totalCount;
  };

  // ✅ Get total cart amount
  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      const itemInfo = products.find((p) => p._id === items);
      if (!itemInfo) continue; // Skip if product not found

      for (const size in cartItems[items]) {
        if (cartItems[items][size] > 0) {
          totalAmount += itemInfo.price * cartItems[items][size];
        }
      }
    }
    return totalAmount;
  };

  // ✅ Fetch products from backend
  const getProductsData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/products/list`);
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message || "Failed to fetch products");
      }
    } catch (error) {
      toast.error(error.message || "Error fetching products");
    }
  };

  // ✅ Load products on mount
  useEffect(() => {
    getProductsData();
  }, []);

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
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export default ShopContextProvider;
