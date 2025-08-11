import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";

const Orders = () => {
  const { products, currency } = useContext(ShopContext);
  return (
    <div className="border-t pt-16">
      <div className="text-2xl">
        <Title text1="My" text2="Orders" />
      </div>
      <div>
        {products.slice(1, 4).map((item, index) => (
          <div
            key={index}
            className="border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-4 py-4"
          >
            <div className="flex items-start gap-6 text-sm ">
              <img src={item.image} alt={item.name} className="w-16 sm:w-20" />
            </div>
            <p className="sm:text-base font-medium">{item.name}</p>
            <div className="flex items-center gap-3 mt-2 text-base text-gray-700">
              <p>
                {currency}
                {item.price}
              </p>
              <p>Quantity : 1 </p>
              <p>Size : M</p>
            </div>
            <p className="mt-2">
              Date: <span className="text-gray-400">2023-10-01</span>{" "}
            </p>
            <div className="md:w-1/2 flex justify-between">
              <div className="flex items-center gap-2">
                <p className="min-w-2 h-2 rounded-full bg-green-500"></p>
                <p className="text-sm md:text-base">Ready To Ship </p>
              </div>
              <button className="text-sm border bg-black px-4 p-2 font-medium rounded-sm text-white hover:underline">
                Track Order
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
