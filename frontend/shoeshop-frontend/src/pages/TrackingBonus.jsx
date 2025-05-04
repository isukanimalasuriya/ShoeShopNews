import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

const TrackingBonus = () => {
  const [searchId, setSearchId] = useState("");
  const [bonusRecords, setBonusRecords] = useState([
    { _id: "1", employeeName: "John Doe", bonusAmount: 500, date: "2025-05-01", status: "Pending" },
    { _id: "2", employeeName: "Jane Smith", bonusAmount: 750, date: "2025-04-15", status: "Approved" },
    { _id: "3", employeeName: "Michael Johnson", bonusAmount: 600, date: "2025-03-30", status: "Rejected" }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    employeeName: "",
    bonusAmount: "",
    date: "",
    status: ""
  });

  const navigate = useNavigate();

  // Simulating loading
  useEffect(() => {
    setLoading(false);
  }, []);

  const handleSearch = () => {
    if (!searchId.trim()) {
      return;
    }

    const filtered = bonusRecords.filter(
      (record) =>
        record.employeeName.toLowerCase().includes(searchId.toLowerCase()) ||
        record._id.includes(searchId)
    );
    setBonusRecords(filtered);
  };

  const handleAddBonus = () => {
    navigate("/AddBonus");
  };

  const handleEditClick = (record) => {
    setIsEditing(true);
    setFormData({
      employeeName: record.employeeName,
      bonusAmount: record.bonusAmount,
      date: record.date,
      status: record.status
    });
  };

  const handleUpdateClick = () => {
    setIsEditing(false);
    setBonusRecords(prev => 
      prev.map(record => record._id === formData._id ? formData : record)
    );
  };

  const handleDeleteClick = (id) => {
    if (window.confirm("Are you sure you want to delete this bonus record?")) {
      setBonusRecords(prev => prev.filter(record => record._id !== id));
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full p-8 bg-gray-50">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold text-gray-800">Track Employee Bonuses</h2>
          <button
            onClick={handleAddBonus}
            className="bg-indigo-600 text-white px-6 py-3 rounded-full shadow-md transform hover:scale-105 transition-transform"
          >
            <i className="fas fa-plus mr-2"></i> Add Bonus
          </button>
        </div>

        {error && <div className="text-red-600 mb-4">{error}</div>}

        <div className="flex items-center mb-6 space-x-4">
          <input
            type="text"
            placeholder="Search by Name or ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="w-1/2 p-3 rounded-lg shadow-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleSearch}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-md transform hover:scale-105 transition-transform"
          >
            Search
          </button>
        </div>

        {loading ? (
          <div className="text-center text-gray-600">Loading...</div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="w-full table-auto">
              <thead className="bg-indigo-600 text-white">
                <tr>
                  <th className="py-3 px-4 text-left">S No</th>
                  <th className="py-3 px-4 text-left">Employee Name</th>
                  <th className="py-3 px-4 text-left">Bonus Amount</th>
                  <th className="py-3 px-4 text-left">Date</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bonusRecords.length > 0 ? (
                  bonusRecords.map((record, index) => (
                    <tr key={record._id} className="border-b hover:bg-gray-50 transition">
                      <td className="py-3 px-4">{index + 1}</td>
                      <td className="py-3 px-4">{record.employeeName}</td>
                      <td className="py-3 px-4">${record.bonusAmount}</td>
                      <td className="py-3 px-4">{record.date}</td>
                      <td className="py-3 px-4">{record.status}</td>
                      <td className="py-3 px-4 space-x-3">
                        <button
                          onClick={() => handleEditClick(record)}
                          className="bg-yellow-500 text-white px-4 py-2 rounded-lg transform hover:scale-105 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(record._id)}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg transform hover:scale-105 transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-4 text-center text-gray-500">
                      No records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {isEditing && (
          <div className="mt-6 bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Edit Bonus</h3>
            <input
              type="text"
              value={formData.employeeName}
              readOnly
              className="w-full p-4 mb-4 rounded-lg border focus:outline-none bg-gray-100"
            />
            <input
              type="number"
              value={formData.bonusAmount}
              onChange={(e) => setFormData({ ...formData, bonusAmount: e.target.value })}
              className="w-full p-4 mb-4 rounded-lg border focus:outline-none"
              placeholder="Bonus Amount"
            />
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full p-4 mb-4 rounded-lg border focus:outline-none"
            />
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full p-4 mb-4 rounded-lg border focus:outline-none"
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
            <div className="flex justify-between">
              <button
                onClick={handleUpdateClick}
                className="bg-green-600 text-white px-6 py-3 rounded-full transform hover:scale-105 transition-all"
              >
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-400 text-white px-6 py-3 rounded-full transform hover:scale-105 transition-all"
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

export default TrackingBonus;
