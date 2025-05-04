import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useAuthStore } from "../store/authStore";

const Orders = () => {
    const { user, isAuthenticated } = useAuthStore();
  if (!isAuthenticated || !user) {
      toast.error("Please log in to the system", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/customerlogin");
      return;
  }
  const [orders, setOrders] = useState([]);
  const userId = user._id//"user125"

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/order/${userId}`)
      .then((res) => {
        console.log('Order data:', res.data);
        setOrders(res.data);
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
      });
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">My Orders</h1>

      <div className="space-y-6">
        {orders.length === 0 ? (
          <p className="text-gray-500">No orders found.</p>
        ) : (
          orders.map((order, index) => (
            <div key={order._id} className="bg-white shadow-lg rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Order #{index + 1} — {order.paymentMethod}
                </h2>
                <span
                  className={`text-sm px-3 py-1 rounded-full font-medium ${
                    order.paymentStatus === 'Paid'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {order.paymentStatus}
                </span>
                {/*
                <span><h3>Delivery Status</h3>{order.deliveryStatus}</span>
                */}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                <div>
                  <p><strong>Customer:</strong> {order.firstName} {order.lastName}</p>
                  <p><strong>Email:</strong> {order.email}</p>
                  <p><strong>Phone:</strong> {order.phonenumber}</p>
                </div>
                <div>
                  <p><strong>City:</strong> {order.city}</p>
                  <p><strong>Shipping:</strong> {order.shippingAddress}</p>
                  <p><strong>Date:</strong> {new Date(order.orderDate).toLocaleString()}</p>
                  <span
  className={`text-sm inline-block mt-1 px-3 py-1 rounded-full font-medium ${
    order.deliveryStatus === 'Delivered'
      ? 'bg-green-100 text-green-700'
      : order.deliveryStatus === 'Processing'
      ? 'bg-yellow-100 text-yellow-700'
      : 'bg-gray-100 text-gray-700'
  }`}
>
  {order.deliveryStatus}
</span>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold text-gray-700 mb-2">Items:</h3>
                <div className="grid gap-4">
                  {order.items.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center space-x-4 bg-gray-50 p-3 rounded-lg"
                    >
                      <img
                        src={item.imageUrl}
                        alt="shoe"
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium text-gray-800">Shoe Brand: {item.BrandName}</p>
                        <p className="font-medium text-gray-800">Model: {item.ModelName}</p>
                        <p className="text-sm text-gray-600">
                          Color: {item.color} | Size: {item.size} | Quantity: {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-right">
                <p className="text-lg font-bold text-gray-800">
                  Total: Rs. {order.totalAmount.toFixed(2)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
