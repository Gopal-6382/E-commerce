import { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../config.js";
import { toast } from "react-toastify"; // add this import at the top

// ✅ Use only one backend URL source
// const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Add = () => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [sizes, setSizes] = useState([]);
  const [bestSeller, setBestSeller] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestSeller", bestSeller);
      formData.append("sizes", JSON.stringify(sizes));

      if (image1) formData.append("image1", image1);
      if (image2) formData.append("image2", image2);
      if (image3) formData.append("image3", image3);
      if (image4) formData.append("image4", image4);

      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${backendUrl}/api/products/add`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Product added:", response.data);
      toast.success("✅ Product added successfully!");

      // Reset form fields
      setImage1(false);
      setImage2(false);
      setImage3(false);
      setImage4(false);
      setName("");
      setDescription("");
      setPrice("");
      setCategory("Men");
      setSubCategory("Topwear");
      setSizes([]);
      setBestSeller(false);
    } catch (error) {
      console.error(
        "Error adding product:",
        error.response?.data || error.message
      );
      toast.error("❌ Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col gap-3 w-full items-start"
    >
      {/* IMAGE UPLOADS */}
      <div>
        <p className="mb-2">Upload image</p>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((num) => (
            <label key={num} htmlFor={`image${num}`}>
              <img
                className="w-20"
                src={
                  !eval(`image${num}`)
                    ? assets.upload_area
                    : URL.createObjectURL(eval(`image${num}`))
                }
                alt=""
              />
              <input
                onChange={(e) => eval(`setImage${num}(e.target.files[0])`)}
                type="file"
                id={`image${num}`}
                hidden
              />
            </label>
          ))}
        </div>
      </div>

      {/* NAME */}
      <div className="w-full">
        <p className="mb-2">Product Name</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="w-full max-w-[500px] px-3 py-2"
          type="text"
          placeholder="Give Product Name"
          required
        />
      </div>

      {/* DESCRIPTION */}
      <div className="w-full">
        <p className="mb-2">Product Description</p>
        <input
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className="w-full h-20 max-w-[500px] px-3 py-2"
          type="text"
          placeholder="Write Content Here"
          required
        />
      </div>

      {/* CATEGORY, SUBCATEGORY, PRICE */}
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div>
          <p className="mb-2">Product Category</p>
          <select
            onChange={(e) => setCategory(e.target.value)}
            value={category}
            className="w-full px-3 py-2"
          >
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>
        <div>
          <p className="mb-2">Product SubCategory</p>
          <select
            onChange={(e) => setSubCategory(e.target.value)}
            value={subCategory}
            className="w-full px-3 py-2"
          >
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Winterwear">Winterwear</option>
          </select>
        </div>
        <div>
          <p className="mb-2">Product Price</p>
          <input
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            className="w-full px-3 py-2 sm:w-[120px]"
            placeholder="$25"
            type="number"
            required
          />
        </div>
      </div>

      {/* SIZES */}
      <div>
        <p className="mb-2">Product Size</p>
        <div className="flex gap-3">
          {["S", "M", "L", "XL", "XXL"].map((size) => (
            <div
              key={size}
              onClick={() =>
                setSizes((prev) =>
                  prev.includes(size)
                    ? prev.filter((item) => item !== size)
                    : [...prev, size]
                )
              }
            >
              <p
                className={`sizes ${
                  sizes.includes(size)
                    ? "bg-gray-600 text-white"
                    : "bg-slate-200"
                } px-3 py-1 cursor-pointer`}
              >
                {size}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* BEST SELLER */}
      <div className="flex gap-2 mt-2">
        <input
          type="checkbox"
          id="bestseller"
          onChange={() => setBestSeller((prev) => !prev)}
          checked={bestSeller}
        />
        <label htmlFor="bestseller" className="cursor-pointer">
          Add to Best Seller
        </label>
      </div>

      {/* SUBMIT */}
      <button
        type="submit"
        className="bg-gray-600 text-white px-5 py-2 sm:px-7 rounded-full sm:text-sm"
        disabled={loading}
      >
        {loading ? "Adding..." : "Submit"}
      </button>
    </form>
  );
};

export default Add;
