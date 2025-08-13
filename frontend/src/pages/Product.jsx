import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";
import { toast } from "react-toastify";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);

  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");

  const fetchProductData = () => {
    products.forEach((item) => {
      if (String(item._id) === String(productId)) {
        setProductData(item);
        setImage(item.image[0]);
      }
    });
  };

  useEffect(() => {
    if (products && products.length > 0) {
      fetchProductData();
    }
  }, [productId, products]);

  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/* Row: Thumbnails + Main Image + Details */}
      <div className="flex gap-12 sm:flex-row flex-col">
        {/* Thumbnail column */}
        <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[11.8%] w-full">
          {productData.image.map((img, index) => (
            <img
              key={index}
              src={img}
              onClick={() => setImage(img)}
              alt={productData.name}
              className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
            />
          ))}
        </div>

        {/* Main Image */}
        <div className="sm:w-[50%] w-full">
          <img src={image} alt={productData.name} className="w-full h-auto" />
        </div>

        {/* Product Details */}
        <div className="sm:w-[30%] w-full flex flex-col">
          <h1 className="text-2xl mt-2 font-medium">{productData.name}</h1>

          {/* Stars */}
          <div className="flex items-center mt-2">
            <img src={assets.star_icon} alt="" className="w-3" />
            <img src={assets.star_icon} alt="" className="w-3" />
            <img src={assets.star_icon} alt="" className="w-3" />
            <img src={assets.star_icon} alt="" className="w-3" />
            <img src={assets.star_dull_icon} alt="" className="w-3" />
            <p className="pl-2 text-sm text-gray-500">(122)</p>
          </div>

          {/* Price */}
          <p className="mt-5 text-3xl font-medium">
            {currency} {productData.price}
          </p>

          {/* Description */}
          <p className="mt-5 text-gray-500">{productData.description}</p>
          <div className="flex flex-col gap-4 my-8">
            <p>Select Size</p>
            <div className="flex gap-2">
              {productData.sizes.map((item, index) => (
                <button
                  onClick={() => {
                    setSize(item);
                    console.log("Selected size:", item);
                  }}
                  key={index}
                  className={`border bg-gray-100 py-2 px-4 ${
                    size === item ? "border-orange-500" : ""
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Add to Cart */}
          <button
            onClick={() => {
              if (!size) {
                toast.error("Please select a size before adding to cart");
                return;
              }
              addToCart(productData._id, size);
            }}
            className="bg-black text-white py-3 px-8 text-sm active:bg-gray-700"
          >
            Add to Cart
          </button>

          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1 ">
            <p>100% Original Product</p>
            <p>Cash On Delivery is available on this product</p>
            <p>30-Day Return Policy</p>
          </div>
        </div>
      </div>
      {/* Description & Review */}
      <div className="mt-20">
        <div className="flex">
          <b className="border px-5 py-3 text-sm">Description</b>

          <p className="border px-5 py-3 text-sm">Reviews (122)</p>
        </div>
        <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Officia
            mollitia quasi et ipsum ad cum consequuntur labore aut recusandae
            quae. Magni ullam iusto neque amet illo quam recusandae doloremque
            provident.
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
            voluptatum.
          </p>
        </div>
      </div>
      {/* Related Products */}
      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </div>
  ) : (
    <div className="opacity-0">Loading...</div>
  );
};

export default Product;
