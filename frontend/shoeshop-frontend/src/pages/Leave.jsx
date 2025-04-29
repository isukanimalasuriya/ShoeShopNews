import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { userService } from "../services/api";

const Leave = () => {
  const [searchId, setSearchId] = useState("");
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    leaveType: "",
    department: "",
    position: "",
    status: ""
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const data = await leaveService.getAllLeaves();
      setLeaves(data.leaves);
      setError(null);
    } catch (err) {
      setError("Failed to fetch leave records. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLeave = () => {
    navigate("/add-leave");
  };

  const handleSearch = async () => {
    if (!searchId.trim()) {
      fetchLeaves();
      return;
    }

    try {
      setLoading(true);
      const data = await leaveService.getLeaveByEmpId(searchId);
      if (data.leaves) {
        setLeaves([data.leaves]);
      }
    } catch (err) {
      setError("Leave record not found");
      setLeaves([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (leave) => {
    setIsEditing(true);
    setFormData({
      leaveType: leave.leaveType,
      department: leave.department,
      position: leave.position,
      status: leave.status
    });
    setSelectedLeave(leave);
  };

  const handleUpdateClick = async () => {
    if (!selectedLeave) return;

    try {
      setLoading(true);
      await leaveService.updateLeave(selectedLeave._id, formData);
      setIsEditing(false);
      setSelectedLeave(null);
      fetchLeaves();
    } catch (err) {
      setError("Failed to update leave record.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this leave record?")) {
      try {
        setLoading(true);
        await leaveService.deleteLeave(id);
        fetchLeaves();
      } catch (err) {
        setError("Failed to delete leave record.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
   
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Manage Leaves</h1>
            <button
              onClick={handleAddLeave}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
            >
              <i className="fa fa-plus mr-2"></i> Add New Leave
            </button>
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
              {error}
            </div>
          )}

          <div className="flex items-center gap-4 mb-6">
            <input
              type="text"
              placeholder="Search By Emp ID"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
              onClick={handleSearch}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Search
            </button>
          </div>

          {loading ? (
            <div className="text-center text-gray-500">Loading leave records...</div>
          ) : (
            <div className="overflow-x-auto bg-white rounded shadow">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Emp ID</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Name</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Leave Type</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Department</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Position</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-3 text-center font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {leaves.length > 0 ? (
                    leaves.map((leave) => (
                      <tr key={leave._id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4">{leave.empId}</td>
                        <td className="px-6 py-4">{leave.name}</td>
                        <td className="px-6 py-4">{leave.leaveType}</td>
                        <td className="px-6 py-4">{leave.department}</td>
                        <td className="px-6 py-4">{leave.position}</td>
                        <td className={`px-6 py-4 capitalize`}>
                          <span className={`px-2 py-1 rounded-full text-sm font-medium ${leave.status === "Approved" ? "bg-green-100 text-green-700" : leave.status === "Rejected" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                            {leave.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 flex justify-center gap-2">
                          <button
                            className="text-blue-500 hover:text-blue-700"
                            onClick={() => setSelectedLeave(leave)}
                          >
                            <i className="fa fa-eye"></i>
                          </button>
                          <button
                            className="text-yellow-500 hover:text-yellow-700"
                            onClick={() => handleEditClick(leave)}
                          >
                            <i className="fa fa-pencil"></i>
                          </button>
                          <button
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDeleteClick(leave._id)}
                          >
                            <i className="fa fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-6 text-gray-500">
                        No leave records found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {isEditing && (
            <div className="mt-6 bg-white p-6 rounded shadow">
              <h2 className="text-xl font-bold mb-4">Edit Leave</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Leave Type</label>
                  <input
                    type="text"
                    name="leaveType"
                    value={formData.leaveType}
                    onChange={handleInputChange}
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
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block mb-1">Position</label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block mb-1">Status</label>
                  <input
                    type="text"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4 gap-2">
                <button
                  onClick={handleUpdateClick}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
  
  );
};

export default Leave;
