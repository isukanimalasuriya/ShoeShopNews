import React from 'react';

const ShoeDetails = ({ shoe }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <img 
        src={shoe.variants[0].imageUrl} 
        alt={`${shoe.brand} ${shoe.model}`} 
        className="w-full h-64 object-cover rounded mb-4"
        onError={(e) => { e.target.src = '/placeholder-image.jpg'; }} // Fallback image
      />
      <h2 className="text-2xl font-bold mb-2">{shoe.brand} {shoe.model}</h2>
      <p className="text-gray-600 mb-2">{shoe.shoeType} - {shoe.shoeWearer}</p>
      <p className="text-green-600 font-bold text-xl mb-2">${shoe.price}</p>
      <p className="text-gray-700 mb-4">{shoe.description || 'No description available'}</p>
      
      <div className="border-t pt-4">
        <h3 className="font-semibold mb-2">Variant Details:</h3>
        <div className="mb-2">
          <p><span className="font-medium">Color:</span> {shoe.variants[0].color}</p>
          <div className="ml-4">
            {shoe.variants[0].sizes.map((size, idx) => (
              <p key={idx}>
                <span className="font-medium">Size {size.size}:</span> {size.stock} in stock
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoeDetails;