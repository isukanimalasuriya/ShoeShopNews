import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { attendanceService } from "../services/api";

const AttendancePage = () => {
  const [searchId, setSearchId] = useState("");
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    employeeName: "",
    date: "",
    status: ""
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
          if (!token) {
            navigate('/employeelogin'); // Redirect if no token found
          }
    fetchAttendanceRecords();
  }, []);

  const fetchAttendanceRecords = async () => {
    try {
      setLoading(true);
      const data = await attendanceService.getAllAttendance();
      setAttendanceRecords(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch attendance records.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchId.trim()) {
      fetchAttendanceRecords();
      return;
    }

    const filtered = attendanceRecords.filter(
      (record) =>
        record.employeeName.toLowerCase().includes(searchId.toLowerCase()) ||
        record._id.includes(searchId)
    );
    setAttendanceRecords(filtered);
  };

  const handleAddAttendance = () => {
    navigate("/AddNewAttendance");
  };

  const handleEditClick = (record) => {
    setIsEditing(true);
    setFormData({
      employeeName: record.employeeName,
      date: record.date,
      status: record.status
    });
    setSelectedRecord(record);
  };

  const handleUpdateClick = async () => {
    if (!selectedRecord) return;
    try {
      setLoading(true);
      await attendanceService.updateAttendance(selectedRecord._id, formData);
      setIsEditing(false);
      setSelectedRecord(null);
      fetchAttendanceRecords();
    } catch (err) {
      setError("Failed to update attendance record.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        setLoading(true);
        await attendanceService.deleteAttendance(id);
        fetchAttendanceRecords();
      } catch (err) {
        setError("Failed to delete record.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-1">
      <Sidebar />
      <div className="w-full p-6 overflow-y-auto bg-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Manage Attendance</h2>
          <button
            onClick={handleAddAttendance}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            <i className="fa fa-plus mr-2"></i> Add New Record
          </button>
        </div>

        {error && <div className="text-red-600 mb-4">{error}</div>}

        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by Name or ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="w-3/4 p-2 border border-gray-300 rounded"
          />
          <button
            onClick={handleSearch}
            className="w-1/4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Search
          </button>
        </div>

        {loading ? (
          <p>Loading attendance records...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border border-gray-200 bg-white shadow-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3 border">S No</th>
                  <th className="p-3 border">Employee Name</th>
                  <th className="p-3 border">Date</th>
                  <th className="p-3 border">Status</th>
                  <th className="p-3 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {attendanceRecords.length > 0 ? (
                  attendanceRecords.map((record, index) => (
                    <tr key={record._id} className="text-center">
                      <td className="p-2 border">{index + 1}</td>
                      <td className="p-2 border">{record.employeeName}</td>
                      <td className="p-2 border">{record.date}</td>
                      <td className="p-2 border">{record.status}</td>
                      <td className="p-2 border flex flex-col sm:flex-row justify-center gap-2">
                        <button
                          onClick={() => handleEditClick(record)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(record._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-4 text-center text-gray-500">
                      No attendance records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {isEditing && (
          <div className="mt-6 bg-white p-6 rounded shadow">
            <h3 className="text-xl font-semibold mb-4">Edit Attendance</h3>
            <input
              type="text"
              value={formData.employeeName}
              readOnly
              className="w-full p-2 mb-3 border rounded bg-gray-100"
            />
            <input
              type="date"
              value={formData.date}
              readOnly
              className="w-full p-2 mb-3 border rounded bg-gray-100"
            />
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full p-2 mb-3 border rounded"
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Late">Late</option>
              <option value="Leave">Leave</option>
            </select>
            <div className="flex gap-4">
              <button
                onClick={handleUpdateClick}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendancePage;
