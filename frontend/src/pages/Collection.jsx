import { useContext, useEffect, useState } from "react";
import { ShopContext } from "./../context/ShopContext";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

const Collection = () => {
  const { products, search } = useContext(ShopContext);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [showFilters, setShowFilters] = useState(false);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relevant");

  const toggleCategory = (e) => {
    setCategory((prev) =>
      prev.includes(e.target.value)
        ? prev.filter((item) => item !== e.target.value)
        : [...prev, e.target.value]
    );
  };

  const toggleSubCategory = (e) => {
    setSubCategory((prev) =>
      prev.includes(e.target.value)
        ? prev.filter((item) => item !== e.target.value)
        : [...prev, e.target.value]
    );
  };

  const applyFilters = () => {
    let filtered = products;

    // ----------- BEST SEARCH FUNCTION -----------
    if (search.trim() !== "") {
      const query = search.toLowerCase().trim();

      filtered = filtered
        .map((product) => {
          let score = 0;

          // Exact or strong matches in name get higher score
          if (product.name?.toLowerCase().includes(query)) score += 3;

          // Matches in description
          if (product.description?.toLowerCase().includes(query)) score += 2;

          // Matches in category or subcategory
          if (product.category?.toLowerCase().includes(query)) score += 1;
          if (product.subCategory?.toLowerCase().includes(query)) score += 1;

          // Matches in sizes
          if (product.sizes?.some((size) => size.toLowerCase() === query))
            score += 1;

          return { ...product, score };
        })
        .filter((p) => p.score > 0) // only keep relevant matches
        .sort((a, b) => b.score - a.score); // higher score first
    }

    // ----------- CATEGORY FILTER -----------
    if (category.length > 0) {
      filtered = filtered.filter((product) =>
        category.includes(product.category)
      );
    }

    // ----------- SUBCATEGORY FILTER -----------
    if (subCategory.length > 0) {
      filtered = filtered.filter((product) =>
        subCategory.includes(product.subCategory)
      );
    }

    // ----------- SORTING -----------
    if (sortType === "low-to-high") {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sortType === "high-to-low") {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [products, search, category, subCategory, sortType, search]);

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      {/* Sidebar Filters */}
      <div className="min-w-60">
        <p
          onClick={() => setShowFilters(!showFilters)}
          className="my-2 text-xl flex items-center cursor-pointer gap-2"
        >
          Filters
          <img
            className={`h-3 sm:hidden ${showFilters ? "rotate-90" : ""}`}
            src={assets.dropdown_icon}
            alt=""
          />
        </p>

        {/* Category */}
        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 ${
            showFilters ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">Categories</p>
          {["Men", "Women", "Kids"].map((cat) => (
            <label key={cat} className="flex gap-2">
              <input
                type="checkbox"
                className="w-3"
                value={cat}
                onChange={toggleCategory}
              />
              <span>{cat}</span>
            </label>
          ))}
        </div>

        {/* Types */}
        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 ${
            showFilters ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">Types</p>
          {["Topwear", "Bottomwear", "Winterwear"].map((type) => (
            <label key={type} className="flex gap-2">
              <input
                type="checkbox"
                className="w-3"
                value={type}
                onChange={toggleSubCategory}
              />
              <span>{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-4">
          <Title text1={"ALL"} text2={"COLLECTIONS"} />
          <select
            onChange={(e) => setSortType(e.target.value)}
            className="border-2 border-gray-300 text-sm px-2"
          >
            <option value="relevant">Relevance Sorting</option>
            <option value="low-to-high">Price: Low to High</option>
            <option value="high-to-low">Price: High to Low</option>
          </select>
        </div>

        {/* Products */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
            {filteredProducts.map((item, index) => (
              <ProductItem
                key={index}
                name={item.name}
                id={item._id}
                price={item.price}
                image={item.image}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-10">No products found.</p>
        )}
      </div>
    </div>
  );
};

export default Collection;
