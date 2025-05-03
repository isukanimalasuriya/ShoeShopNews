import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import { userService } from "../services/api";

const EmployeePage = () => {
  const [searchId, setSearchId] = useState("");
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    age: ""
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllEmployees();
      setEmployees(data.employees);
      setError(null);
    } catch (err) {
      setError("Failed to fetch employees. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchId.trim()) {
      fetchEmployees();
      return;
    }
    try {
      setLoading(true);
      const data = await userService.getById(searchId);
      if (data.employees) {
        setEmployees([data.employees]);
      }
    } catch (err) {
      setError("Employee not found");
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = () => {
    navigate("/AddNewEmployee");
  };

  const handleView = async (id) => {
    try {
      const data = await userService.getById(id);
      const employee = data?.employee || data?.employees || data;
      if (employee) {
        setSelectedEmployee(employee);
      } else {
        setError("Employee details not found.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load employee details.");
    }
  };

  const handleEditClick = (employee) => {
    setIsEditing(true);
    setFormData({
      name: employee.name,
      email: employee.email,
      role: employee.role,
      age: employee.age
    });
    setSelectedEmployee(employee);
  };

  const handleUpdateClick = async () => {
    if (!selectedEmployee) return;
    try {
      setLoading(true);
      await userService.updateEmployee(selectedEmployee._id, formData);
      setIsEditing(false);
      setSelectedEmployee(null);
      fetchEmployees();
    } catch (err) {
      setError("Failed to update employee");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        setLoading(true);
        await userService.deleteEmployee(id);
        fetchEmployees();
      } catch (err) {
        setError("Failed to delete employee");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Manage Employees</h1>
          <button
            onClick={handleAddEmployee}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow"
          >
            <i className="fa fa-plus mr-2"></i> Add Employee
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="flex gap-4 mb-6">
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Search by Employee ID"
            className="flex-1 px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded shadow"
          >
            Search
          </button>
        </div>

        {isEditing && (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h3 className="text-2xl font-semibold mb-4">Edit Employee</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Name"
                className="border px-4 py-2 rounded w-full"
              />
              <input
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="border px-4 py-2 rounded w-full"
              />
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="border px-4 py-2 rounded w-full"
              >
                <option value="">Select Role</option>
                <option value="HR_MANAGER">HR Manager</option>
                <option value="DELIVERY_MANAGER">Delivery Manager</option>
                <option value="DELIVERY_PERSON">Delivery Person</option>
                <option value="admin">admin</option>
              </select>
              <input
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                placeholder="Age"
                className="border px-4 py-2 rounded w-full"
              />
            </div>
            <div className="mt-4 flex gap-4">
              <button
                onClick={handleUpdateClick}
                className="bg-blue-600 text-white px-6 py-2 rounded shadow"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-500 text-white px-6 py-2 rounded shadow"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-x-auto">
          {loading ? (
            <p className="p-4 text-center text-gray-500">Loading...</p>
          ) : (
            <table className="min-w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-3 px-4 text-left">#</th>
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Email</th>
                  <th className="py-3 px-4 text-left">Role</th>
                  <th className="py-3 px-4 text-left">Age</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.length ? (
                  employees.map((emp, index) => (
                    <tr key={emp._id} className="border-t hover:bg-gray-50">
                      <td className="py-3 px-4">{index + 1}</td>
                      <td className="py-3 px-4">{emp.name}</td>
                      <td className="py-3 px-4">{emp.email}</td>
                      <td className="py-3 px-4">{emp.role}</td>
                      <td className="py-3 px-4">{emp.age}</td>
                      <td className="py-3 px-4 text-center space-x-2">
                        <button
                          onClick={() => handleView(emp._id)}
                          className="text-blue-600 hover:underline"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEditClick(emp)}
                          className="text-green-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(emp._id)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-gray-500">
                      No employees found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* View Modal */}
        {selectedEmployee && !isEditing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white w-96 rounded-lg shadow-lg p-6 relative">
              <button
                onClick={() => setSelectedEmployee(null)}
                className="absolute top-2 right-2 text-gray-500 hover:text-black"
              >
                <i className="fa fa-times"></i>
              </button>
              <div className="text-center">
                <div className="w-20 h-20 mx-auto bg-blue-500 text-white text-3xl rounded-full flex items-center justify-center mb-4">
                  {selectedEmployee.name?.charAt(0)}
                </div>
                <h3 className="text-xl font-bold mb-2">{selectedEmployee.name}</h3>
                <p className="text-gray-700 mb-1"><strong>Email:</strong> {selectedEmployee.email}</p>
                <p className="text-gray-700 mb-1"><strong>Role:</strong> {selectedEmployee.role}</p>
                <p className="text-gray-700"><strong>Age:</strong> {selectedEmployee.age}</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default EmployeePage;
