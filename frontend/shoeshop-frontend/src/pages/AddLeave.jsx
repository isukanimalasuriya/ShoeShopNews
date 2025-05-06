import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { leaveService } from "../services/api";

const AddLeave = () => {
  const [formData, setFormData] = useState({
    empId: "",
    name: "",
    leaveType: "",
    department: "",
    position: "",
    status: "Pending",
  });

  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await leaveService.createLeave(formData);
      setSuccessMsg("Leave record created successfully!");
      setTimeout(() => navigate("/leaves"), 1000);
    } catch (err) {
      setError("Failed to create leave record. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Add New Leave</h1>

        {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</div>}
        {successMsg && <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4">{successMsg}</div>}

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Emp ID</label>
            <input
              type="text"
              name="empId"
              value={formData.empId}
              onChange={handleInputChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-1">Leave Type</label>
            <input
              type="text"
              name="leaveType"
              value={formData.leaveType}
              onChange={handleInputChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-1">Department</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-1">Position</label>
            <select
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              required
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select Position</option>
              <option value="HR_MANAGER">HR Manager</option>
              <option value="DELIVERY_MANAGER">Delivery Manager</option>
              <option value="DELIVERY_PERSON">Delivery Person</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">Status</label>
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

          <div className="md:col-span-2 flex justify-end mt-4 gap-2">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={() => navigate("/leaves")}
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

export default AddLeave;
