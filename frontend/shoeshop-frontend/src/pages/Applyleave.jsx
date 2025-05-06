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
  const [employeeLeaves, setEmployeeLeaves] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // Fetch employee's leaves
  const fetchEmployeeLeaves = async (employeeName) => {
    try {
      setIsLoading(true);
      const response = await leaveService.getAllLeaves();
      // Filter leaves to only show the current employee's leaves
      const filteredLeaves = response.leaves.filter(leave => leave.name === employeeName);
      setEmployeeLeaves(filteredLeaves);
    } catch (err) {
      console.error("Failed to fetch leaves:", err);
      setError("Failed to load leave records");
    } finally {
      setIsLoading(false);
    }
  };

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
      // Reset form
      setFormData({
        ...formData,
        leaveType: "",
        status: "Pending",
      });
      // Refresh the leave list
      fetchEmployeeLeaves(formData.name);
    } catch (err) {
      setError("Failed to add leave record.");
      setSuccess(null);
      console.error(err);
    }
  };

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
        
        // Fetch leaves for this employee
        if (parsedEmployee.name) {
          fetchEmployeeLeaves(parsedEmployee.name);
        }
      } catch (err) {
        console.error("Failed to parse employee data:", err);
      }
    }
  }, [navigate]);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <EmSidebar />
      <div className="flex-1 p-8">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8">
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
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                disabled
              >
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div className="md:col-span-2 flex justify-end gap-4 mt-4">
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 rounded-lg shadow-md transition"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    leaveType: "",
                    status: "Pending",
                  })
                }
                className="bg-gray-400 hover:bg-gray-500 text-white font-medium px-6 py-2 rounded-lg shadow-md transition"
              >
                Clear
              </button>
            </div>
          </form>

          {/* My Leave Applications Section */}
          <div className="mt-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-4">
              My Leave Applications
            </h2>
            
            {isLoading ? (
              <div className="text-center py-4">
                <p className="text-gray-600">Loading leave records...</p>
              </div>
            ) : employeeLeaves.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Leave Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date Applied
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {employeeLeaves.map((leave) => (
                      <tr key={leave._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {leave.leaveType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {leave.department}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(leave.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${leave.status === "Approved" ? "bg-green-100 text-green-800" : 
                                leave.status === "Rejected" ? "bg-red-100 text-red-800" : 
                                "bg-yellow-100 text-yellow-800"}`}
                          >
                            {leave.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No leave applications found. Apply for a leave above.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyLeave;