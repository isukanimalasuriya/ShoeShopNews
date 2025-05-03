import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-64 min-h-screen bg-white shadow-lg p-6">
      <nav>
        <ul className="space-y-4">
          <li>
            <Link 
              to="/HRdashboard" 
              className="block text-gray-700 font-semibold hover:bg-indigo-100 hover:text-indigo-600 rounded-lg px-4 py-2 transition duration-200"
            >
              HR Dashboard
            </Link>
          </li>
          <li>
            <Link 
              to="/employee" 
              className="block text-gray-700 font-semibold hover:bg-indigo-100 hover:text-indigo-600 rounded-lg px-4 py-2 transition duration-200"
            >
              Employees
            </Link>
          </li>
          <li>
            <Link 
              to="/department" 
              className="block text-gray-700 font-semibold hover:bg-indigo-100 hover:text-indigo-600 rounded-lg px-4 py-2 transition duration-200"
            >
              Departments
            </Link>
          </li>
          <li>
            <Link 
              to="/leaves" 
              className="block text-gray-700 font-semibold hover:bg-indigo-100 hover:text-indigo-600 rounded-lg px-4 py-2 transition duration-200"
            >
              Leaves
            </Link>
          </li>
          <li>
            <Link 
              to="/salary" 
              className="block text-gray-700 font-semibold hover:bg-indigo-100 hover:text-indigo-600 rounded-lg px-4 py-2 transition duration-200"
            >
              Salary
            </Link>
          </li>
          <li>
            <Link 
              to="/Attendance" 
              className="block text-gray-700 font-semibold hover:bg-indigo-100 hover:text-indigo-600 rounded-lg px-4 py-2 transition duration-200"
            >
              Attendance
            </Link>
          </li>
          <li>
            <Link 
              to="/trackingbonus" 
              className="block text-gray-700 font-semibold hover:bg-indigo-100 hover:text-indigo-600 rounded-lg px-4 py-2 transition duration-200"
            >
              Tracking Bonus
            </Link>
          </li>
          <li>
            <Link 
              to="/setting" 
              className="block text-gray-700 font-semibold hover:bg-indigo-100 hover:text-indigo-600 rounded-lg px-4 py-2 transition duration-200"
            >
              Settings
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
