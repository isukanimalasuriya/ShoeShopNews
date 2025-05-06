import React, { useEffect, useState } from 'react';
import { LogOut, Lock  } from "lucide-react";
import axios from "axios";
import EmSidebar from '../pages/EmSidebar';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const EmployeeDetails = () => {
    const [employee, setEmployee] = useState(null);
    const navigate = useNavigate();
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
      
        if (!newPassword || !confirmPassword) {
          setError("Please fill all required fields");
          return;
        }
      
        if (newPassword !== confirmPassword) {
          setError("Passwords do not match");
          return;
        }
      
        try {
          const token = localStorage.getItem("token");
          await axios.put(
            "http://localhost:5000/api/users/update-password",
            { currentPassword, newPassword },
            { headers: { Authorization: `Bearer ${token}` } }
          );
      
          setSuccess("Password updated successfully");
          setShowPasswordModal(false);
          setNewPassword("");
          setConfirmPassword("");
        } catch (err) {
          setError("Error updating password");
        }
      };

      useEffect(() => {
        const storedEmployee = localStorage.getItem("employee");
        if (storedEmployee) {
            setEmployee(JSON.parse(storedEmployee));
        }
    }, []);

  return (
    <div className="flex flex-1 bg-gray-100 min-h-screen">
        <EmSidebar/>
        <main className="flex-1 p-6 relative">
    <div className="bg-white shadow-md rounded-lg p-6 max-w-3xl w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Profile Details</h2>
        <button
          onClick={() => setShowPasswordModal(true)}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
        >
          <Lock className="mr-2" size={18} /> Update Password
        </button>
      </div>

      {employee ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-gray-500 text-sm">Name</label>
            <p className="text-lg font-medium text-gray-900">{employee.name}</p>
          </div>
          <div>
            <label className="text-gray-500 text-sm">Email</label>
            <p className="text-lg font-medium text-gray-900">{employee.email}</p>
          </div>
          <div>
            <label className="text-gray-500 text-sm">Position</label>
            <p className="text-lg font-medium text-gray-900">{employee.role}</p>
          </div>
          <div>
            <label className="text-gray-500 text-sm">Age</label>
            <p className="text-lg font-medium text-gray-900">{employee.age}</p>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">Loading profile...</p>
      )}
        </div>
    </main>
    <div>
        {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Update Password</h2>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            
            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {success}
              </div>
            )}
            
            <form onSubmit={handleUpdatePassword}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Update Password
                </button>
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}

export default EmployeeDetails