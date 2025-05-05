import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../services/api";

const AddNewEmployee = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    age: "",
    password: ""
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await userService.addEmployees(formData);
      navigate("/employee"); // Redirect to EmployeePage
    } catch (err) {
      console.error(err);
      setError("Failed to add employee. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Add New Employee</h2>
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2"
            required
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2"
            required
          >
            <option value="">Select Role</option>
            <option value="HR_MANAGER">HR Manager</option>
            <option value="DELIVERY_MANAGER">Delivery Manager</option>
            <option value="DELIVERY_PERSON">Delivery Person</option>
            <option value="admin">admin</option>
          </select>
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2"
            required
          />
          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Add Employee
            </button>
            <button
              type="button"
              onClick={() => navigate("/employee")}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewEmployee;
