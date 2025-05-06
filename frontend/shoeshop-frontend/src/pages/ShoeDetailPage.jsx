import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FiEdit, FiTrash2, FiArrowLeft, FiBox, FiDollarSign, FiInfo } from 'react-icons/fi';

const ShoeDetailPage = () => {
  const { id } = useParams();
  const [shoe, setShoe] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/employeelogin'); // Redirect if no token found
    }
  }, [navigate]);

  useEffect(() => {
    const fetchShoe = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/shoes/${id}`);
        setShoe(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching shoe:', error);
        setLoading(false);
      }
    };
    fetchShoe();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this shoe?')) {
      try {
        await axios.delete(`http://localhost:5000/api/shoes/${id}`);
        navigate('/shoes');
      } catch (error) {
        console.error('Error deleting shoe:', error);
      }
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );

  if (!shoe) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-red-500">
      <FiAlertCircle className="text-4xl mb-4" />
      <p className="text-xl">Shoe not found</p>
      <button
        onClick={() => navigate(-1)}
        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
      >
        Go Back
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-[260px] p-6 lg:p-8 w-[80%]">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center text-indigo-600 hover:text-indigo-800"
      >
        <FiArrowLeft className="mr-2" /> Back to Collection
      </button>

      {/* Product Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            {shoe.brand} {shoe.model}
          </h1>
          <p className="mt-2 text-gray-600">{shoe.description}</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-4">
          <Link
            to={`/shoes/${shoe._id}/edit`}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
          >
            <FiEdit className="mr-2" /> Edit
          </Link>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
          >
            <FiTrash2 className="mr-2" /> Delete
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center">
            <FiDollarSign className="text-2xl text-green-600 mr-4" />
            <div>
              <h3 className="text-sm font-medium text-gray-500">Price</h3>
              <p className="text-2xl font-bold text-gray-900">LKR {shoe.price}</p>
            </div>
          </div>
          <div className="flex items-center">
            <FiInfo className="text-2xl text-blue-600 mr-4" />
            <div>
              <h3 className="text-sm font-medium text-gray-500">Product ID</h3>
              <p className="text-sm font-mono text-gray-600">{shoe._id}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Variants Section */}
      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <FiBox className="mr-2 text-indigo-600" /> Available Variants
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shoe.variants.map((variant, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <img 
              src={variant.imageUrl}
              alt={variant.color}
              className="w-full h-48 object-cover"
              onError={(e) => (e.target.src = '/default-shoe.jpg')}
            />
            <div className="p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">{variant.color}</h4>
              <div className="space-y-2">
                {variant.sizes.map((size, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Size {size.size}</span>
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      size.stock > 10 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {size.stock} in stock
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShoeDetailPage;