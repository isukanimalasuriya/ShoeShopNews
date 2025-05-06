import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmSidebar from "./EmSidebar";
import { leaveService } from "../services/api";

const ApplyLeave = () => {
  const [formData, setFormData] = useState({
    name: "",
    leaveType: "",
    department: "",
    position: "",
    status: "Pending",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await leaveService.addLeave(formData);
      setSuccess("Leave added successfully!");
      setError(null);
      setFormData({
        name: "",
        leaveType: "",
        department: "",
        position: "",
        status: "Pending",
      });
    } catch (err) {
      setError("Failed to add leave record.");
      setSuccess(null);
      console.error(err);
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
        const token = localStorage.getItem('token');
            if (!token) {
              navigate('/employeelogin'); // Redirect if no token found
            }

            const employeeData = localStorage.getItem("employee");
    if (employeeData) {
      try {
        const parsedEmployee = JSON.parse(employeeData);
        setFormData((prev) => ({
          ...prev,
          name: parsedEmployee.name || "",
          position: parsedEmployee.role || "",
          department: parsedEmployee.department || "",
        }));
      } catch (err) {
        console.error("Failed to parse employee data:", err);
      }
    }
    }, [navigate]);

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <EmSidebar />
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-semibold text-gray-800 mb-6 border-b pb-4">
            Apply for Leave
          </h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employee Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                readOnly
                onChange={handleInputChange}
                placeholder="Enter your name"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
              <input
                type="text"
                name="leaveType"
                value={formData.leaveType}
                onChange={handleInputChange}
                placeholder="Sick, Casual, Annual..."
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                placeholder="Department"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
              <input
                name="position"
                value={formData.position}
                readOnly
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
              </input>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </form>

          <div className="flex justify-end gap-4 mt-8">
            <button
              type="submit"
              onClick={handleSubmit}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 rounded-lg shadow-md transition"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={() =>
                setFormData({
                  name: "",
                  leaveType: "",
                  department: "",
                  position: "",
                  status: "Pending",
                })
              }
              className="bg-gray-400 hover:bg-gray-500 text-white font-medium px-6 py-2 rounded-lg shadow-md transition"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyLeave;
