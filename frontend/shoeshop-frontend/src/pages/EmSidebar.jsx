
import React from 'react';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const EmSidebar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/employeelogin');
  };
  return (
    <aside className="w-64 min-h-screen bg-white shadow-lg p-6">
    <nav>
      <ul className="space-y-4">
        <li>
          <Link 
            to="/employeeDashboard" 
            className="block text-gray-700 font-semibold hover:bg-indigo-100 hover:text-indigo-600 rounded-lg px-4 py-2 transition duration-200"
          >
            Employee Dashboard
          </Link>
        </li>
        <li>
          <Link 
            to="/applyleave" 
            className="block text-gray-700 font-semibold hover:bg-indigo-100 hover:text-indigo-600 rounded-lg px-4 py-2 transition duration-200"
          >
            Apply Leave
          </Link>
        </li>
        <li>
          <Link 
            to="/salary&promotion" 
            className="block text-gray-700 font-semibold hover:bg-indigo-100 hover:text-indigo-600 rounded-lg px-4 py-2 transition duration-200"
          >
            Salary & Promotion
          </Link>
        </li>
        <li>
          <Link 
            to="/EmAttendance" 
            className="block text-gray-700 font-semibold hover:bg-indigo-100 hover:text-indigo-600 rounded-lg px-4 py-2 transition duration-200"
          >
            EMAttendance
          </Link>
        </li>
        <li>
        <Link 
            to="/SalesPerformance" 
            className="block text-gray-700 font-semibold hover:bg-indigo-100 hover:text-indigo-600 rounded-lg px-4 py-2 transition duration-200"
          >
            SalesPerformance
                       

          </Link>
        </li>
        <li>
          <button 
          onClick={handleLogout}
          className="block text-gray-700 font-semibold hover:bg-indigo-100 hover:text-indigo-600 rounded-lg px-4 py-2 transition duration-200"
          >
            Logout
          </button>
          </li>
          
      </ul>
    </nav>
  </aside>
  );
};
export default EmSidebar;
