import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { leaveService } from "../services/api";

const Applyleave = () => {
  const [formData, setFormData] = useState({
    name: "",
    leaveType: "",
    department: "",
    position: "",
    status: "Pending"
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await leaveService.addLeave(formData);
      navigate("/leaves");
    } catch (err) {
      setError("Failed to add leave record.");
      console.error(err);
    }
  };

  useEffect(() => {
        const token = localStorage.getItem('token');
            if (!token) {
              navigate('/employeelogin'); // Redirect if no token found
            }
    }, [navigate]);

  return (
    <div className="flex flex-1">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Leave</h1>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              placeholder="Employee Name"
              required
            />
            <input
              type="text"
              name="leaveType"
              value={formData.leaveType}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              placeholder="Leave Type"
              required
            />
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              placeholder="Department"
              required
            />
            <select
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Select Position</option>
              <option value="HR_MANAGER">HR Manager</option>
              <option value="DELIVERY_MANAGER">Delivery Manager</option>
              <option value="DELIVERY_PERSON">Delivery Person</option>
              <option value="admin">Admin</option>
            </select>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="flex justify-end mt-4 gap-2">
            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
              Save
            </button>
            <button onClick={() => navigate("/leave")} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Applyleave;
