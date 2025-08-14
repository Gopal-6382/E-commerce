import { useEffect, useState, useCallback } from "react";
import { backendUrl, currency } from "../config";
import axios from "axios";
import { toast } from "react-toastify";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch product list
  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/products/list`);
      if (data.success) {
        setList(data.products);
      } else {
        toast.error(data.message || "Failed to fetch products");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Remove product
  const removeProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const { data } = await axios.delete(`${backendUrl}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        toast.success(data.message || "Product deleted successfully");
        setList((prev) => prev.filter((item) => item._id !== id)); // Update instantly
      } else {
        toast.error(data.message || "Delete failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  // ✅ Fetch on mount
  useEffect(() => {
    fetchList();
  }, [fetchList]);

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h2 className="mb-6 text-2xl font-semibold text-gray-800">All Products</h2>

      {loading ? (
        <p className="text-gray-500">Loading products...</p>
      ) : list.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {list.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <img
                      src={product.image?.[0]}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">{product.name}</td>
                  <td className="px-4 py-3 text-gray-600">{product.category}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">
                    {currency}{product.price}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => removeProduct(product._id)}
                      className="bg-red-500 text-white px-4 py-1.5 rounded-full hover:bg-red-600 transition"
                    >
                      Delete
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
