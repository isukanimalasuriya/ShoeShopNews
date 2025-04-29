import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const userService = {
  getAllEmployees: async () => {
    try {
      const response = await axios.get(`${API_URL}/employees`);
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },
  
  getById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/employees/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      throw error;
    }
  },
  
  addEmployees: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/employees`, userData);
      return response.data;
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  },
  
  updateEmployee: async (id, userData) => {
    try {
      const response = await axios.put(`${API_URL}/employees/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      throw error;
    }
  },
  
  deleteEmployee: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/employees/${id}`);
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
      const response = await axios.get(`${API_URL}/leaves`);
      return response.data;
    } catch (error) {
      console.error('Error fetching leaves:', error);
      throw error;
    }
  },
  
  getLeaveById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/leaves/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching leave ${id}:`, error);
      throw error;
    }
  },
  
  addLeave: async (leaveData) => {
    try {
      const response = await axios.post(`${API_URL}/leaves`, leaveData);
      return response.data;
    } catch (error) {
      console.error('Error adding leave:', error);
      throw error;
    }
  },
  
  updateLeave: async (id, leaveData) => {
    try {
      const response = await axios.put(`${API_URL}/leaves/${id}`, leaveData);
      return response.data;
    } catch (error) {
      console.error(`Error updating leave ${id}:`, error);
      throw error;
    }
  },
  
  deleteLeave: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/leaves/${id}`);
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
      const response = await axios.get(`${API_URL}/attendance`);
      return response.data;
    } catch (error) {
      console.error('Error fetching attendance:', error);
      throw error;
    }
  },

  getAttendanceById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/attendance/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching attendance record ${id}:`, error);
      throw error;
    }
  },

  addAttendance: async (attendanceData) => {
    try {
      const response = await axios.post(`${API_URL}/attendance`, attendanceData);
      return response.data;
    } catch (error) {
      console.error('Error adding attendance record:', error);
      throw error;
    }
  },

  updateAttendance: async (id, attendanceData) => {
    try {
      const response = await axios.put(`${API_URL}/attendance/${id}`, attendanceData);
      return response.data;
    } catch (error) {
      console.error(`Error updating attendance record ${id}:`, error);
      throw error;
    }
  },

  deleteAttendance: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/attendance/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting attendance record ${id}:`, error);
      throw error;
    }
  }
};