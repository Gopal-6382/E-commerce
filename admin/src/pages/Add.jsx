import { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../config";
import { toast } from "react-toastify";

const Add = () => {
  const [images, setImages] = useState([null, null, null, null]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [sizes, setSizes] = useState([]);
  const [bestSeller, setBestSeller] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Handle image selection
  const handleImageChange = (index, file) => {
    const updatedImages = [...images];
    updatedImages[index] = file;
    setImages(updatedImages);
  };

  // ✅ Toggle selected size
  const toggleSize = (size) => {
    setSizes((prev) =>
      prev.includes(size)
        ? prev.filter((s) => s !== size)
        : [...prev, size]
    );
  };

  // ✅ Handle Form Submit
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
      formData.append("bestseller", bestSeller);
      formData.append("sizes", JSON.stringify(sizes));

      images.forEach((image, i) => {
        if (image) formData.append(`image${i + 1}`, image);
      });

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

      console.log("✅ Product added:", response.data);
      toast.success("✅ Product added successfully!");

      // Reset form
      setImages([null, null, null, null]);
      setName("");
      setDescription("");
      setPrice("");
      setCategory("Men");
      setSubCategory("Topwear");
      setSizes([]);
      setBestSeller(false);
    } catch (error) {
      console.error("❌ Error adding product:", error.response?.data || error.message);
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
          {images.map((image, index) => (
            <label key={index} htmlFor={`image${index}`}>
              <img
                className="w-20"
                src={image ? URL.createObjectURL(image) : assets.upload_area}
                alt=""
              />
              <input
                type="file"
                id={`image${index}`}
                hidden
                onChange={(e) => handleImageChange(index, e.target.files[0])}
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
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className="w-full h-20 max-w-[500px] px-3 py-2"
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
            <p
              key={size}
              onClick={() => toggleSize(size)}
              className={`px-3 py-1 cursor-pointer ${
                sizes.includes(size)
                  ? "bg-gray-600 text-white"
                  : "bg-slate-200"
              }`}
            >
              {size}
            </p>
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
