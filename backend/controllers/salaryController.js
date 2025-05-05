// controllers/salaryController.js

import Salary from "../modeles/Salarymodel.js";

// Get All Salary Records
export const getAllSalary = async (req, res, next) => {
    let salaries;
    try {
        salaries = await Salary.find();
    } catch (err) {
        console.log(err);
    }

    if (!salaries) {
        return res.status(404).json({ message: "Salary records not found" });
    }

    return res.status(200).json({ salaries });
};

// Add a Salary Record
export const addSalary = async (req, res, next) => {
    const { name, baseSalary, overtimeHours, bonus, totalSalary,position } = req.body;
    let salary;

    try {
        salary = new Salary({ name, baseSalary, overtimeHours, bonus, totalSalary,position });
        await salary.save();
    } catch (err) {
        console.log(err);
    }

    if (!salary) {
        return res.status(400).json({ message: "Unable to add salary record" });
    }

    return res.status(201).json({ salary });
};

// Get Salary Record by ID
export const getSalaryById = async (req, res, next) => {
    const id = req.params.id;
    let salary;

    try {
        salary = await Salary.findById(id);
    } catch (err) {
        console.log(err);
    }

    if (!salary) {
        return res.status(404).json({ message: "Salary record not found" });
    }

    return res.status(200).json({ salary });
};

// Update a Salary Record
export const updateSalary = async (req, res, next) => {
    const id = req.params.id;
    const { name, baseSalary, overtimeHours, bonus, totalSalary,position } = req.body;
    let salary;

    try {
        salary = await Salary.findByIdAndUpdate(
            id,
            { name, baseSalary, overtimeHours, bonus, totalSalary,position },
            { new: true }
        );
    } catch (err) {
        console.log(err);
    }

    if (!salary) {
        return res.status(404).json({ message: "Unable to update salary record" });
    }

    return res.status(200).json({ salary });
};

// Delete a Salary Record
export const deleteSalary = async (req, res, next) => {
    const id = req.params.id;
    let salary;

    try {
        salary = await Salary.findByIdAndDelete(id);
    } catch (err) {
        console.log(err);
    }

    if (!salary) {
        return res.status(404).json({ message: "Unable to delete salary record" });
    }

    return res.status(200).json({ message: "Salary record deleted successfully" });
};
export const salaryService = {
    getAllSalary: async () => {
      const res = await axios.get(`${API_URL}/api/salary`);
      return res.data;
    },
  
    getSalaryById: async (id) => {
      const res = await axios.get(`${API_URL}/api/salary/${id}`);
      return res.data;
    },
  
    addSalary: async (salaryData) => {
      const res = await axios.post(`${API_URL}/api/salary`, salaryData);
      return res.data;
    },
  
    updateSalary: async (id, salaryData) => {
      const res = await axios.put(`${API_URL}/api/salary/${id}`, salaryData);
      return res.data;
    },
  
    deleteSalary: async (id) => {
      const res = await axios.delete(`${API_URL}/api/salary/${id}`);
      return res.data;
    }
  };