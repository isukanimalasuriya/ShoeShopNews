
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Calendar, DollarSign, UserCheck, LogOut } from 'lucide-react';

const EmSidebar = () => {
  return (
    <aside className="w-64 min-h-screen bg-white shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-green-700">ShoeShop EMS</h2>
      </div>
      <nav>
        <ul className="space-y-4">
          <li>
            <NavLink
              to="/employeedashboard"
              className={({ isActive }) =>
                `flex items-center font-semibold px-4 py-2 rounded-lg transition duration-200 ${
                  isActive
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-700 hover:bg-green-100 hover:text-green-700'
                }`
              }
            >
              <Home className="w-5 h-5 mr-3" />
              Employee Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/apply-leave"
              className={({ isActive }) =>
                `flex items-center font-semibold px-4 py-2 rounded-lg transition duration-200 ${
                  isActive
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-700 hover:bg-green-100 hover:text-green-700'
                }`
              }
            >
              <Calendar className="w-5 h-5 mr-3" />
              Apply Leave
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/salary-promotion"
              className={({ isActive }) =>
                `flex items-center font-semibold px-4 py-2 rounded-lg transition duration-200 ${
                  isActive
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-700 hover:bg-green-100 hover:text-green-700'
                }`
              }
            >
              <DollarSign className="w-5 h-5 mr-3" />
              Salary & Promotion
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/attendance"
              className={({ isActive }) =>
                `flex items-center font-semibold px-4 py-2 rounded-lg transition duration-200 ${
                  isActive
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-700 hover:bg-green-100 hover:text-green-700'
                }`
              }
            >
              <UserCheck className="w-5 h-5 mr-3" />
              Attendance
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/"
              className="flex items-center font-semibold px-4 py-2 rounded-lg transition duration-200 text-gray-700 hover:bg-red-100 hover:text-red-600"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default EmSidebar;
