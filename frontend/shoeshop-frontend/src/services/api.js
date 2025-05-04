import axios from 'axios';

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

export const attendanceService = {
  getAllAttendance: async () => {
    try {
      const response = await axios.get(`${API_URL}/api/attendance`);
      return response.data;
    } catch (error) {
      console.error("Error fetching attendance:", error?.response?.data || error.message);
      throw error;
    }
  },

  getAttendanceById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/api/attendance/${id}`);
      return response.data;
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