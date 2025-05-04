import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { leaveService } from "../services/api";

const Leave = () => {
  const [searchName, setSearchName] = useState("");
  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    leaveType: "",
    department: "",
    position: "",
    status: ""
  });

  const [statusCounts, setStatusCounts] = useState({
    Approved: 0,
    Rejected: 0,
    Pending: 0
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchLeaves();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchName, leaves]);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const data = await leaveService.getAllLeaves();
      console.log('Fetched leaves:', data);  // Debugging line to log API response
      setLeaves(data.leaves);
      setFilteredLeaves(data.leaves);
      countStatuses(data.leaves);
      setError(null);
    } catch (err) {
      setError("Failed to fetch leave records. Please try again.");
      console.error(err);  // Log the error for more details
    } finally {
      setLoading(false);
    }
  };

  const countStatuses = (leavesList) => {
    const counts = { Approved: 0, Rejected: 0, Pending: 0 };
    leavesList.forEach((leave) => {
      if (counts[leave.status] !== undefined) {
        counts[leave.status]++;
      }
    });
    setStatusCounts(counts);
  };

  const handleSearch = () => {
    if (!searchName.trim()) {
      setFilteredLeaves(leaves);
      countStatuses(leaves);
    } else {
      const filtered = leaves.filter((leave) =>
        leave.name.toLowerCase().includes(searchName.trim().toLowerCase())
      );
      setFilteredLeaves(filtered);
      countStatuses(filtered);
    }
  };

  const handleAddLeave = () => navigate("/addleave");

  const handleEditClick = (leave) => {
    setIsEditing(true);
    setFormData({
      name: leave.name || "",
      leaveType: leave.leaveType || "",
      department: leave.department || "",
      position: leave.position || "",
      status: leave.status || ""
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

  const handleViewClick = (leave) => setSelectedLeave(leave);

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
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</div>
        )}

        <div className="flex items-center gap-2 mb-6">
          <input
            type="text"
            placeholder="Search By Employee Name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            onClick={handleSearch}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
          >
            Search
          </button>
        </div>

        {/* Status Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow">
            <p className="font-semibold text-lg">Approved</p>
            <p className="text-2xl">{statusCounts.Approved}</p>
          </div>
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow">
            <p className="font-semibold text-lg">Rejected</p>
            <p className="text-2xl">{statusCounts.Rejected}</p>
          </div>
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded shadow">
            <p className="font-semibold text-lg">Pending</p>
            <p className="text-2xl">{statusCounts.Pending}</p>
          </div>
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
                  <th className="px-6 py-3 text-center font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeaves.length > 0 ? (
                  filteredLeaves.map((leave) => (
                    <tr key={leave._id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4">{leave.empId}</td>
                      <td className="px-6 py-4">{leave.name}</td>
                      <td className="px-6 py-4">{leave.leaveType}</td>
                      <td className="px-6 py-4">{leave.department}</td>
                      <td className="px-6 py-4">{leave.position}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-sm font-medium ${leave.status === "Approved"
                              ? "bg-green-100 text-green-700"
                              : leave.status === "Rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                            }`}
                        >
                          {leave.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex justify-center gap-2">
                        <button
                          onClick={() => handleViewClick(leave)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEditClick(leave)}
                          className="text-green-600 hover:text-green-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(leave._id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-6 text-gray-500">
                      No leave records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {selectedLeave && !isEditing && (
          <div className="mt-6 bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Leave Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block mb-1">Emp ID</label><p>{selectedLeave.empId}</p></div>
              <div><label className="block mb-1">Name</label><p>{selectedLeave.name}</p></div>
              <div><label className="block mb-1">Leave Type</label><p>{selectedLeave.leaveType}</p></div>
              <div><label className="block mb-1">Department</label><p>{selectedLeave.department}</p></div>
              <div><label className="block mb-1">Position</label><p>{selectedLeave.position}</p></div>
              <div><label className="block mb-1">Status</label><p>{selectedLeave.status}</p></div>
            </div>
          </div>
        )}

        {isEditing && (
          <div className="mt-6 bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Edit Leave</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full border rounded px-3 py-2" placeholder="Name" />
              <input type="text" name="leaveType" value={formData.leaveType} onChange={handleInputChange} className="w-full border rounded px-3 py-2" placeholder="Leave Type" />
              <input type="text" name="department" value={formData.department} onChange={handleInputChange} className="w-full border rounded px-3 py-2" placeholder="Department" />
              <select name="position" value={formData.position} onChange={handleInputChange} className="w-full border rounded px-3 py-2">
                <option value="">Select Position</option>
                <option value="HR_MANAGER">HR Manager</option>
                <option value="DELIVERY_MANAGER">Delivery Manager</option>
                <option value="DELIVERY_PERSON">Delivery Person</option>
                <option value="admin">Admin</option>
              </select>
              <select name="status" value={formData.status} onChange={handleInputChange} className="w-full border rounded px-3 py-2">
                <option value="">Select Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div className="flex justify-end mt-4 gap-2">
              <button onClick={handleUpdateClick} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Save</button>
              <button onClick={() => setIsEditing(false)} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leave;
