import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { salaryService } from "../services/api";

const Salary = () => {
  const [searchName, setSearchName] = useState("");
  const [salaries, setSalaries] = useState([]);
  const [filteredSalaries, setFilteredSalaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSalary, setSelectedSalary] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    empId: "",
    department: "",
    position: "",
    baseSalary: "",
    bonus: "",
    totalSalary: ""
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/employeelogin');
    }
    fetchSalaries();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchName, salaries]);

  const fetchSalaries = async () => {
    try {
      setLoading(true);
      const data = await salaryService.getAllSalaries();
      setSalaries(data.salaries);
      setFilteredSalaries(data.salaries);
      setError(null);
    } catch (err) {
      setError("Failed to fetch salary records. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchName.trim()) {
      setFilteredSalaries(salaries);
    } else {
      const filtered = salaries.filter((salary) =>
        salary.name.toLowerCase().includes(searchName.trim().toLowerCase())
      );
      setFilteredSalaries(filtered);
    }
  };

  const handleEditClick = (salary) => {
    setIsEditing(true);
    setFormData({
      name: salary.name || "",
      empId: salary.empId || "",
      department: salary.department || "",
      position: salary.position || "",
      baseSalary: salary.baseSalary || "",
      bonus: salary.bonus || "",
      totalSalary: salary.totalSalary || ""
    });
    setSelectedSalary(salary);
  };

  const handleUpdateClick = async () => {
    if (!selectedSalary) return;
    try {
      setLoading(true);
      await salaryService.updateSalary(selectedSalary._id, formData);
      setIsEditing(false);
      setSelectedSalary(null);
      fetchSalaries();
    } catch (err) {
      setError("Failed to update salary record.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this salary record?")) {
      try {
        setLoading(true);
        await salaryService.deleteSalary(id);
        fetchSalaries();
      } catch (err) {
        setError("Failed to delete salary record.");
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
        <h1 className="text-2xl font-bold mb-6">Manage Salaries</h1>

        {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</div>}

        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Search By Employee Name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2"
          />
          <button onClick={handleSearch} className="bg-indigo-600 text-white px-4 py-2 rounded">
            Search
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading salary records...</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded shadow">
            <table className="min-w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-6 py-3">Emp ID</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Department</th>
                  <th className="px-6 py-3">Position</th>
                  <th className="px-6 py-3">Base Salary</th>
                  <th className="px-6 py-3">Bonus</th>
                  <th className="px-6 py-3">Total Salary</th>
                  <th className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSalaries.length > 0 ? (
                  filteredSalaries.map((salary) => (
                    <tr key={salary._id} className="border-b">
                      <td className="px-6 py-4">{salary.empId}</td>
                      <td className="px-6 py-4">{salary.name}</td>
                      <td className="px-6 py-4">{salary.department}</td>
                      <td className="px-6 py-4">{salary.position}</td>
                      <td className="px-6 py-4">{salary.baseSalary}</td>
                      <td className="px-6 py-4">{salary.bonus}</td>
                      <td className="px-6 py-4">{salary.totalSalary}</td>
                      <td className="px-6 py-4 text-center flex gap-2 justify-center">
                        <button onClick={() => handleEditClick(salary)} className="text-green-600">Edit</button>
                        <button onClick={() => handleDeleteClick(salary._id)} className="text-red-600">Delete</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-6 text-gray-500">No salary records found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {isEditing && (
          <div className="mt-6 bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Edit Salary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="name" value={formData.name} onChange={handleInputChange} className="border rounded px-3 py-2" placeholder="Name" />
              <input name="empId" value={formData.empId} onChange={handleInputChange} className="border rounded px-3 py-2" placeholder="Emp ID" />
              <input name="department" value={formData.department} onChange={handleInputChange} className="border rounded px-3 py-2" placeholder="Department" />
              <input name="position" value={formData.position} onChange={handleInputChange} className="border rounded px-3 py-2" placeholder="Position" />
              <input name="baseSalary" value={formData.baseSalary} onChange={handleInputChange} className="border rounded px-3 py-2" placeholder="Base Salary" />
              <input name="bonus" value={formData.bonus} onChange={handleInputChange} className="border rounded px-3 py-2" placeholder="Bonus" />
              <input name="totalSalary" value={formData.totalSalary} onChange={handleInputChange} className="border rounded px-3 py-2" placeholder="Total Salary" />
            </div>
            <div className="flex justify-end mt-4 gap-2">
              <button onClick={handleUpdateClick} className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
              <button onClick={() => setIsEditing(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Salary;
