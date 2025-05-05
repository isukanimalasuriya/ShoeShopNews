import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiTrash2, FiPlus } from 'react-icons/fi';

const AddShoeForm = () => {
  const [shoeData, setShoeData] = useState({
    brand: '',
    model: '',
    shoeWearer: '',
    shoeType: '',
    price: '',
    description: '',
    variants: [{ color: '', sizes: [{ size: '', stock: '' }], imageUrl: '' }],
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Validation function remains the same
  const validateForm = () => {
    const newErrors = {};
    if (!shoeData.brand.trim()) newErrors.brand = 'Brand is required';
    if (!shoeData.model.trim()) newErrors.model = 'Model is required';
    if (!shoeData.shoeWearer) newErrors.shoeWearer = 'Shoe Wearer is required';
    if (!shoeData.shoeType.trim()) newErrors.shoeType = 'Shoe Type is required';
    if (!shoeData.price || isNaN(shoeData.price) || Number(shoeData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }

    shoeData.variants.forEach((variant, variantIndex) => {
      if (!variant.color.trim()) {
        newErrors[`variant${variantIndex}.color`] = 'Color is required';
      }
      if (!variant.imageUrl.trim()) {
        newErrors[`variant${variantIndex}.imageUrl`] = 'Image URL is required';
      } else if (!/^https?:\/\/.+\..+/.test(variant.imageUrl)) {
        newErrors[`variant${variantIndex}.imageUrl`] = 'Invalid URL format';
      }

      variant.sizes.forEach((size, sizeIndex) => {
        if (!size.size || isNaN(size.size) || Number(size.size) <= 0) {
          newErrors[`variant${variantIndex}.size${sizeIndex}.size`] = 'Size must be a positive number';
        }
        if (!size.stock || isNaN(size.stock) || Number(size.stock) < 0) {
          newErrors[`variant${variantIndex}.size${sizeIndex}.stock`] = 'Stock must be a non-negative number';
        }
      });
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle change function remains the same
  const handleChange = (e, variantIndex, sizeIndex) => {
    const { name, value } = e.target;
    if (variantIndex !== undefined && sizeIndex !== undefined) {
      const newVariants = [...shoeData.variants];
      newVariants[variantIndex].sizes[sizeIndex][name] = value;
      setShoeData({ ...shoeData, variants: newVariants });
    } else if (variantIndex !== undefined) {
      const newVariants = [...shoeData.variants];
      newVariants[variantIndex][name] = value;
      setShoeData({ ...shoeData, variants: newVariants });
    } else {
      setShoeData({ ...shoeData, [name]: value });
    }
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // Add variant function remains the same
  const addVariant = () => {
    setShoeData({
      ...shoeData,
      variants: [...shoeData.variants, { color: '', sizes: [{ size: '', stock: '' }], imageUrl: '' }],
    });
  };

  // Remove variant function
  const removeVariant = (variantIndex) => {
    if (shoeData.variants.length > 1) {
      const newVariants = [...shoeData.variants];
      newVariants.splice(variantIndex, 1);
      setShoeData({ ...shoeData, variants: newVariants });
    }
  };

  // Add size function remains the same
  const addSize = (variantIndex) => {
    const newVariants = [...shoeData.variants];
    newVariants[variantIndex].sizes.push({ size: '', stock: '' });
    setShoeData({ ...shoeData, variants: newVariants });
  };

  // Remove size function
  const removeSize = (variantIndex, sizeIndex) => {
    const newVariants = [...shoeData.variants];
    if (newVariants[variantIndex].sizes.length > 1) {
      newVariants[variantIndex].sizes.splice(sizeIndex, 1);
      setShoeData({ ...shoeData, variants: newVariants });
    }
  };

  // Submit function remains the same
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    try {
      const dataToSend = {
        ...shoeData,
        price: Number(shoeData.price),
        variants: shoeData.variants.map(variant => ({
          color: variant.color,
          imageUrl: variant.imageUrl,
          sizes: variant.sizes.map(size => ({
            size: Number(size.size),
            stock: Number(size.stock)
          }))
        }))
      };
  
      const response = await axios.post('http://localhost:5000/api/shoes', dataToSend, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      navigate("/shoes", { state: { id: shoeData._id } });
    } catch (error) {
      console.error('Error adding shoe:', error.response?.data || error.message);
      setErrors({ submit: error.response?.data?.error || 'Failed to add shoe' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Shoe</h2>
        
        {errors.submit && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {errors.submit}
          </div>
        )}

        {/* Basic Information Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Brand */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
            <input
              name="brand"
              value={shoeData.brand}
              onChange={(e) => handleChange(e)}
              className={`w-full px-3 py-2 border rounded-md ${errors.brand ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Nike, Adidas, etc."
            />
            {errors.brand && <p className="mt-1 text-sm text-red-600">{errors.brand}</p>}
          </div>

          {/* Model */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
            <input
              name="model"
              value={shoeData.model}
              onChange={(e) => handleChange(e)}
              className={`w-full px-3 py-2 border rounded-md ${errors.model ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Air Max, Ultraboost, etc."
            />
            {errors.model && <p className="mt-1 text-sm text-red-600">{errors.model}</p>}
          </div>

          {/* Shoe Wearer */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Shoe Wearer</label>
            <select
              name="shoeWearer"
              value={shoeData.shoeWearer}
              onChange={(e) => handleChange(e)}
              className={`w-full px-3 py-2 border rounded-md ${errors.shoeWearer ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Select Wearer</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
            </select>
            {errors.shoeWearer && <p className="mt-1 text-sm text-red-600">{errors.shoeWearer}</p>}
          </div>

          {/* Shoe Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Shoe Type</label>
            <input
              name="shoeType"
              value={shoeData.shoeType}
              onChange={(e) => handleChange(e)}
              className={`w-full px-3 py-2 border rounded-md ${errors.shoeType ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Running, Casual, Basketball, etc."
            />
            {errors.shoeType && <p className="mt-1 text-sm text-red-600">{errors.shoeType}</p>}
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price (LKR)</label>
            <input
              type="number"
              name="price"
              value={shoeData.price}
              onChange={(e) => handleChange(e)}
              min="0"
              step="0.01"
              className={`w-full px-3 py-2 border rounded-md ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="99.99"
            />
            {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={shoeData.description}
            onChange={(e) => handleChange(e)}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Describe the shoe features and benefits..."
          />
        </div>

        {/* Variants Section */}
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b pb-2">
            <h3 className="text-lg font-semibold text-gray-800">Variants</h3>
            <button
              type="button"
              onClick={addVariant}
              className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <FiPlus className="mr-1" />
              Add Variant
            </button>
          </div>
          
          {shoeData.variants.map((variant, variantIndex) => (
            <div key={variantIndex} className="p-4 border border-gray-200 rounded-lg bg-gray-50 relative">
              {/* Variant Header with Delete Button */}
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-md font-medium text-gray-700">Variant #{variantIndex + 1}</h4>
                {shoeData.variants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeVariant(variantIndex)}
                    className="text-red-600 hover:text-red-800"
                    title="Remove variant"
                  >
                    <FiTrash2 />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                  <input
                    type="text"
                    name="color"
                    value={variant.color}
                    onChange={(e) => handleChange(e, variantIndex)}
                    className={`w-full px-3 py-2 border rounded-md ${errors[`variant${variantIndex}.color`] ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Red, Blue, Black, etc."
                  />
                  {errors[`variant${variantIndex}.color`] && (
                    <p className="mt-1 text-sm text-red-600">{errors[`variant${variantIndex}.color`]}</p>
                  )}
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input
                    type="text"
                    name="imageUrl"
                    value={variant.imageUrl}
                    onChange={(e) => handleChange(e, variantIndex)}
                    className={`w-full px-3 py-2 border rounded-md ${errors[`variant${variantIndex}.imageUrl`] ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="https://example.com/image.jpg"
                  />
                  {errors[`variant${variantIndex}.imageUrl`] && (
                    <p className="mt-1 text-sm text-red-600">{errors[`variant${variantIndex}.imageUrl`]}</p>
                  )}
                </div>
              </div>

              {/* Sizes */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-md font-medium text-gray-700">Sizes</h4>
                  <button
                    type="button"
                    onClick={() => addSize(variantIndex)}
                    className="flex items-center px-2 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                  >
                    <FiPlus className="mr-1" size={14} />
                    Add Size
                  </button>
                </div>
                <div className="space-y-3">
                  {variant.sizes.map((size, sizeIndex) => (
                    <div key={sizeIndex} className="flex items-center space-x-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            name="size"
                            value={size.size}
                            onChange={(e) => handleChange(e, variantIndex, sizeIndex)}
                            min="1"
                            className={`w-full px-3 py-2 border rounded-md ${errors[`variant${variantIndex}.size${sizeIndex}.size`] ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="e.g., 9"
                          />
                          {variant.sizes.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeSize(variantIndex, sizeIndex)}
                              className="text-red-600 hover:text-red-800 p-1"
                              title="Remove size"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          )}
                        </div>
                        {errors[`variant${variantIndex}.size${sizeIndex}.size`] && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors[`variant${variantIndex}.size${sizeIndex}.size`]}
                          </p>
                        )}
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                        <input
                          type="number"
                          name="stock"
                          value={size.stock}
                          onChange={(e) => handleChange(e, variantIndex, sizeIndex)}
                          min="0"
                          className={`w-full px-3 py-2 border rounded-md ${errors[`variant${variantIndex}.size${sizeIndex}.stock`] ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="Available quantity"
                        />
                        {errors[`variant${variantIndex}.size${sizeIndex}.stock`] && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors[`variant${variantIndex}.size${sizeIndex}.stock`]}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Add Shoe
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddShoeForm;