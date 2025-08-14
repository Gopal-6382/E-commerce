import { useEffect, useState, useContext } from "react";
import { products } from "../assets/assets";
import Title from "../components/Title";
import { ShopContext } from "../context/ShopContext";
import { assets } from "./../assets/assets";
import CartTotal from "../components/CartTotal";

const Card = () => {
  const { products, currency, cartItems, updateQuantity, navigate } =
    useContext(ShopContext);

  const [cartData, setCartData] = useState([]);
  useEffect(() => {
    const tempData = [];
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          tempData.push({
            _id: items,
            size: item,
            quantity: cartItems[items][item],
          });
        }
      }
    }
    // console.log("Cart Data:", tempData);
    setCartData(tempData);
  }, [cartItems]);
  return (
    <div className="border-t pt-14">
      <div className="text-2xl mb-3">
        <Title text1={"Your "} text2={"Cart"} />
      </div>
      <div>
        {cartData.map((item) => {
          const productData = products.find(
            (product) => product._id === item._id
          );
          return (
            <div
              key={`${item._id}-${item.size}`} // unique key here
              className="bg-white rounded-lg shadow p-4 mb-4"
            >
              <div className="flex items-center justify-between gap-4 border-b py-4">
                {/* Left: Image + Name */}
                <div className="flex items-center gap-3 flex-1">
                  <img
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded"
                    src={productData.image[0]}
                    alt={productData.name}
                  />
                  <div>
                    <p className="text-sm sm:text-lg font-semibold">
                      {productData.name}
                    </p>
                    <p className="text-xs text-gray-500">Size: {item.size}</p>
                  </div>
                </div>

                {/* Middle: Quantity selector */}
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    className="border rounded w-12 sm:w-16 px-2 py-1 text-center"
                    min={1}
                    onChange={(e) =>
                      e.target.value === "" || e.target.value === "0"
                        ? null
                        : updateQuantity(
                            item._id,
                            item.size,
                            Number(e.target.value)
                          )
                    }
                    defaultValue={item.quantity}
                  />
                </div>

                {/* Price */}
                <div className="text-sm sm:text-base font-medium whitespace-nowrap">
                  {currency}
                  {item.quantity}
                </div>

                {/* Delete button */}
                <img
                  src={assets.bin_icon}
                  alt="Remove"
                  className="w-5 h-5 cursor-pointer hover:opacity-70"
                  onClick={() => updateQuantity(item._id, item.size, 0)}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-end my-20">
        <div className="w-full sm:w-[450px]">
          <CartTotal />
          <div className="w-full text-end">
            <button
              onClick={() => navigate("/place-order")}
              className="bg-black text-white text-sm my-8 py-3 px-8 rounded"
            >
              Process to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
