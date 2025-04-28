import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header"; // (You forgot this import, I added it!)
import { useNavigate } from "react-router-dom";

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
      setSelectedEmployee(data.employees);
    } catch (err) {
      console.error(err);
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
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Manage Employees</h2>
            <button 
              onClick={handleAddEmployee} 
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
            >
              <i className="fa fa-plus"></i> Add Employee
            </button>
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4 flex items-center gap-2">
              <i className="fa fa-exclamation-circle"></i> {error}
            </div>
          )}

          <div className="mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search by Employee ID"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="border border-gray-300 rounded px-4 py-2 w-full"
              />
              <button 
                onClick={handleSearch}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                Search
              </button>
            </div>
          </div>

          {isEditing && (
            <div className="bg-white p-6 rounded shadow mb-6">
              <h3 className="text-xl font-semibold mb-4">Edit Employee</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-gray-600">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded px-4 py-2 w-full"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-gray-600">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded px-4 py-2 w-full"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-gray-600">Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded px-4 py-2 w-full"
                  >
                    <option value="">Select Role</option>
                    <option value="HR_MANAGER">HR Manager</option>
                    <option value="DELIVERY_MANAGER">Delivery Manager</option>
                    <option value="DELIVERY_PERSON">Delivery Person</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-gray-600">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded px-4 py-2 w-full"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleUpdateClick}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  <i className="fa fa-save mr-1"></i> Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                >
                  <i className="fa fa-times mr-1"></i> Cancel
                </button>
              </div>
            </div>
          )}

          <div className="bg-white p-6 rounded shadow">
            {loading ? (
              <div className="flex flex-col items-center py-10">
                <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
                <p className="text-gray-600">Loading employees...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                    <tr>
                      <th className="py-3 px-6 text-left">S No</th>
                      <th className="py-3 px-6 text-left">Name</th>
                      <th className="py-3 px-6 text-left">Email</th>
                      <th className="py-3 px-6 text-left">Role</th>
                      <th className="py-3 px-6 text-left">Age</th>
                      <th className="py-3 px-6 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 text-sm font-light">
                    {employees.length > 0 ? (
                      employees.map((emp, index) => (
                        <tr key={emp._id} className="border-b border-gray-200 hover:bg-gray-100">
                          <td className="py-3 px-6">{index + 1}</td>
                          <td className="py-3 px-6">{emp.name}</td>
                          <td className="py-3 px-6">{emp.email}</td>
                          <td className="py-3 px-6">{emp.role}</td>
                          <td className="py-3 px-6">{emp.age}</td>
                          <td className="py-3 px-6 text-center flex justify-center gap-2">
                            <button onClick={() => handleView(emp._id)} className="text-blue-500 hover:text-blue-700">
                              <i className="fa fa-eye"></i>
                            </button>
                            <button onClick={() => handleEditClick(emp)} className="text-green-500 hover:text-green-700">
                              <i className="fa fa-pencil"></i>
                            </button>
                            <button onClick={() => handleDeleteClick(emp._id)} className="text-red-500 hover:text-red-700">
                              <i className="fa fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center py-10">
                          <i className="fa fa-folder-open text-4xl text-gray-400 mb-2"></i>
                          <p>No employees found</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {selectedEmployee && !isEditing && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
              <div className="bg-white p-8 rounded-lg shadow-lg w-96 relative">
                <button 
                  onClick={() => setSelectedEmployee(null)} 
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                >
                  <i className="fa fa-times"></i>
                </button>
                <div className="text-center">
                  <div className="bg-blue-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                    {selectedEmployee.name.charAt(0)}
                  </div>
                  <h3 className="text-xl font-semibold">{selectedEmployee.name}</h3>
                  <p className="text-gray-600">{selectedEmployee.email}</p>
                  <p className="text-gray-600">{selectedEmployee.role}</p>
                  <p className="text-gray-600">{selectedEmployee.age} years old</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default EmployeePage;
