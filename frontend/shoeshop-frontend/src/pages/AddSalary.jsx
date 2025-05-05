import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";

const API_URL = "http://localhost:5000";

const AddSalary = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    baseSalary: "",
    overtimeHours: "",
    bonus: "",
    totalSalary: "",
    position: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let updatedFormData = { ...formData, [name]: value };

    // Optional: Automatically calculate total salary
    if (
      name === "baseSalary" ||
      name === "overtimeHours" ||
      name === "bonus"
    ) {
      const base = parseFloat(updatedFormData.baseSalary || 0);
      const overtime = parseFloat(updatedFormData.overtimeHours || 0);
      const bonus = parseFloat(updatedFormData.bonus || 0);
      updatedFormData.totalSalary = base + bonus + overtime * 100; // Customize rate if needed
    }

    setFormData(updatedFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/salary`, formData);
      navigate("/salary"); // Redirect back to salary page
    } catch (error) {
      console.error("Error adding salary:", error);
      alert("Failed to add salary. Please try again.");
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Add New Salary</h1>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Name" required className="border px-3 py-2 rounded" />
          <input type="number" name="baseSalary" value={formData.baseSalary} onChange={handleInputChange} placeholder="Base Salary" required className="border px-3 py-2 rounded" />
          <input type="number" name="overtimeHours" value={formData.overtimeHours} onChange={handleInputChange} placeholder="Overtime Hours" className="border px-3 py-2 rounded" />
          <input type="number" name="bonus" value={formData.bonus} onChange={handleInputChange} placeholder="Bonus" className="border px-3 py-2 rounded" />
          <input type="number" name="totalSalary" value={formData.totalSalary} onChange={handleInputChange} placeholder="Total Salary" required className="border px-3 py-2 rounded" />
          <select name="position" value={formData.position} onChange={handleInputChange} required className="border px-3 py-2 rounded">
            <option value="">Select Position</option>
            <option value="HR_MANAGER">HR Manager</option>
            <option value="DELIVERY_MANAGER">Delivery Manager</option>
            <option value="DELIVERY_PERSON">Delivery Person</option>
            <option value="admin">Admin</option>
          </select>
          <div className="col-span-2 flex justify-end mt-4">
            <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700">Add Salary</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSalary;
