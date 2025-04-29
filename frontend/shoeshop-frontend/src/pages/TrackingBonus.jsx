import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Sidebar from "./Sidebar";
import { Clock, DollarSign, Users, TrendingUp, Search, Plus, Filter } from 'lucide-react';

function TrackingBonus() {
  const [activeTab, setActiveTab] = useState('overtime');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const [employees] = useState([
    { id: 1, name: 'John Doe', department: 'Engineering', overtimeHours: 12, bonusAmount: 500 },
    { id: 2, name: 'Jane Smith', department: 'Design', overtimeHours: 8, bonusAmount: 300 },
    { id: 3, name: 'Mike Johnson', department: 'Marketing', overtimeHours: 15, bonusAmount: 600 },
  ]);

  return (
  
    <div className="main-content">
      <Sidebar />
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-3 rounded-lg">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">HR Management Portal</h1>
              <p className="text-gray-600">Overtime & Bonus Tracking</p>
            </div>
          </div>
          <div className="flex gap-4">
          <button
          className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all"
                  onClick={() => navigate("/OvertimeBonus")}
                >
              <Plus className="w-4 h-4" />
              Add Employee
            </button>
            <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all">
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search employees..."
            className="w-full pl-12 pr-4 py-3 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
  <button
    className={`flex-1 p-4 rounded-lg flex items-center justify-center gap-3 transition-all ${
      activeTab === 'overtime'
        ? 'bg-green-600 text-white shadow-lg'
        : 'bg-white text-gray-600 hover:bg-gray-50'
    }`}
    onClick={() => setActiveTab('overtime')}
  >
    <Clock className="w-5 h-5" />
    Overtime Management
  </button>
  <button
    className={`flex-1 p-4 rounded-lg flex items-center justify-center gap-3 transition-all ${
      activeTab === 'bonus'
        ? 'bg-green-600 text-white shadow-lg'
        : 'bg-white text-gray-600 hover:bg-gray-50'
    }`}
    onClick={() => setActiveTab('bonus')}
  >
    <span className="w-5 h-5" />
    Bonus Tracking
  </button>
</div>


        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-gray-600">Total Overtime Hours</p>
                <h3 className="text-2xl font-bold">156 hrs</h3>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">12% increase from last month</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <span className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-gray-600">Total Bonus Allocated</p>
                <h3 className="text-2xl font-bold">+LKR 15,400</h3>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-purple-600">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">8% increase from last month</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-600">Active Employees</p>
                <h3 className="text-2xl font-bold">24</h3>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-blue-600">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">2 new this month</span>
            </div>
          </div>
        </div>

        {/* Employee List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Employee</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Department</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  {activeTab === 'overtime' ? 'Overtime Hours' : 'Bonus Amount'}
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {employees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-indigo-600 font-semibold">
                          {employee.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{employee.name}</p>
                        <p className="text-sm text-gray-500">{employee.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                      {employee.department}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {activeTab === 'overtime' ? (
                      <span className="font-medium text-gray-800">{employee.overtimeHours} hours</span>
                    ) : (
                      <span className="font-medium text-gray-800">LKR{employee.bonusAmount}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-indigo-600 hover:text-indigo-800 font-medium">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </div>
 
  );
}

export default TrackingBonus;
  
