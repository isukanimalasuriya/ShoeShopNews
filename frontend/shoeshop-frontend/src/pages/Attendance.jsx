import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { attendanceService } from "../services/api";

const AttendancePage = () => {
  const [searchId, setSearchId] = useState("");
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    status: "",
    reason: ""
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/employeelogin");
    }
    fetchAttendanceRecords();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchId, attendanceRecords]);

  const fetchAttendanceRecords = async () => {
    try {
      setLoading(true);
      const data = await attendanceService.getAllAttendance();
      setAttendanceRecords(data);
      setFilteredRecords(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch attendance records.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchId.trim()) {
      setFilteredRecords(attendanceRecords);
    } else {
      const filtered = attendanceRecords.filter(
        (record) =>
          record.name.toLowerCase().includes(searchId.toLowerCase()) ||
          record._id.includes(searchId)
      );
      setFilteredRecords(filtered);
    }
  };

  const handleAddAttendance = () => {
    navigate("/AddNewAttendance");
  };

  const handleEditClick = (record) => {
    setIsEditing(true);
    setFormData({
      name: record.name,
      department: record.department,
      status: record.status,
      reason: record.reason
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

  const handleViewClick = (record) => {
    setSelectedRecord(record);
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="flex flex-1">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Manage Attendance</h2>
          <button
            onClick={handleAddAttendance}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            <i className="fa fa-plus mr-2"></i> Add New Record
          </button>
        </div>

        {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</div>}

        <div className="flex items-center gap-2 mb-6">
          <input
            type="text"
            placeholder="Search by Name or ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 w-full"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Search
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading attendance records...</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded shadow">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">S No</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Name</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Department</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Status</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Reason</th>
                  <th className="px-4 py-2 text-center font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((record, index) => (
                    <tr key={record._id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2">{record.name}</td>
                      <td className="px-4 py-2">{record.department}</td>
                      <td className="px-4 py-2">{record.status}</td>
                      <td className="px-4 py-2">{record.reason}</td>
                      <td className="px-4 py-2 flex justify-center gap-2">
                        <button onClick={() => handleViewClick(record)} className="text-blue-500 hover:text-blue-700">View</button>
                        <button onClick={() => handleEditClick(record)} className="text-green-600 hover:text-green-700">Edit</button>
                        <button onClick={() => handleDeleteClick(record._id)} className="text-red-600 hover:text-red-700">Delete</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-gray-500">
                      No attendance records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {selectedRecord && !isEditing && (
          <div className="mt-6 bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Attendance Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block mb-1">Name</label><p>{selectedRecord.name}</p></div>
              <div><label className="block mb-1">Department</label><p>{selectedRecord.department}</p></div>
              <div><label className="block mb-1">Status</label><p>{selectedRecord.status}</p></div>
              <div><label className="block mb-1">Reason</label><p>{selectedRecord.reason}</p></div>
            </div>
          </div>
        )}

        {isEditing && (
          <div className="mt-6 bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Edit Attendance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full border rounded px-3 py-2" placeholder="Name" />
              <input type="text" name="department" value={formData.department} onChange={handleInputChange} className="w-full border rounded px-3 py-2" placeholder="Department" />
              <select name="status" value={formData.status} onChange={handleInputChange} className="w-full border rounded px-3 py-2">
                <option value="">Select Status</option>
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="On Leave">On Leave</option>
              </select>
              <input type="text" name="reason" value={formData.reason} onChange={handleInputChange} className="w-full border rounded px-3 py-2" placeholder="Reason" />
            </div>
            <div className="flex justify-end mt-4 gap-2">
              <button onClick={handleUpdateClick} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Save</button>
              <button onClick={() => setIsEditing(false)} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendancePage;
