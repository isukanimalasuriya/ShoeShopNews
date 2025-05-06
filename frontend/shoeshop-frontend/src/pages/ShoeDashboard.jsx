import { useState, useEffect } from "react";
import axios from "axios";
import {
  FiPackage,
  FiDollarSign,
  FiAlertTriangle,
  FiLoader,
  FiAlertCircle,
} from "react-icons/fi";
import StockChart from "../components/inventory/StockChart";
import { useNavigate } from "react-router-dom";

const ShoeDashboard = () => {
  const [stats, setStats] = useState({
    totalStock: 0,
    totalValue: 0,
    lowStockItems: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/employeelogin'); // Redirect if no token found
    }
  }, [navigate]);

  useEffect(() => {
    const fetchInventoryStats = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/shoes");
        const shoes = response.data;

        const flattenedItems = shoes.flatMap((shoe) =>
          shoe.variants.flatMap((variant) =>
            variant.sizes.map((size) => ({
              brand: shoe.brand,
              model: shoe.model,
              color: variant.color,
              size: size.size,
              stock: size.stock,
              price: shoe.price,
            }))
          )
        );

        const totalStock = flattenedItems.reduce(
          (sum, item) => sum + (parseInt(item.stock, 10) || 0),
          0
        );
        const totalValue = flattenedItems.reduce(
          (sum, item) => sum + item.price * (parseInt(item.stock, 10) || 0),
          0
        );
        const lowStockItems = flattenedItems.filter(
          (item) => (parseInt(item.stock, 10) || 0) < 10
        );

        setStats({ totalStock, totalValue, lowStockItems });
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch inventory stats");
        setLoading(false);
      }
    };
    fetchInventoryStats();
  }, []);

  if (loading)
    return (
      <div className="ml-64 p-8 flex items-center justify-center h-screen">
        <div className="flex flex-col items-center">
          <FiLoader className="animate-spin text-4xl text-indigo-600 mb-4" />
          <p className="text-gray-600">Loading inventory data...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="ml-64 p-8 flex items-center justify-center h-screen">
        <div className="flex flex-col items-center text-red-500">
          <FiAlertCircle className="text-4xl mb-4" />
          <p className="text-xl">{error}</p>
        </div>
      </div>
    );

  return (
    <div className="ml-64 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Shoe Inventory Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4">
              <FiPackage size={24} />
            </div>
            <div>
              <h3 className="text-gray-500 text-sm font-medium">
                Total Shoes in Stock
              </h3>
              <p className="text-2xl font-bold text-gray-800">
                {stats.totalStock}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <FiDollarSign size={24} />
            </div>
            <div>
              <h3 className="text-gray-500 text-sm font-medium">
                Total Inventory Value
              </h3>
              <p className="text-2xl font-bold text-gray-800">
                LKR {stats.totalValue.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <FiAlertTriangle size={24} />
            </div>
            <div>
              <h3 className="text-gray-500 text-sm font-medium">
                Low Stock Items
              </h3>
              <p className="text-2xl font-bold text-gray-800">
                {stats.lowStockItems.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stock Chart */}
      <StockChart />

      {/* Low Stock Items Table */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <FiAlertTriangle className="mr-2 text-yellow-500" />
          Low Stock Items (Below 10)
        </h2>
        {stats.lowStockItems.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Brand
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Model
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Color
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.lowStockItems.map((item, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.brand}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.model}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.color}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.size}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                      {item.stock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      LKR{(item.price * item.stock).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No low stock items. Great job!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoeDashboard;
