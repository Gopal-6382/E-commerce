import { useEffect, useState, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";
import { backendUrl } from "../../config";
import { toast } from "react-toastify";

const Orders = () => {
  const { currency, token } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.post(
          `${backendUrl}/api/order/userorders`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data.success) {
          setOrders(res.data.orders);
        } else {
          toast.error(res.data.message || "Failed to fetch orders");
        }
      } catch (err) {
        toast.error(err.message || "Error fetching orders");
      }
    };

    if (token) fetchOrders();
  }, [token]);

  // ✅ Optional: refresh order status when clicking "Track Order"
  const handleTrackOrder = async () => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/order/userorders`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setOrders(res.data.orders);
        toast.info("Orders refreshed!");
      }
    } catch (err) {
      toast.error(err.message || "Error refreshing orders");
    }
  };

  return (
    <div className="border-t pt-16">
      <div className="text-2xl">
        <Title text1="My" text2="Orders" />
      </div>
      <div>
       {orders.map((order, orderIndex) =>
  order.items.map((item, itemIndex) => (
    <div
      key={`${orderIndex}-${itemIndex}`}
      className="border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-4 py-4"
    >
      {/* Product Image */}
      <div className="flex items-start gap-6 text-sm">
        <img
          src={item.image}
          alt={item.name}
          className="w-16 sm:w-20 object-cover"
        />
      </div>

      {/* Product Name */}
      <p className="sm:text-base font-medium">{item.name}</p>

      {/* Price / Quantity / Size */}
      <div className="flex items-center gap-3 mt-2 text-base text-gray-700">
        <p>
          {currency}
          {item.price}
        </p>
        <p>Quantity: {item.quantity}</p>
        <p>Size: {item.size}</p>
      </div>

      {/* Order Date */}
      <p className="mt-2">
        Date:{" "}
        <span className="text-gray-400">
          {new Date(order.date).toLocaleDateString()}
        </span>
      </p>

      {/* Payment Method */}
      <p className="mt-2">
        Payment:{" "}
        <span className="text-gray-400">
          {order.paymentMethod} {order.payment ? "(Paid)" : "(Pending)"}
        </span>
      </p>

      {/* Status + Track Button */}
      <div className="md:w-1/2 flex justify-between">
        <div className="flex items-center gap-2">
          <p
            className={`min-w-2 h-2 rounded-full ${
              order.status === "Order Placed"
                ? "bg-yellow-500"
                : order.status === "Shipped"
                ? "bg-blue-500"
                : order.status === "Delivered"
                ? "bg-green-500"
                : "bg-gray-400"
            }`}
          ></p>
          <p className="text-sm md:text-base">{order.status}</p>
        </div>
        <button
          type="button"
          onClick={handleTrackOrder}
          className="text-sm border bg-black px-4 p-2 font-medium rounded-sm text-white hover:underline"
        >
          Track Order
        </button>
      </div>
    </div>
  ))
)}

      </div>
    </div>
  );
};

export default Orders;
