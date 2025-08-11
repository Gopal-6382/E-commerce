import { createContext, useEffect, useState } from "react";
import { products } from "../assets/assets";

export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
  const currency = "$";
  const delivery_fee = 10;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({}); // changed to object

  const addToCart = (itemId, size) => {
   
    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    setCartItems(cartData);
  };

  useEffect(() => {
    console.log("Cart items updated:", cartItems);
  }, [cartItems]);


  const getCartCount=()=>{
    let totalCount = 0;
    for(const items in cartItems){
      for(const size in cartItems[items]){
        try{
          if(cartItems[items][size]>0){
            totalCount += cartItems[items][size];
          }
        }catch(error){
          console.error("Error getting cart count:", error);
        }
      }
    }
    return totalCount;
  }
  const updateQuantity = (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);

    if (cartData[itemId] && cartData[itemId][size]) {
      cartData[itemId][size] = quantity;
    }

    setCartItems(cartData);
  };
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
    addToCart, // ✅ now exposed in context
    getCartCount, // Expose the function to get cart count
    updateQuantity, // Expose the function to update item quantity
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export default ShopContextProvider;
