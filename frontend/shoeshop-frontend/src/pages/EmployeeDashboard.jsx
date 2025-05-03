import React from "react";
import { Clock, Calendar, DollarSign, Award } from "lucide-react";
import EmSidebar from "./EmSidebar";

const EmployeeDashboard = () => {
  return (
    <div className="flex flex-1 bg-gray-100">
      <EmSidebar />
      <main className="flex-1 p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-black text-white p-6 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold">Welcome</h1>
            <p className="text-gray-300 mt-2">Have a productive day!</p>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Today's Status</p>
                  <p className="text-2xl font-semibold text-black">Present</p>
                </div>
                <div className="bg-gray-100 p-3 rounded-full">
                  <Clock className="text-black w-8 h-8" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Leave Balance</p>
                  <p className="text-2xl font-semibold text-black">12 Days</p>
                </div>
                <div className="bg-gray-100 p-3 rounded-full">
                  <Calendar className="text-black w-8 h-8" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Current Salary</p>
                  <p className="text-2xl font-semibold text-black">LKR3,500</p>
                </div>
                <div className="bg-gray-100 p-3 rounded-full">
                  <DollarSign className="text-black w-8 h-8" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Performance</p>
                  <p className="text-2xl font-semibold text-black">Excellent</p>
                </div>
                <div className="bg-gray-100 p-3 rounded-full">
                  <Award className="text-black w-8 h-8" />
                </div>
              </div>
            </div>
          </div>

          {/* Activities and Events */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h2 className="text-xl font-semibold text-black mb-4">Recent Activities</h2>
              <div className="space-y-4">
                {[
                  { date: '2025-03-15', activity: 'Marked attendance' },
                  { date: '2025-03-18', activity: 'Applied for casual leave' },
                  { date: '2025-03-19', activity: 'Completed monthly report' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-700">{item.activity}</span>
                    <span className="text-sm text-gray-500">{item.date}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h2 className="text-xl font-semibold text-black mb-4">Upcoming Events</h2>
              <div className="space-y-4">
                {[
                  { date: '2025-03-20', event: 'Team Meeting' },
                  { date: '2025-03-25', event: 'Performance Review' },
                  { date: '2025-04-01', event: 'Training Session' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-700">{item.event}</span>
                    <span className="text-sm text-gray-500">{item.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmployeeDashboard;