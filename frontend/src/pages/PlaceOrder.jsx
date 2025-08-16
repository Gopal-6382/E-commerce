import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";
import Title from "../components/Title";
import { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { backendUrl } from "./../../config";
import { toast } from "react-toastify";
import axios from "axios";

const PlaceOrder = () => {
  const [method, setMethod] = useState("cod");
  const {
    navigate,
    token,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products,
    cartItems,
  } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      let orderItems = [];

      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(
              products.find((product) => product._id === items)
            );
            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount(),
      };

      switch (method) {
        case "cod": {
          const response = await axios.post(
            `${backendUrl}/api/order/place`,
            orderData,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (response.data.success) {
            toast.success(response.data.message);
            setCartItems({});
            navigate("/orders");
          }
          break;
        }

        case "stripe": {
          const stripeResponse = await axios.post(
            `${backendUrl}/api/order/stripe`,
            orderData,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (stripeResponse.data.success) {
            const { url } = stripeResponse.data;
            window.location.href = url; // redirect to Stripe checkout
          }
          break;
        }

        case "razorpay": {
          const razorpayResponse = await axios.post(
            `${backendUrl}/api/order/razorpay`,
            orderData,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (!razorpayResponse.data.success) {
            return toast.error("Failed to create Razorpay order");
          }

          const { order, orderId, key } = razorpayResponse.data;

          const options = {
            key: key,
            amount: order.amount,
            currency: order.currency,
            name: "My Shop",
            description: "Order Payment",
            order_id: order.id,
            handler: async function (response) {
              try {
                const verifyRes = await axios.post(
                  `${backendUrl}/api/order/verifyrazorpay`,
                  {
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    orderId: orderId,
                  },
                  { headers: { Authorization: `Bearer ${token}` } }
                );

                if (verifyRes.data.success) {
                  toast.success("Payment Successful");
                  setCartItems({});
                  navigate("/orders");
                } else {
                  toast.error("Payment failed");
                  navigate("/cart");
                }
              } catch (error) {
                console.error("Error verifying payment:", error);
                toast.error("Error verifying Razorpay payment");
              }
            },
            prefill: {
              name: formData.fullName || "Customer",
              email: formData.email || "customer@example.com",
              contact: formData.phone || "9999999999",
            },
            theme: { color: "#3399cc" },
          };

          const rzp = new window.Razorpay(options);
          rzp.open();
          break;
        }
      }
    } catch (error) {
      console.error(error.message);
      toast.error("Something went wrong!");
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h[80vh] border-t"
    >
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl font-semibold my-3">
          <Title text1={"Delivery"} text2={"Information"} />
        </div>
        <div className="flex gap-3">
          <input
            required
            type="text"
            onChange={onChangeHandler}
            name="firstName"
            value={formData.firstName}
            placeholder="First name"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
          <input
            required
            onChange={onChangeHandler}
            name="lastName"
            value={formData.lastName}
            type="text"
            placeholder="Last name"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
        </div>

        <input
          required
          onChange={onChangeHandler}
          name="email"
          value={formData.email}
          type="email"
          placeholder="Email Address"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
        />

        <input
          required
          onChange={onChangeHandler}
          name="street"
          value={formData.street}
          type="text"
          placeholder="Street Address"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
        />

        <div className="flex gap-3">
          <input
            required
            onChange={onChangeHandler}
            name="city"
            value={formData.city}
            type="text"
            placeholder="City"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
          <input
            required
            onChange={onChangeHandler}
            name="state"
            value={formData.state}
            type="text"
            placeholder="State"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
        </div>

        <div className="flex gap-3">
          <input
            required
            onChange={onChangeHandler}
            name="zipcode"
            value={formData.zipcode}
            type="number"
            placeholder="Zip Code"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
          <input
            required
            onChange={onChangeHandler}
            name="country"
            value={formData.country}
            type="text"
            placeholder="Country"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
        </div>

        <input
          required
          onChange={onChangeHandler}
          name="phone"
          value={formData.phone}
          type="number"
          placeholder="Phone"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
        />
      </div>

      <div className="mt-8">
        <div className="mt-8 min-w-80">
          <CartTotal />
        </div>

        <div className="mt-12">
          <Title text1="Payment" text2="Method" />

          <div className="flex gap-3 flex-col lg:flex-row">
            <div
              onClick={() => setMethod("stripe")}
              className="flex items-center gap-3 border p-2 cursor-pointer"
            >
              <p
                className={`w-3.5 h-3.5 border rounded-full ${
                  method === "stripe" ? "bg-green-400" : "bg-transparent"
                }`}
              ></p>
              <img className="h-5 mx-4" src={assets.stripe_logo} alt="Stripe" />
            </div>

            <div
              onClick={() => setMethod("razorpay")}
              className="flex items-center gap-3 border p-2 cursor-pointer"
            >
              <p
                className={`w-3.5 h-3.5 border rounded-full ${
                  method === "razorpay" ? "bg-green-400" : "bg-transparent"
                }`}
              ></p>
              <img
                className="h-5 mx-4"
                src={assets.razorpay_logo}
                alt="Razorpay"
              />
            </div>

            <div
              onClick={() => setMethod("cod")}
              className="flex items-center gap-3 border p-2 cursor-pointer"
            >
              <p
                className={`w-3.5 h-3.5 border rounded-full ${
                  method === "cod" ? "bg-green-400" : "bg-transparent"
                }`}
              ></p>
              <p className="text-gray-500 text-sm font-medium mx-4">
                Cash On Delivery
              </p>
            </div>
          </div>

          <div className="w-full text-end mt-8">
            <button
              type="submit"
              className="bg-black text-white px-16 py-3 rounded"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
