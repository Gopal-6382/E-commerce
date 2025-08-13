import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";
import Title from "../components/Title";
import { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";

const PlaceOrder = () => {
  const [method, setMethod] = useState("cod");
  const { navigate } = useContext(ShopContext);
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h[80vh] border-t">
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl font-semibold my-3">
          <Title text1={"Delivery"} text2={"Information"} />
        </div>
        <div className="flex gap-3  ">
          <input
            type="text"
            placeholder="First name"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full "
          />
          <input
            type="email"
            placeholder="Last name"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full "
          />
        </div>

        <input
          type="text"
          placeholder="Email Address"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full "
        />

        <input
          type="text"
          placeholder="Street Address"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full "
        />
        <div className="flex gap-3  ">
          <input
            type="text"
            placeholder="City"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full "
          />
          <input
            type="email"
            placeholder="State"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full "
          />
        </div>
        <div className="flex gap-3  ">
          <input
            type="Number"
            placeholder="Zip Code"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full "
          />
          <input
            type="text"
            placeholder="Country"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full "
          />
        </div>
        <input
          type="number"
          placeholder="Phone"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full "
        />
      </div>
      <div className="mt-8">
        <div className="mt-8 min-w-80">
          <CartTotal />
        </div>

        <div className="mt-12">
          <Title text1="Payment" text2="Method" />

          {/* Payment Methods */}
          <div className="flex gap-3 flex-col lg:flex-row">
            {/* Stripe */}
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

            {/* Razorpay */}
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

            {/* Cash on Delivery */}
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
            onClick={() => {
              // Handle place order logic
              navigate("/orders");
            }}
            className="bg-black text-white px-16 py-3 rounded">
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
