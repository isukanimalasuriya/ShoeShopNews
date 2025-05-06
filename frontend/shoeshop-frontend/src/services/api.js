import axios from 'axios';


const API_URL1 = 'http://localhost:5000/api/shoes'; // Dynamically use environment variable for flexibility

// Create an Axios instance for consistent configuration
const api = axios.create({
  baseURL: API_URL1,
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

const API_URL = 'http://localhost:5000';

export const userService = {
  getAllEmployees: async () => {
    try {
      const response = await axios.get(`${API_URL}/api/employees`);
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },
  
  getById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/api/employees/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      throw error;
    }
  },
  
  addEmployees: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/api/employees`, userData);
      return response.data;
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  },
  
  updateEmployee: async (id, userData) => {
    try {
      const response = await axios.put(`${API_URL}/api/employees/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      throw error;
    }
  },
  
  deleteEmployee: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/api/employees/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error);
      throw error;
    }
  }
};

export const leaveService = {
  getAllLeaves: async () => {
    try {
      const response = await axios.get(`${API_URL}/api/leaves`);
      return response.data;
    } catch (error) {
      console.error('Error fetching leaves:', error);
      throw error;
    }
  },
  
  getLeaveById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/api/leaves/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching leave ${id}:`, error);
      throw error;
    }
  },
  
  addLeave: async (leaveData) => {
    try {
      const response = await axios.post(`${API_URL}/api/leaves`, leaveData);
      return response.data;
    } catch (error) {
      console.error('Error adding leave:', error);
      throw error;
    }
  },
  
  updateLeave: async (id, leaveData) => {
    try {
      const response = await axios.put(`${API_URL}/api/leaves/${id}`, leaveData);
      return response.data;
    } catch (error) {
      console.error(`Error updating leave ${id}:`, error);
      throw error;
    }
  },
  
  deleteLeave: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/api/leaves/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting leave ${id}:`, error);
      throw error;
    }
  }
};

export const attendanceService = 


{
  getAllAttendance: async () => {
    try {
      const response = await axios.get(`${API_URL}/api/attendance`);
      // Extract the records from the response
      return response.data.records || response.data;
    } catch (error) {
      console.error("Error fetching attendance:", error?.response?.data || error.message);
      throw error;
    }
  },
  
  // Similar fixes for other attendance service methods:
  getAttendanceById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/api/attendance/${id}`);
      return response.data.records || response.data;
    } catch (error) {
      console.error(`Error fetching attendance record ${id}:`, error?.response?.data || error.message);
      throw error;
    }
  },

  addAttendance: async (attendanceData) => {
    try {
      const response = await axios.post(`${API_URL}/api/attendance`, attendanceData);
      return response.data;
    } catch (error) {
      console.error("Error adding attendance record:", error?.response?.data || error.message);
      throw error;
    }
  },

  updateAttendance: async (id, attendanceData) => {
    try {
      const response = await axios.put(`${API_URL}/api/attendance/${id}`, attendanceData);
      return response.data;
    } catch (error) {
      console.error(`Error updating attendance record ${id}:`, error?.response?.data || error.message);
      throw error;
    }
  },

  deleteAttendance: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/api/attendance/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting attendance record ${id}:`, error?.response?.data || error.message);
      throw error;
    }
  }
};

export const salaryService = {
  getAllSalaries: async () => {
    try {
      const response = await axios.get(`${API_URL}/api/salary`);
      // Format the data to match what the component expects
      return { 
        salaries: response.data.records || response.data 
      };
    } catch (error) {
      console.error("Error fetching salary data:", error?.response?.data || error.message);
      throw error;
    }
  },

  getSalaryById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/api/salary/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching salary ${id}:`, error?.response?.data || error.message);
      throw error;
    }
  },

  addSalary: async (salaryData) => {
    try {
      const response = await axios.post(`${API_URL}/api/salary`, salaryData);
      return response.data;
    } catch (error) {
      console.error("Error adding salary:", error?.response?.data || error.message);
      throw error;
    }
  },

  updateSalary: async (id, salaryData) => {
    try {
      const response = await axios.put(`${API_URL}/api/salary/${id}`, salaryData);
      return response.data;
    } catch (error) {
      console.error(`Error updating salary ${id}:`, error?.response?.data || error.message);
      throw error;
    }
  },

  deleteSalary: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/api/salary/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting salary ${id}:`, error?.response?.data || error.message);
      throw error;
    }
  }
}
