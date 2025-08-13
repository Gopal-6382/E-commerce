import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { backendUrl } from "../config";
import { toast } from "react-toastify";
import { Loader2, Trash2, Edit3, Search } from "lucide-react";

const List = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // Fetch products
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/products/list`);
      if (data.success) {
        setProducts(data.products || []);
      } else {
        toast.error("Failed to load products");
      }
    } catch (error) {
      toast.error(`❌ Failed to load products: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.delete(`${backendUrl}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        toast.success("✅ Product deleted");
        setProducts((prev) => prev.filter((p) => p._id !== id));
      } else {
        toast.error("❌ Failed to delete");
      }
    } catch (error) {
      toast.error(`❌ Failed to delete: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filtered products
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 w-full bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">📦 Product List</h1>
        <div className="flex items-center gap-2 bg-white border rounded-lg px-3 py-2 shadow-sm w-full sm:w-80">
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search by product name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="outline-none flex-1 text-sm"
          />
        </div>
      </div>

      {/* Products */}
      {loading ? (
        <div className="flex justify-center items-center h-40 text-gray-500">
          <Loader2 className="animate-spin w-6 h-6 mr-2" /> Loading...
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          <p className="text-lg">No products found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <img
                      src={product.images?.[0] || "/placeholder.png"}
                      alt={product.name}
                      className="w-14 h-14 object-cover rounded-md"
                    />
                  </td>
                  <td className="px-4 py-3">{product.name}</td>
                  <td className="px-4 py-3">{product.category}</td>
                  <td className="px-4 py-3 font-semibold">₹{product.price}</td>
                  <td className="px-4 py-3 flex gap-3">
                    <button
                      onClick={() => navigate(`/edit-product/${product._id}`)}
                      className="flex items-center gap-1 text-blue-500 hover:text-blue-700"
                    >
                      <Edit3 size={16} /> Edit
                    </button>
                    <button
                      onClick={() => deleteProduct(product._id)}
                      className="flex items-center gap-1 text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default List;
