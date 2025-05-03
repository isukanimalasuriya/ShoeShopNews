import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  FiHome,
  FiList,
  FiPlusSquare,
  FiTag,
  FiTruck,
  FiLogOut,
} from "react-icons/fi";

const Sidebar = () => {
  const [activeLink, setActiveLink] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any authentication state
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Redirect to login page
    // navigate("/login");
  };

  const handleSetActive = (path) => {
    setActiveLink(path);
  };

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-xl flex flex-col py-8 px-4 border-r border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-12 pl-4">
        Admin Menu
      </h2>
      <ul className="space-y-2 w-full">
        <li>
          <Link
            to="/dashboard"
            className={`flex items-center px-4 py-3 rounded-lg transition-all ${
              activeLink === "/dashboard"
                ? "bg-indigo-100 text-indigo-700 font-medium"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => handleSetActive("/dashboard")}
          >
            <FiHome className="mr-3" size={18} />
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            to="/shoes"
            className={`flex items-center px-4 py-3 rounded-lg transition-all ${
              activeLink === "/shoes"
                ? "bg-indigo-100 text-indigo-700 font-medium"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => handleSetActive("/shoes")}
          >
            <FiList className="mr-3" size={18} />
            Inventory List
          </Link>
        </li>
        <li>
          <Link
            to="/shoes/add"
            className={`flex items-center px-4 py-3 rounded-lg transition-all ${
              activeLink === "/shoes/add"
                ? "bg-indigo-100 text-indigo-700 font-medium"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => handleSetActive("/shoes/add")}
          >
            <FiPlusSquare className="mr-3" size={18} />
            Add Shoes
          </Link>
        </li>
        <li>
          <Link
            to="/categories"
            className={`flex items-center px-4 py-3 rounded-lg transition-all ${
              activeLink === "/categories"
                ? "bg-indigo-100 text-indigo-700 font-medium"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => handleSetActive("/categories")}
          >
            <FiTag className="mr-3" size={18} />
            Categories
          </Link>
        </li>
        <li>
          <Link
            to="/restock"
            className={`flex items-center px-4 py-3 rounded-lg transition-all ${
              activeLink === "/restock"
                ? "bg-indigo-100 text-indigo-700 font-medium"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => handleSetActive("/restock")}
          >
            <FiTruck className="mr-3" size={18} />
            Restock
          </Link>
        </li>
        <li>
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-3 rounded-lg transition-all text-red-600 hover:bg-red-50 w-full cursor-pointer"
          >
            <FiLogOut className="mr-3" size={18} />
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
