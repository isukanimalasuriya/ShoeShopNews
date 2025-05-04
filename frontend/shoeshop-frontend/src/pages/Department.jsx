import React, { useState } from "react";

import Sidebar from "./Sidebar";

const Department = () => {
  const [departments, setDepartments] = useState([
    { id: 1, name: "HR", type: "sales" },
    { id: 2, name: "Deliver", type: "deliver_person" },
    { id: 3, name: "admin", type: "user" },
    { id: 4, name: "Deliver", type: "deliver_manager" },
    { id: 5, name: "HR", type: "hrmanager" },
  ]);
  const [newDepartment, setNewDepartment] = useState("");
  const [newDepartmentType, setNewDepartmentType] = useState("");

  const addDepartment = () => {
    if (newDepartment.trim() === "" || newDepartmentType.trim() === "") return;
    setDepartments([
      ...departments,
      {
        id: departments.length + 1,
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

  return (
    
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-4">Manage Departments</h1>

          <div className="flex items-center gap-4 mb-4">
            <input
              type="text"
              placeholder="Search by Department"
              className="border border-gray-300 rounded px-3 py-1"
            />
            <div className="flex gap-2">
              <button className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600">
                Active
              </button>
              <button className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600">
                Inactive
              </button>
            </div>
          </div>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="New Department"
              value={newDepartment}
              onChange={(e) => setNewDepartment(e.target.value)}
              className="border px-3 py-1 rounded"
            />
            <input
              type="text"
              placeholder="Department Type"
              value={newDepartmentType}
              onChange={(e) => setNewDepartmentType(e.target.value)}
              className="border px-3 py-1 rounded"
            />
            <button
              onClick={addDepartment}
              className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
            >
              Add New Department
            </button>
          </div>

          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">S No</th>
                <th className="border px-4 py-2">Department</th>
                <th className="border px-4 py-2">Type</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((dept, index) => (
                <tr key={dept.id}>
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{dept.name}</td>
                  <td className="border px-4 py-2">{dept.type}</td>
                  <td className="border px-4 py-2">Active</td>
                 
                  <td className="border px-4 py-2 flex gap-2 justify-center">
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
  
  );
};

export default Department;
