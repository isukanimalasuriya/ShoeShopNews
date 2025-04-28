import React from 'react';

import Sidebar from "./Sidebar";

const HRDashboard = () => {
  return (
    
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-6 bg-gray-100">
          <header className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-md text-center">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">REGISTERED EMPLOYEES</h2>
              <p className="text-4xl font-bold text-indigo-600">15</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-md text-center">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">LISTED DEPARTMENTS</h2>
              <p className="text-4xl font-bold text-indigo-600">6</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md text-center">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">LISTED LEAVE TYPE</h2>
              <p className="text-4xl font-bold text-indigo-600">4</p>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Leaves Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-md text-center">
                <h2 className="text-lg font-semibold text-gray-700 mb-2">LEAVES APPLIED</h2>
                <p className="text-3xl font-bold text-green-500">4</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-md text-center">
                <h2 className="text-lg font-semibold text-gray-700 mb-2">NEW LEAVE REQUESTS</h2>
                <p className="text-3xl font-bold text-yellow-500">1</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-md text-center">
                <h2 className="text-lg font-semibold text-gray-700 mb-2">REJECTED LEAVE REQUESTS</h2>
                <p className="text-3xl font-bold text-red-500">1</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-md text-center">
                <h2 className="text-lg font-semibold text-gray-700 mb-2">APPROVED LEAVE REQUESTS</h2>
                <p className="text-3xl font-bold text-blue-500">2</p>
              </div>
            </div>
          </div>

        </div>
      </div>
   
  );
};

export default HRDashboard;
