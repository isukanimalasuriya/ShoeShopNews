// EmployeeLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const employees = [
  { id: 1, name: "Alice", role: "Manager", leaveBalance: 10, salary: 4000, performance: "Excellent" },
  { id: 2, name: "Bob", role: "Sales", leaveBalance: 5, salary: 3000, performance: "Good" },
  { id: 3, name: "Charlie", role: "Support", leaveBalance: 8, salary: 3500, performance: "Very Good" },
];

const EmployeeOT= () => {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState("");

  const handleLogin = () => {
    const employee = employees.find(emp => emp.id === parseInt(selectedId));
    if (employee) {
      localStorage.setItem("employee", JSON.stringify(employee));
      navigate("/dashboard");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4">Select Employee</h2>
        <select
          className="border p-2 mb-4 w-full"
          value={selectedId}
          onChange={e => setSelectedId(e.target.value)}
        >
          <option value="">-- Choose Employee --</option>
          {employees.map(emp => (
            <option key={emp.id} value={emp.id}>
              {emp.name} - {emp.role}
            </option>
          ))}
        </select>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          onClick={handleLogin}
          disabled={!selectedId}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default EmployeeOT;
