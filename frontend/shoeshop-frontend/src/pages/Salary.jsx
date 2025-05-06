import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import axios from "axios"; // Make sure axios is imported

const API_URL = "http://localhost:5000"; // Define API_URL

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
    baseSalary: "",
    overtimeHours: "",
    bonus: "",
    totalSalary: "",
    position: ""
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
      // Make direct API call instead of using service
      const response = await axios.get(`${API_URL}/api/salary`);
      
      // Extract salaries data regardless of the format returned
      let salaryData = [];
      if (Array.isArray(response.data)) {
        salaryData = response.data;
      } else if (response.data.records && Array.isArray(response.data.records)) {
        salaryData = response.data.records;
      } else if (response.data.salaries && Array.isArray(response.data.salaries)) {
        salaryData = response.data.salaries;
      } else if (typeof response.data === 'object') {
        // Last resort - check if there are any array properties
        for (const key in response.data) {
          if (Array.isArray(response.data[key])) {
            salaryData = response.data[key];
            break;
          }
        }
      }
      
      // If we still have no data, create a sample record for display
      if (!salaryData || salaryData.length === 0) {
        // Add sample data for testing
        salaryData = [
          {
            _id: "sample1",
            name: "John Doe",
            baseSalary: 50000,
            overtimeHours: 10,
            bonus: 2000,
            totalSalary: 52000,
            position: "HR_MANAGER"
          },
          {
            _id: "sample2",
            name: "Jane Smith",
            baseSalary: 45000,
            overtimeHours: 5,
            bonus: 1500,
            totalSalary: 46500,
            position: "DELIVERY_MANAGER"
          }
        ];
        setError("Using sample data for display. Backend may not be properly connected.");
      }
      
      setSalaries(salaryData);
      setFilteredSalaries(salaryData);
      setError(null);
    } catch (err) {
      console.error("Error fetching salaries:", err);
      // Add sample data for display when error occurs
      const sampleData = [
        {
          _id: "sample1",
          name: "John Doe",
          baseSalary: 50000,
          overtimeHours: 10,
          bonus: 2000,
          totalSalary: 52000,
          position: "HR_MANAGER"
        },
        {
          _id: "sample2",
          name: "Jane Smith",
          baseSalary: 45000,
          overtimeHours: 5,
          bonus: 1500,
          totalSalary: 46500,
          position: "DELIVERY_MANAGER"
        }
      ];
      setSalaries(sampleData);
      setFilteredSalaries(sampleData);
      setError("Failed to fetch salary records. Using sample data for display.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchName.trim()) {
      setFilteredSalaries(salaries);
    } else {
      const filtered = salaries.filter((salary) =>
        salary && salary.name && salary.name.toLowerCase().includes(searchName.trim().toLowerCase())
      );
      setFilteredSalaries(filtered);
    }
  };

  const handleAddSalary = () => navigate("/AddSalary");

  const handleEditClick = (salary) => {
    setIsEditing(true);
    setFormData({
      name: salary.name || "",
      baseSalary: salary.baseSalary || "",
      overtimeHours: salary.overtimeHours || "",
      bonus: salary.bonus || "",
      totalSalary: salary.totalSalary || "",
      position: salary.position || ""
    });
    setSelectedSalary(salary);
  };

  const handleUpdateClick = async () => {
    if (!selectedSalary) return;
    try {
      setLoading(true);
      await axios.put(`${API_URL}/api/salary/${selectedSalary._id}`, formData);
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
        await axios.delete(`${API_URL}/api/salary/${id}`);
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

  const handleViewClick = (salary) => setSelectedSalary(salary);

  return (
    <div className="flex flex-1">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manage Salaries</h1>
          <button
            onClick={handleAddSalary}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            <i className="fa fa-plus mr-2"></i>Add New Salary
          </button>
        </div>

        {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</div>}

        <div className="mb-6 flex items-center gap-2">
          <input
            type="text"
            placeholder="Search By Name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="border px-4 py-2 rounded focus:outline-none"
          />
          <button
            onClick={handleSearch}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Search
          </button>
        </div>

        {loading ? (
          <div className="text-center text-gray-500">Loading salary records...</div>
        ) : (
          <div className="overflow-x-auto bg-white rounded shadow">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left">Name</th>
                  <th className="px-6 py-3 text-left">Base Salary</th>
                  <th className="px-6 py-3 text-left">Overtime Hours</th>
                  <th className="px-6 py-3 text-left">Bonus</th>
                  <th className="px-6 py-3 text-left">Total Salary</th>
                  <th className="px-6 py-3 text-left">Position</th>
                  <th className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSalaries && filteredSalaries.length > 0 ? (
                  filteredSalaries.map((salary) => (
                    <tr key={salary._id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4">{salary.name}</td>
                      <td className="px-6 py-4">{salary.baseSalary}</td>
                      <td className="px-6 py-4">{salary.overtimeHours}</td>
                      <td className="px-6 py-4">{salary.bonus}</td>
                      <td className="px-6 py-4">{salary.totalSalary}</td>
                      <td className="px-6 py-4">{salary.position}</td>
                      <td className="px-6 py-4 flex justify-center gap-2">
                        <button onClick={() => handleViewClick(salary)} className="text-blue-600">View</button>
                        <button onClick={() => handleEditClick(salary)} className="text-green-600">Edit</button>
                        <button onClick={() => handleDeleteClick(salary._id)} className="text-red-600">Delete</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-6 text-gray-500">No salary records found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {selectedSalary && !isEditing && (
          <div className="mt-6 bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Salary Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label>Name</label><p>{selectedSalary.name}</p></div>
              <div><label>Base Salary</label><p>{selectedSalary.baseSalary}</p></div>
              <div><label>Overtime Hours</label><p>{selectedSalary.overtimeHours}</p></div>
              <div><label>Bonus</label><p>{selectedSalary.bonus}</p></div>
              <div><label>Total Salary</label><p>{selectedSalary.totalSalary}</p></div>
              <div><label>Position</label><p>{selectedSalary.position}</p></div>
            </div>
          </div>
        )}

        {isEditing && (
          <div className="mt-6 bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Edit Salary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Name" className="border px-3 py-2 rounded" />
              <input type="number" name="baseSalary" value={formData.baseSalary} onChange={handleInputChange} placeholder="Base Salary" className="border px-3 py-2 rounded" />
              <input type="number" name="overtimeHours" value={formData.overtimeHours} onChange={handleInputChange} placeholder="Overtime Hours" className="border px-3 py-2 rounded" />
              <input type="number" name="bonus" value={formData.bonus} onChange={handleInputChange} placeholder="Bonus" className="border px-3 py-2 rounded" />
              <input type="number" name="totalSalary" value={formData.totalSalary} onChange={handleInputChange} placeholder="Total Salary" className="border px-3 py-2 rounded" />
              <select name="position" value={formData.position} onChange={handleInputChange} className="border px-3 py-2 rounded">
                <option value="">Select Position</option>
                <option value="HR_MANAGER">HR Manager</option>
                <option value="DELIVERY_MANAGER">Delivery Manager</option>
                <option value="DELIVERY_PERSON">Delivery Person</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 mt-4">
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