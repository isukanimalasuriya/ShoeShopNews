import { Link } from 'react-router-dom';
import { FiEye, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';
import { useState, useEffect } from 'react';

const ShoeList = ({ shoes, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredShoes, setFilteredShoes] = useState(shoes);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Extract unique categories from shoes
  const categories = ['all', ...new Set(shoes.map(shoe => shoe.shoeType))];

  useEffect(() => {
    const results = shoes.filter(shoe => {
      const matchesSearch = 
        shoe.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shoe.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shoe.shoeType.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = 
        selectedCategory === 'all' || 
        shoe.shoeType === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
    setFilteredShoes(results);
  }, [searchTerm, shoes, selectedCategory]);

  return (
    <div className="ml-64 p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Shoe Inventory</h2>
        <Link 
          to="/shoes/add" 
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Add New Shoes
        </Link>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-8 bg-white p-4 rounded-lg shadow border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by brand, model or type..."
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-sm text-gray-500">
        Showing {filteredShoes.length} of {shoes.length} items
      </div>

      {/* Shoe Cards Grid */}
      {filteredShoes.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow border border-gray-200">
          <p className="text-gray-500 text-lg">No shoes match your search criteria</p>
          <button 
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
            }}
            className="mt-4 px-4 py-2 text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredShoes.map((shoe) => (
            <div
              key={shoe._id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="relative pb-[100%] bg-gray-100">
                <img
                  src={shoe.variants[0]?.imageUrl || '/default-shoe.jpg'}
                  alt={`${shoe.brand} ${shoe.model}`}
                  className="absolute h-full w-full object-contain p-4"
                  onError={(e) => {
                    e.target.src = '/default-shoe.jpg';
                  }}
                />
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-800 truncate">
                  {shoe.brand} {shoe.model}
                </h3>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-gray-600">${shoe.price.toFixed(2)}</p>
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                    {shoe.shoeType}
                  </span>
                </div>
                
                <div className="flex items-center mb-3">
                  <div className="flex -space-x-2">
                    {shoe.variants.slice(0, 3).map((variant, i) => (
                      <div 
                        key={i}
                        className="w-5 h-5 rounded-full border-2 border-white"
                        style={{ backgroundColor: variant.color.toLowerCase() }}
                        title={variant.color}
                      />
                    ))}
                    {shoe.variants.length > 3 && (
                      <div className="w-5 h-5 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs">
                        +{shoe.variants.length - 3}
                      </div>
                    )}
                  </div>
                  <span className="ml-2 text-sm text-gray-500">
                    {shoe.variants.length} color{shoe.variants.length !== 1 ? 's' : ''}
                  </span>
                </div>
                
                <div className="flex justify-between border-t pt-3">
                  <Link
                    to={`/shoes/${shoe._id}`}
                    className="text-indigo-600 hover:text-indigo-800 flex items-center"
                    title="View Details"
                  >
                    <FiEye className="mr-1" />
                  </Link>
                  <Link
                    to={`/shoes/${shoe._id}/edit`}
                    className="text-blue-600 hover:text-blue-800 flex items-center"
                    title="Edit"
                  >
                    <FiEdit2 className="mr-1" />
                  </Link>
                  <button
                    onClick={() => onDelete(shoe._id)}
                    className="text-red-600 hover:text-red-800 flex items-center"
                    title="Delete"
                  >
                    <FiTrash2 className="mr-1" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShoeList;