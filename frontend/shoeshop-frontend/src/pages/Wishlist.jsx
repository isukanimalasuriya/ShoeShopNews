import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { FaTrash } from "react-icons/fa";
import { toast } from 'react-toastify'; // Add this if using toast notifications

const Wishlist = () => {
  const [wishlist, setWishlist] = useState({ items: [] });
  const [showModal, setShowModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || !user) {
    toast.error("Please log in to the system", {
      position: "top-right",
      autoClose: 3000,
    });
    navigate("/customerlogin");
    return null;
  }

  const userId = user._id;

  const FetchWishlist = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/wishlist/${userId}`);
      setWishlist(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    FetchWishlist();
  }, []);

  const navigateProduct = (shoeId) => {
    navigate(`/product/${shoeId}`);
  };

  const confirmDelete = (shoeId) => {
    setSelectedItemId(shoeId);
    setShowModal(true);
  };

  const handleDelete = () => {
    if (!selectedItemId) return;

    axios
      .delete(`http://localhost:5000/api/wishlist/${userId}`, {
        data: { shoeId: selectedItemId },
      })
      .then((res) => {
        console.log(res.data);
        setWishlist((prev) => ({
          ...prev,
          items: prev.items.filter((item) => item.shoeId !== selectedItemId),
        }));
        setShowModal(false);
        setSelectedItemId(null);
      })
      .catch((err) => {
        console.log(err);
        setShowModal(false);
        setSelectedItemId(null);
      });
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">🧡 My Wishlist</h1>

      {wishlist.items.map((item) => (
        <div key={item._id} className="bg-white rounded-2xl shadow-md flex overflow-hidden mb-6 relative">
          {/* Delete Icon */}
          <button
            onClick={() => confirmDelete(item.shoeId)}
            className="absolute top-3 right-3 text-black hover:scale-110"
          >
            <FaTrash size={18} />
          </button>

          <img
            src={item.imageUrl}
            alt={item.model}
            className="w-48 h-48 object-cover cursor-pointer"
            onClick={() => navigateProduct(item.shoeId)}
          />

          <div className="p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">{item.brand} - {item.model}</h2>
              <p className="text-gray-600"><strong>Model:</strong> {item.model}</p>
              <p className="text-gray-600"><strong>Brand:</strong> {item.brand}</p>
            </div>
            <div>
              <p className="text-lg font-bold text-red-600 mt-4">LKR {item.price}.00</p>
              <p className="text-xs text-gray-400 mt-1">Item ID: {item._id}</p>
            </div>
          </div>
        </div>
      ))}

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Are you sure?</h2>
            <p className="mb-6">Do you really want to remove this item from your wishlist?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                No
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
