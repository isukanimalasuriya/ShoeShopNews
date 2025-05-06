import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { userService, leaveService } from "../services/api";
import { useNavigate } from 'react-router-dom';

const HRDashboard = () => {
  const [employeeCount, setEmployeeCount] = useState(0);
  const [leaveStats, setLeaveStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });
  const [isAuthorized, setIsAuthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
  const token = localStorage.getItem('token');
  const employeeData = localStorage.getItem('employee');

  if (!token || !employeeData) {
    navigate('/employeelogin');
    return;
  }

  const user = JSON.parse(employeeData);

  if (user.role === 'admin' || user.role === 'HR_MANAGER') {
    setIsAuthorized(true);
    fetchEmployeeCount();
    fetchLeaveStats();
  } else {
    // Optional: redirect or show unauthorized message
    navigate('/unauthorized'); // Or you can navigate elsewhere
  }
  }, []);

  const fetchEmployeeCount = async () => {
    try {
      const data = await userService.getAllEmployees();
      setEmployeeCount(data?.employees?.length || 0);
    } catch (error) {
      console.error("Failed to fetch employee count:", error);
    }
  };

  const fetchLeaveStats = async () => {
    try {
      const data = await leaveService.getAllLeaves();
      const leaves = data?.leaves || [];

      let approved = 0, rejected = 0, pending = 0;

      leaves.forEach((leave) => {
        if (leave.status === "Approved") approved++;
        else if (leave.status === "Rejected") rejected++;
        else if (leave.status === "Pending") pending++;
      });

      setLeaveStats({
        total: leaves.length,
        approved,
        rejected,
        pending
      });
    } catch (error) {
      console.error("Failed to fetch leave stats:", error);
    }
  };

  return (
    <div className="flex flex-1">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        </header>

        {/* Summary Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-md text-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">REGISTERED EMPLOYEES</h2>
            <p className="text-4xl font-bold text-indigo-600">{employeeCount}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md text-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">LISTED DEPARTMENTS</h2>
            <p className="text-4xl font-bold text-indigo-600">6</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md text-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">LISTED LEAVE TYPES</h2>
            <p className="text-4xl font-bold text-indigo-600">4</p>
          </div>
        </div>

        {/* Leaves Details Section */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Leaves Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-md text-center">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">LEAVES APPLIED</h2>
              <p className="text-3xl font-bold text-green-500">{leaveStats.total}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md text-center">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">NEW LEAVE REQUESTS</h2>
              <p className="text-3xl font-bold text-yellow-500">{leaveStats.pending}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md text-center">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">REJECTED LEAVE REQUESTS</h2>
              <p className="text-3xl font-bold text-red-500">{leaveStats.rejected}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md text-center">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">APPROVED LEAVE REQUESTS</h2>
              <p className="text-3xl font-bold text-blue-500">{leaveStats.approved}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;
