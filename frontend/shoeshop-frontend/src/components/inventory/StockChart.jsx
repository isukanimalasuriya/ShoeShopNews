import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    LabelList,
    ReferenceLine,
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
                {payload[0].payload.variants}
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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [averageStock, setAverageStock] = useState(0);
  
    useEffect(() => {
      const fetchStockData = async () => {
        try {
          const response = await axios.get("http://localhost:5000/api/shoes");
          const shoes = response.data;
  
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
              <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
              <span>Total Stock</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-200 rounded-full" />
              <span>Average</span>
            </div>
          </div>
        </div>
  
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 50 }}
          >
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0.6} />
              </linearGradient>
            </defs>
  
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#F3F4F6"
            />
  
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
              tick={{ fill: "#6B7280", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              width={80}
              tickFormatter={(value) => value.toLocaleString()}
            />
  
            <ReferenceLine
              y={averageStock}
              stroke="#94A3B8"
              strokeDasharray="4 4"
              label={{
                position: "right",
                value: `Average ${averageStock.toLocaleString()}`,
                fill: "#a50dfc",
                fontSize: 12,
              }}
            />
  
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "#F1F5F9", radius: 8 }}
            />
  
            <Bar
              dataKey="stock"
              radius={[6, 6, 0, 0]}
              fill="url(#barGradient)"
              background={{ fill: "#F8FAFC", radius: 6 }}
            >
              <LabelList
                dataKey="stock"
                position="top"
                formatter={(value) => value.toLocaleString()}
                fill="#64748B"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
  
        <div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
          <FiInfo className="w-4 h-4" />
          <span>Hover over bars to see detailed stock information</span>
        </div>
      </div>
    );
  };
  
  export default StockChart;
  