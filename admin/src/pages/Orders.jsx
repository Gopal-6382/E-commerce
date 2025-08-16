import { useEffect, useState, useCallback } from "react";
import { backendUrl, currency } from "../config";
import axios from "axios";
import { toast } from "react-toastify";

const AdminOrders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all orders
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/order/list`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) setOrders(data.orders);
      else toast.error(data.message || "Failed to fetch orders");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchOrders();
  }, [fetchOrders, token]);

  // Update order status
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/order/status`,
        { orderId, status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
        toast.success("Order status updated!");
      } else {
        toast.error(data.message || "Failed to update status");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  if (loading) return <p className="text-gray-500 p-4">Loading orders...</p>;
  if (orders.length === 0)
    return <p className="text-gray-500 p-4">No orders found.</p>;

  return (
    <div className="space-y-4 p-4">
      {orders.map((order) => (
        <div
          key={order._id}
          className="border rounded-lg p-4 shadow hover:shadow-lg transition"
        >
          <div className="mb-2">
            <p className="font-semibold">
              {order.address.firstName} {order.address.lastName}
            </p>
            <p className="text-sm text-gray-500">{order.address.email}</p>
          </div>

          <div className="mb-2">
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 border rounded p-2 mb-1"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded"
                />
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-gray-500">
                    Size: {item.size} | Qty: {item.quantity}
                  </p>
                  <p className="text-xs font-semibold">
                    {currency}
                    {item.price}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mb-2">
            <p className="font-semibold">
              Total Amount: {currency}
              {order.amount}
            </p>
            <p className="text-sm text-gray-500">
              Date: {new Date(order.date).toLocaleDateString()}
            </p>
          </div>

          <div className="mb-2">
            <p className="text-sm">
              Payment: {order.paymentMethod} -{" "}
              <span
                className={order.payment ? "text-green-600" : "text-red-600"}
              >
                {order.payment ? "Paid" : "Pending"}
              </span>
            </p>
          </div>

          {/* Admin Status Update */}
          <div>
            <select
              value={order.status}
              onChange={(e) => handleStatusChange(order._id, e.target.value)}
              className="border rounded px-2 py-1 text-sm w-full"
            >
              <option value="Order Placed">Order Placed</option>
              <option value="Packaging">Packaging</option>
              <option value="Shipped">Shipped</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminOrders;
