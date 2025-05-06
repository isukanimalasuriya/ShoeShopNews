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
  const [validationErrors, setValidationErrors] = useState({});

  const validate = () => {
    const errors = {};
    if (!formData.name.trim() || formData.name.length < 2) {
      errors.name = "Name must be at least 2 characters.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = "Invalid email format.";
    }

    if (!formData.password || formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }

    if (!formData.role) {
      errors.role = "Role is required.";
    }

    if (!/^\d+$/.test(formData.age)) {
      errors.age = "Age must be a valid integer.";
    } else if (parseInt(formData.age, 10) < 18) {
      errors.age = "Age must be at least 18.";
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setValidationErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      await userService.addEmployees(formData);
      navigate("/employee");
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
          <div>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded px-4 py-2"
              required
            />
            {validationErrors.name && <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>}
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded px-4 py-2"
              required
            />
            {validationErrors.email && <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>}
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border rounded px-4 py-2"
              required
            />
            {validationErrors.password && <p className="text-red-500 text-sm mt-1">{validationErrors.password}</p>}
          </div>

          <div>
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
              <option value="admin">Admin</option>
              <option value="FINANCE_MANAGER">Finance Manager</option>
            </select>
            {validationErrors.role && <p className="text-red-500 text-sm mt-1">{validationErrors.role}</p>}
          </div>

          <div>
            <input
              type="number"
              name="age"
              placeholder="Age"
              value={formData.age}
              onChange={handleChange}
              className="w-full border rounded px-4 py-2"
              required
            />
            {validationErrors.age && <p className="text-red-500 text-sm mt-1">{validationErrors.age}</p>}
          </div>

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
