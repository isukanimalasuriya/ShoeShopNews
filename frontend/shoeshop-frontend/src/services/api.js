import axios from 'axios';

const API_URL = 'http://localhost:5000/api/shoes'; // Dynamically use environment variable for flexibility

// Create an Axios instance for consistent configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    // Uncomment and configure if authentication is needed:
    // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
  },
});

// Get all shoes
export const getAllShoes = async () => {
  try {
    const response = await api.get('/');
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data || error.message || 'An unknown error occurred.';
    console.error('Error fetching all shoes:', errorMessage);
    throw new Error(errorMessage);
  }
};

// Get single shoe by ID
export const getShoe = async (id) => {
  try {
    const response = await api.get(`/${id}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data || error.message || `Failed to fetch shoe with ID: ${id}.`;
    console.error(`Error fetching shoe ${id}:`, errorMessage);
    throw new Error(errorMessage);
  }
};

// Create new shoe with file upload
export const createShoe = async (formData) => {
  try {
    const response = await api.post('/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data || error.message || 'Failed to create shoe.';
    console.error('Error creating shoe:', errorMessage);
    throw new Error(errorMessage);
  }
};

// Update existing shoe with file upload
export const updateShoe = async (id, formData) => {
  try {
    const response = await api.put(`/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data || error.message || `Failed to update shoe with ID: ${id}.`;
    console.error(`Error updating shoe ${id}:`, errorMessage);
    throw new Error(errorMessage);
  }
};

// Delete shoe by ID
export const deleteShoe = async (id) => {
  try {
    const response = await api.delete(`/${id}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data || error.message || `Failed to delete shoe with ID: ${id}.`;
    console.error(`Error deleting shoe ${id}:`, errorMessage);
    throw new Error(errorMessage);
  }
};

// Search shoes by query
export const searchShoes = async (query) => {
  try {
    const response = await api.get(`/search?query=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data || error.message || 'Failed to search shoes.';
    console.error('Error searching shoes:', errorMessage);
    throw new Error(errorMessage);
  }
};

// Get shoes by category
export const getShoesByCategory = async (category) => {
  try {
    const response = await api.get(`/category/${encodeURIComponent(category)}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data || error.message || `Failed to fetch shoes for category: ${category}.`;
    console.error(`Error fetching shoes by category ${category}:`, errorMessage);
    throw new Error(errorMessage);
  }
};
