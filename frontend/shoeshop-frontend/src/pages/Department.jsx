import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Sidebar from "./Sidebar";

const Department = () => {
  const [departments, setDepartments] = useState([
    { id: 1, name: "HR", type: "HR" },
    { id: 2, name: "Deliver", type: "deliver_person" },
    { id: 3, name: "Admin", type: "admin" },
    { id: 4, name: "Deliver", type: "deliver_manager" },
    { id: 5, name: "HR", type: "hrmanager" },
    { id: 6, name: "Admin", type: "admin" },
    { id: 7, name: "HR", type: "HR" },
  ]);

  const [newDepartment, setNewDepartment] = useState("");
  const [newDepartmentType, setNewDepartmentType] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/employeelogin');
    }
  }, []);

  const addDepartment = () => {
    if (newDepartment.trim() === "" || newDepartmentType.trim() === "") return;
    setDepartments([
      ...departments,
      {
        id: departments.length > 0 ? departments[departments.length - 1].id + 1 : 1,
        name: newDepartment,
        type: newDepartmentType,
      },
    ]);
    setNewDepartment("");
    setNewDepartmentType("");
  };

  const deleteDepartment = (id) => {
    setDepartments(departments.filter((dept) => dept.id !== id));
  };

  const getDepartmentCountsByType = () => {
    const counts = {};
    departments.forEach((dept) => {
      const type = dept.type.toLowerCase();
      counts[type] = (counts[type] || 0) + 1;
    });
    return counts;
  };

  const departmentTypeCounts = getDepartmentCountsByType();

  // Define colors for each type
  const typeColors = {
    sales: "bg-blue-100 text-blue-800",
    deliver_person: "bg-green-100 text-green-800",
    user: "bg-yellow-100 text-yellow-800",
    deliver_manager: "bg-purple-100 text-purple-800",
    hrmanager: "bg-pink-100 text-pink-800",
    admin: "bg-red-100 text-red-800",
    hr: "bg-indigo-100 text-indigo-800",
    default: "bg-gray-100 text-gray-800"
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Departments</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {Object.entries(departmentTypeCounts).map(([type, count]) => (
            <div
              key={type}
              className={`rounded-xl p-4 flex justify-between items-center shadow-md hover:shadow-lg transition 
                ${typeColors[type] || typeColors.default}`}
            >
              <div className="capitalize text-lg font-semibold">{type.replace("_", " ")}</div>
              <div className="font-bold text-2xl">{count}</div>
            </div>
          ))}
        </div>

        {/* Add Department */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="New Department"
            value={newDepartment}
            onChange={(e) => setNewDepartment(e.target.value)}
            className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            placeholder="Department Type"
            value={newDepartmentType}
            onChange={(e) => setNewDepartmentType(e.target.value)}
            className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={addDepartment}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Add Department
          </button>
        </div>

        {/* Department Table */}
        <div className="overflow-x-auto bg-white rounded-xl shadow-md">
          <table className="w-full table-auto text-sm">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">S No</th>
                <th className="px-4 py-3 text-left">Department</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((dept, index) => (
                <tr key={dept.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3 capitalize">{dept.name}</td>
                  <td className="px-4 py-3 capitalize">{dept.type}</td>
                  <td className="px-4 py-3 text-green-600 font-medium">Active</td>
                  <td className="px-4 py-3 flex gap-2 justify-center">
                    <button className="text-blue-600 hover:underline">View</button>
                    <button className="text-yellow-600 hover:underline">Edit</button>
                    <button
                      onClick={() => deleteDepartment(dept.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default Department;
