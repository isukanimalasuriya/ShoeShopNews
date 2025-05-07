import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  LineChart, Line, PieChart, Pie, Cell, Legend, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer
} from 'recharts';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
      const token = localStorage.getItem('token');
      const employeeData = localStorage.getItem('employee');
    
      if (!token || !employeeData) {
        navigate('/employeelogin');
        return;
      }
    
      const user = JSON.parse(employeeData);
    
      if (user.role === 'admin' || user.role === 'FINANCE_MANAGER') {
        setIsAuthorized(true);
      } else {
        // Optional: redirect or show unauthorized message
        navigate('/unauthorized'); // Or you can navigate elsewhere
      }
      }, [navigate]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/order/all')
      .then(res => setOrders(res.data))
      .catch(err => console.error("Error fetching orders:", err));
  }, []);

  const filteredOrders = selectedMonth
    ? orders.filter(order => {
        const date = new Date(order.orderDate);
        const [year, month] = selectedMonth.split('-').map(Number);
        return date.getMonth() + 1 === month && date.getFullYear() === year;
      })
    : orders;

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Orders Report - ${selectedMonth || 'All'}`, 14, 20);
    let y = 30;

    filteredOrders.forEach((order, index) => {
      doc.setFontSize(12);
      doc.text(`Order ID: ${order._id}`, 14, y);
      doc.text(`User: ${order.firstName || ''} ${order.lastName || ''}`, 14, y + 6);
      doc.text(`Total: Rs. ${order.totalAmount}`, 14, y + 12);
      doc.text(`Status: ${order.paymentStatus}`, 14, y + 18);
      doc.text(`Method: ${order.paymentMethod}`, 14, y + 24);
      doc.text(`Date: ${new Date(order.orderDate).toLocaleDateString()}`, 14, y + 30);
      doc.text(`Address: ${order.shippingAddress}, ${order.city || ''}`, 14, y + 36);
      doc.text(`Phone: ${order.phonenumber || ''}`, 14, y + 42);
      doc.text(`Email: ${order.email || ''}`, 14, y + 48);

      const itemData = order.items.map(item => ([
        item.ModelName || item.BrandName || 'N/A',
        item.color,
        item.size,
        item.quantity
      ]));

      autoTable(doc, {
        head: [["Model", "Color", "Size", "Qty"]],
        body: itemData,
        startY: y + 54,
        styles: { fontSize: 10 }
      });

      y = doc.lastAutoTable.finalY + 10;
      if (y > 260 && index !== filteredOrders.length - 1) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save(selectedMonth ? `orders-${selectedMonth}.pdf` : "orders-report.pdf");
  };

  const totalAmount = filteredOrders.reduce((acc, order) => acc + order.totalAmount, 0);
  const orderCount = filteredOrders.length;

  const dayRevenueMap = new Map();
  filteredOrders.forEach(order => {
    const date = new Date(order.orderDate);
    const key = date.toISOString().split('T')[0];
    dayRevenueMap.set(key, (dayRevenueMap.get(key) || 0) + order.totalAmount);
  });

  const chartData = Array.from(dayRevenueMap.entries())
    .sort(([a], [b]) => new Date(a) - new Date(b))
    .map(([date, total]) => ({ name: date, total }));

  const paymentMethodData = [
    { name: 'Card', value: filteredOrders.filter(o => o.paymentMethod === 'PayHere').length },
    { name: 'Cash', value: filteredOrders.filter(o => o.paymentMethod === 'Cash on Delivery').length },
  ];

  const COLORS = ['#34D399', '#60A5FA'];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800 text-center md:text-left">Finance Manager Orders Dashboard</h1>
        <div className="flex gap-3">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            onClick={generatePDF}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow"
          >
            Download PDF
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow text-center">
          <h2 className="text-xl font-semibold text-gray-600">Total Orders</h2>
          <p className="text-3xl font-bold text-blue-600">{orderCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow text-center">
          <h2 className="text-xl font-semibold text-gray-600">Total Revenue</h2>
          <p className="text-3xl font-bold text-green-600">Rs. {totalAmount.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow text-center">
          <h2 className="text-xl font-semibold text-gray-600">Month</h2>
          <p className="text-2xl font-medium">{selectedMonth || "All"}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-lg font-bold mb-3">Daily Revenue</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="total" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-lg font-bold mb-3">Payment Method Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={paymentMethodData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {paymentMethodData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white shadow rounded-xl p-4 overflow-x-auto">
        <h2 className="text-xl font-bold mb-4">Orders Table</h2>
        <table className="min-w-full table-auto border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-2 px-4 border">Order ID</th>
              <th className="py-2 px-4 border">Amount</th>
              <th className="py-2 px-4 border">Date</th>
              <th className="py-2 px-4 border">Status</th>
              <th className="py-2 px-4 border">View</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border">{order._id}</td>
                <td className="py-2 px-4 border">Rs. {order.totalAmount.toFixed(2)}</td>
                <td className="py-2 px-4 border">{new Date(order.orderDate).toLocaleDateString()}</td>
                <td className="py-2 px-4 border">{order.paymentStatus}</td>
                <td className="py-2 px-4 border">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredOrders.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No orders found for this month.</p>
        )}
      </div>

      {/* Modal View */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] md:w-[600px] max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xl font-bold"
            >
              ×
            </button>

            <h2 className="text-2xl font-bold mb-2">Order ID: {selectedOrder._id}</h2>
            <p><strong>User:</strong> {selectedOrder.firstName} {selectedOrder.lastName}</p>
            <p><strong>Total:</strong> Rs. {selectedOrder.totalAmount.toFixed(2)}</p>
            <p><strong>Status:</strong> {selectedOrder.paymentStatus}</p>
            <p><strong>Method:</strong> {selectedOrder.paymentMethod}</p>
            <p><strong>Date:</strong> {new Date(selectedOrder.orderDate).toLocaleDateString()}</p>
            <p><strong>Address:</strong> {selectedOrder.shippingAddress}, {selectedOrder.city}</p>
            <p><strong>Phone:</strong> {selectedOrder.phonenumber}</p>
            <p><strong>Email:</strong> {selectedOrder.email}</p>

            <h3 className="text-xl font-semibold mt-4 mb-2">Items:</h3>
            {selectedOrder.items.map(item => (
              <div key={item._id} className="flex items-center mb-3 border p-2 rounded">
                <img src={item.imageUrl} alt="Item" className="w-16 h-16 object-cover rounded mr-4" />
                <div>
                  {item.BrandName && <p className="font-medium">Brand: {item.BrandName}</p>}
                  {item.ModelName && <p className="font-medium">Model: {item.ModelName}</p>}
                  <p>Color: {item.color}</p>
                  <p>Size: {item.size}</p>
                  <p>Qty: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
