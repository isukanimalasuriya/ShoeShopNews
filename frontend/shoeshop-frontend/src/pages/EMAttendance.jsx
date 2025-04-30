import React, { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { jsPDF } from "jspdf";

const EMAttendance = () => {
  const [message, setMessage] = useState("");
  const [attendanceRecords, setAttendanceRecords] = useState(
    JSON.parse(localStorage.getItem("attendanceRecords")) || []
  );

  const markAttendance = (action) => {
    const timestamp = new Date().toLocaleString();
    const record = { action, timestamp };

    // Update attendance records
    const updatedRecords = [...attendanceRecords, record];
    setAttendanceRecords(updatedRecords);
    localStorage.setItem("attendanceRecords", JSON.stringify(updatedRecords));

    setMessage(`Successfully ${action} at ${timestamp}`);
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

    // Add records to the report
    todayRecords.forEach((record, index) => {
      doc.text(
        `${record.action} at ${record.timestamp}`,
        14,
        yOffset + index * 10
      );
    });

    // Download the generated report
    doc.save("attendance_report.pdf");
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-r from-green-300 via-green-400 to-green-500 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 opacity-20 animate-gradient"></div>

      {/* Main Content Area */}
      <div className="max-w-lg mx-auto p-6 bg-white shadow-xl rounded-lg mt-10 border border-gray-200 relative z-10 transition-all duration-300 transform hover:scale-105">
        <h1 className="text-3xl font-extrabold mb-4 text-center text-gray-800 animate-bounce">📅 Mark Attendance</h1>
        {message && <p className="text-green-600 text-center mb-4 font-semibold animate-pulse">{message}</p>}

        {/* Button Container */}
        <div className="flex justify-center gap-6 mb-6 relative">
          <button
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition transform hover:scale-105 shadow-md"
            onClick={() => markAttendance("Checked-In")}
          >
            <CheckCircle className="w-6 h-6 animate-bounce" /> Check-In
          </button>
          <button
            className="px-6 py-3 bg-white text-green-500 border border-green-500 rounded-lg hover:bg-green-100 transition transform hover:scale-105 shadow-md"
            onClick={() => markAttendance("Checked-Out")}
          >
            <XCircle className="w-6 h-6 animate-bounce" /> Check-Out
          </button>
        </div>

        {/* Attendance Records */}
        <h2 className="text-xl font-semibold mb-2 text-gray-700 relative">📝 Attendance Records</h2>
        <div className="bg-gray-100 p-4 rounded-lg shadow-lg overflow-y-auto max-h-60 border border-gray-300">
          <ul>
            {todayRecords.length > 0 ? (
              todayRecords.map((record, index) => (
                <li key={index} className="py-2 border-b last:border-none text-gray-800 flex items-center gap-2 transform hover:scale-105 transition-all">
                  {record.action === "Checked-In" ? (
                    <CheckCircle className="text-green-500 w-6 h-6" />
                  ) : (
                    <XCircle className="text-red-500 w-6 h-6" />
                  )}
                  {record.action} at {record.timestamp}
                </li>
              ))
            ) : (
              <p className="text-gray-500">No records for today.</p>
            )}
          </ul>
        </div>

        {/* Generate Report Button */}
        <div className="flex justify-center mt-6">
          <button
            className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition transform hover:scale-105 shadow-lg"
            onClick={generateReport}
          >
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default EMAttendance;
