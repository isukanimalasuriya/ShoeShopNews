import React, { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { jsPDF } from "jspdf";
import EmSidebar from './EmSidebar';

const EMAttendance = () => {
  const [message, setMessage] = useState("");
  const [attendanceRecords, setAttendanceRecords] = useState(
    JSON.parse(localStorage.getItem("attendanceRecords")) || []
  );
  const [employeeName, setEmployeeName] = useState("");
  const [employeeRole, setEmployeeRole] = useState("");

  const markAttendance = (action) => {
    const timestamp = new Date().toLocaleString();
    const record = { action, timestamp, employeeName, employeeRole };

    // Update attendance records
    const updatedRecords = [...attendanceRecords, record];
    setAttendanceRecords(updatedRecords);
    localStorage.setItem("attendanceRecords", JSON.stringify(updatedRecords));

    setMessage(`Successfully ${action} at ${timestamp} for ${employeeName}`);
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toLocaleDateString(); // Extracts date only (without time)
  };

  const todayRecords = attendanceRecords.filter((record) =>
    record.timestamp.startsWith(getTodayDate())
  );

  // Function to generate report
  const generateReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Attendance Report", 14, 22);

    doc.setFontSize(12);
    let yOffset = 30;

    // Add header to the report
    doc.text("Employee Name | Role | Action | Timestamp", 14, yOffset);
    yOffset += 10;

    // Add records to the report with all details
    todayRecords.forEach((record, index) => {
      doc.text(
        `${record.employeeName} | ${record.employeeRole} | ${record.action} | ${record.timestamp}`,
        14,
        yOffset + index * 10
      );
    });

    // Download the generated report
    doc.save("attendance_report.pdf");
  };

  return (
    <div className="flex flex-1 bg-white">
      <EmSidebar />
      <div className="relative min-h-screen bg-white overflow-hidden w-full">
        {/* Main Content Area */}
        <div className="max-w-lg mx-auto p-6 bg-white text-black shadow-xl rounded-lg mt-10 border border-gray-200 relative z-10 transition-all duration-300 transform hover:scale-105">
          <h1 className="text-3xl font-extrabold mb-4 text-center text-black">📅 Mark Attendance</h1>
          
          {/* Employee Name and Role Form */}
          <div className="mb-6">
            <div className="flex flex-col mb-4">
              <label className="text-black font-semibold mb-2" htmlFor="employeeName">Employee Name</label>
              <input
                type="text"
                id="employeeName"
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Enter employee name"
              />
            </div>
            <div className="flex flex-col mb-4">
              <label className="text-black font-semibold mb-2" htmlFor="employeeRole">Employee Role</label>
              <input
                type="text"
                id="employeeRole"
                value={employeeRole}
                onChange={(e) => setEmployeeRole(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Enter employee role"
              />
            </div>
          </div>

          {message && <p className="text-green-600 text-center mb-4 font-semibold">{message}</p>}

          {/* Button Container */}
          <div className="flex justify-center gap-6 mb-6 relative">
            <button
              className="px-6 py-3 bg-black text-white border border-white rounded-lg hover:bg-gray-700 transition transform hover:scale-105 shadow-md"
              onClick={() => markAttendance("Checked-In")}
            >
              <CheckCircle className="w-6 h-6 animate-bounce" /> Check-In
            </button>
            <button
              className="px-6 py-3 bg-white text-black border border-black rounded-lg hover:bg-gray-200 transition transform hover:scale-105 shadow-md"
              onClick={() => markAttendance("Checked-Out")}
            >
              <XCircle className="w-6 h-6 animate-bounce" /> Check-Out
            </button>
          </div>

          {/* Attendance Records */}
          <h2 className="text-xl font-semibold mb-2 text-black relative">📝 Attendance Records</h2>
          <div className="bg-gray-100 p-4 rounded-lg shadow-lg overflow-y-auto max-h-60 border border-gray-300">
            <ul>
              {todayRecords.length > 0 ? (
                todayRecords.map((record, index) => (
                  <li key={index} className="py-2 border-b last:border-none text-black flex items-center gap-2 transform hover:scale-105 transition-all">
                    {record.action === "Checked-In" ? (
                      <CheckCircle className="text-green-500 w-6 h-6" />
                    ) : (
                      <XCircle className="text-red-500 w-6 h-6" />
                    )}
                    {record.action} at {record.timestamp} for {record.employeeName} ({record.employeeRole})
                  </li>
                ))
              ) : (
                <p className="text-black">No records for today.</p>
              )}
            </ul>
          </div>

          {/* Generate Report Button */}
          <div className="flex justify-center mt-6">
            <button
              className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition transform hover:scale-105 shadow-lg"
              onClick={generateReport}
            >
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EMAttendance;
