import React from "react";
import { Clock, Calendar, DollarSign, Award } from "lucide-react";
import EmSidebar from "./EmSidebar";
const EmployeeDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold">Welcome, John Doe</h1>
        <p className="text-green-100 mt-2">Have a productive day!</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border border-green-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Today's Status</p>
              <p className="text-2xl font-semibold text-green-700">Present</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Clock className="text-green-600 w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-green-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Leave Balance</p>
              <p className="text-2xl font-semibold text-green-700">12 Days</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Calendar className="text-green-600 w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-green-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Current Salary</p>
              <p className="text-2xl font-semibold text-green-700">LKR3,500</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <span className="text-green-600 w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-green-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Performance</p>
              <p className="text-2xl font-semibold text-green-700">Excellent</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Award className="text-green-600 w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border border-green-100">
          <h2 className="text-xl font-semibold text-green-800 mb-4">Recent Activities</h2>
          <div className="space-y-4">
            {[
              { date: '2025-03-15', activity: 'Marked attendance' },
              { date: '2025-03-18', activity: 'Applied for casual leave' },
              { date: '2025-03-19', activity: 'Completed monthly report' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-green-100">
                <span className="text-gray-600">{item.activity}</span>
                <span className="text-sm text-green-600">{item.date}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-green-100">
          <h2 className="text-xl font-semibold text-green-800 mb-4">Upcoming Events</h2>
          <div className="space-y-4">
            {[
              { date: '2025-03-20', event: 'Team Meeting' },
              { date: '2025-03-25', event: 'Performance Review' },
              { date: '2025-04-01', event: 'Training Session' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-green-100">
                <span className="text-gray-600">{item.event}</span>
                <span className="text-sm text-green-600">{item.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard; 