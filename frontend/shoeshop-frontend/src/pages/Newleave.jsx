import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { leaveService } from "../services/api";

const NewLeave = () => {
  const [formData, setFormData] = useState({
    empId: "",
    name: "",
    department: "",
    position: "",
    leaveType: "",
    status: "Pending"
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await leaveService.createLeave(formData);
      setSuccess("Leave added successfully!");
      setTimeout(() => navigate("/leave"), 1500);
    } catch (err) {
      console.error(err);
      setError("Failed to add leave. Please try again.");
    }
  };

  return (
    <div className="flex flex-1">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Add New Leave</h1>

        {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4">{success}</div>}

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="empId"
              placeholder="Employee ID"
              value={formData.empId}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
              required
            />
            <input
              type="text"
              name="name"
              placeholder="Employee Name"
              value={formData.name}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
              required
            />
            <input
              type="text"
              name="department"
              placeholder="Department"
              value={formData.department}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
              required
            />
            <select
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
              required
            >
              <option value="">Select Position</option>
              <option value="HR_MANAGER">HR Manager</option>
              <option value="DELIVERY_MANAGER">Delivery Manager</option>
              <option value="DELIVERY_PERSON">Delivery Person</option>
              <option value="admin">Admin</option>
            </select>
            <input
              type="text"
              name="leaveType"
              placeholder="Leave Type"
              value={formData.leaveType}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
              required
            />
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Submit Leave
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewLeave;
