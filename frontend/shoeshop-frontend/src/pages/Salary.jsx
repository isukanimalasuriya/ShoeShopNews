import React, { useState } from "react";
import Sidebar from "./Sidebar";

const Salary = () => {
  const [employees, setEmployees] = useState([
    { id: "1", name: "Mithun", baseSalary: "5", overtimeHours: "2", bonus: "4" },
    { id: "2", name: "Kaveesh", baseSalary: "3", overtimeHours: "3", bonus: "2" },
    { id: "3", name: "Mithun", baseSalary: "4", overtimeHours: "4", bonus: "1" },
    { id: "4", name: "Sandu", baseSalary: "3", overtimeHours: "5", bonus: "4" },
    { id: "3", name: "Latheesh", baseSalary: "5", overtimeHours: "3", bonus: "4" },
    { id: "3", name: "Sandu", baseSalary: "4", overtimeHours: "3", bonus: "5" },
    { id: "2", name: "lanki", baseSalary: "3", overtimeHours: "1", bonus: "2" },
  ]);

  const calculateTotalSalary = (base, overtime, bonus) => {
    const baseSalary = Number(base);
    const overtimeHours = Number(overtime);
    const bonusAmount = Number(bonus);
    const overtimePay = overtimeHours * 100;
    return baseSalary + overtimePay + bonusAmount;
  };

  const handleView = (id) => alert(`Viewing employee ID: ${id}`);
  const handleEdit = (id) => alert(`Editing employee ID: ${id}`);
  const handleDelete = (id) => {
    if (window.confirm("Are you sure?")) {
      setEmployees(employees.filter(emp => emp.id !== id));
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6 text-indigo-700">Salary Management</h1>
        <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-lg overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-indigo-600 text-white">
                <th className="py-3 px-4 text-left">Employee Name</th>
                <th className="py-3 px-4 text-left">Base Salary</th>
                <th className="py-3 px-4 text-left">Overtime Hours</th>
                <th className="py-3 px-4 text-left">Bonus</th>
                <th className="py-3 px-4 text-left">Total Salary</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{emp.name}</td>
                  <td className="py-2 px-4">${Number(emp.baseSalary).toLocaleString()}</td>
                  <td className="py-2 px-4">{emp.overtimeHours}</td>
                  <td className="py-2 px-4">${Number(emp.bonus).toLocaleString()}</td>
                  <td className="py-2 px-4">
                    ${calculateTotalSalary(emp.baseSalary, emp.overtimeHours, emp.bonus).toLocaleString()}
                  </td>
                  <td className="py-2 px-4 text-center space-x-2">
                    <button
                      onClick={() => handleView(emp.id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleEdit(emp.id)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(emp.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
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

export default Salary;
