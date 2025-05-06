import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import ShoeList from '../components/inventory/ShoeList';

const ShoeListPage = () => {
  const [shoes, setShoes] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchShoes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/shoes');
        const query = new URLSearchParams(location.search);
        const category = query.get('category');
        let filteredShoes = response.data;
        if (category) {
          filteredShoes = filteredShoes.filter(
            (shoe) => shoe.shoeWearer.toLowerCase() === category.toLowerCase()
          );
        }
        setShoes(filteredShoes);
      } catch (error) {
        console.error('Error fetching shoes:', error);
      }
    };
    fetchShoes();
  }, [location.search]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this shoe?')) {
      try {
        await axios.delete(`http://localhost:5000/api/shoes/${id}`);
        setShoes(shoes.filter((shoe) => shoe._id !== id));
      } catch (error) {
        console.error('Error deleting shoe:', error);
      }
    }
  };

  const handleBackToCategory = () => {
    navigate(-1); // Go back to the previous page
  };

  const query = new URLSearchParams(location.search);
  const hasCategory = query.has('category');

  return (
    <div className="-mt-20">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Shoe Inventory</h1>
      <div className="flex items-center mb-6 space-x-4">
        <Link
          to="/shoes/add"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Add New Shoe
        </Link>
        {hasCategory && (
          <button
          onClick={handleBackToCategory}
          className="ml-32 px-7 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-600 transition-colors"
        >
          Back to Category
        </button>
        )}
      </div>
      <ShoeList shoes={shoes} onDelete={handleDelete} />
    </div>
  );
};

export default ShoeListPage;