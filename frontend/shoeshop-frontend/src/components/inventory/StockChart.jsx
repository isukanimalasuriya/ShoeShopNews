import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";
import axios from "axios";
import { useState, useEffect } from "react";
import { FiAlertCircle, FiTrendingUp, FiInfo } from "react-icons/fi";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-xl shadow-2xl border border-gray-100">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
          <h3 className="font-semibold text-gray-800">{label}</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">Total Stock</span>
            <span className="text-lg font-semibold text-indigo-600">
              {payload[0].value.toLocaleString()}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">Variants</span>
            <span className="text-lg font-semibold text-purple-600">
              {payload[1].value}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const StockChart = () => {
  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [averageStock, setAverageStock] = useState(0);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/shoes");
        const shoes = response.data;

        // Process data for composed chart
        const dataPoints = shoes.flatMap((shoe) =>
          shoe.variants.flatMap((variant) =>
            variant.sizes.map((size) => ({
              brand: shoe.brand,
              model: shoe.model,
              size: size.size,
              stock: size.stock,
            }))
          )
        );

        const groupedData = {};
        dataPoints.forEach((point) => {
          const key = `${point.brand} ${point.model}`;
          if (!groupedData[key]) {
            groupedData[key] = {
              stock: 0,
              variants: new Set(),
            };
          }
          groupedData[key].stock += point.stock;
          groupedData[key].variants.add(point.size);
        });

        const processedData = Object.entries(groupedData).map(
          ([name, data]) => ({
            name,
            stock: data.stock,
            variants: data.variants.size,
          })
        );

        const avg =
          processedData.reduce((sum, item) => sum + item.stock, 0) /
          processedData.length;
        setAverageStock(avg);
        setChartData(processedData);

        // Process data for pie chart (by brand)
        const brandData = {};
        dataPoints.forEach((point) => {
          if (!brandData[point.brand]) {
            brandData[point.brand] = 0;
          }
          brandData[point.brand] += point.stock;
        });

        const pieChartData = Object.entries(brandData).map(([name, value]) => ({
          name,
          value,
        }));

        setPieData(pieChartData);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch inventory data");
        setLoading(false);
        console.error("API Error:", err);
      }
    };

    fetchStockData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <Skeleton width={200} height={24} />
          <Skeleton width={120} height={20} />
        </div>
        <Skeleton height={300} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex flex-col items-center justify-center h-64 text-red-500 space-y-4">
          <FiAlertCircle className="w-12 h-12" />
          <p className="font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Composed Chart (Line + Bar) */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <div className="p-2 bg-indigo-50 rounded-xl">
              <FiTrendingUp className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Inventory Overview
              </h2>
              <p className="text-sm text-gray-500">
                Stock distribution across products
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-indigo-500 rounded-full" />
              <span>Total Stock</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full" />
              <span>Variants</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-200 rounded-full" />
              <span>Average</span>
            </div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 50 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
            
            <XAxis
              dataKey="name"
              angle={0}
              textAnchor="middle"
              tick={{ fill: "#6B7280", fontSize: 12 }}
              tickLine={false}
              interval={0}
              height={80}
            />
            
            <YAxis
              yAxisId="left"
              orientation="left"
              tick={{ fill: "#6B7280", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              width={80}
              tickFormatter={(value) => value.toLocaleString()}
            />
            
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: "#6B7280", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              width={80}
            />

            <ReferenceLine
              y={averageStock}
              yAxisId="left"
              stroke="#94A3B8"
              strokeDasharray="4 4"
              label={{
                position: "right",
                value: `Average ${averageStock.toLocaleString()}`,
                fill: "#64748B",
                fontSize: 12,
              }}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "#F1F5F9", strokeWidth: 2 }}
            />

            <Legend 
              wrapperStyle={{ paddingTop: '30px' }}
            />

            <Bar
              yAxisId="right"
              dataKey="variants"
              barSize={20}
              fill="#8B5CF6"
              radius={[4, 4, 0, 0]}
              name="Variants"
            />

            <Line
              yAxisId="left"
              type="monotone"
              dataKey="stock"
              stroke="#6366F1"
              strokeWidth={3}
              activeDot={{ r: 6 }}
              dot={{ r: 3, fill: "#6366F1" }}
              name="Total Stock"
            />
          </ComposedChart>
        </ResponsiveContainer>

        <div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
          <FiInfo className="w-4 h-4" />
          <span>Hover over points to see detailed stock information</span>
        </div>
      </div>

      {/* Pie Chart by Brand */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <div className="p-2 bg-indigo-50 rounded-xl">
              <FiTrendingUp className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Stock by Brand
              </h2>
              <p className="text-sm text-gray-500">
                Percentage distribution of inventory by brand
              </p>
            </div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={150}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [value.toLocaleString(), 'Stock']}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>

        <div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
          <FiInfo className="w-4 h-4" />
          <span>Hover over segments to see exact stock numbers</span>
        </div>
      </div>
    </div>
  );
};

export default StockChart;