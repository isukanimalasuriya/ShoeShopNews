import React, { useState } from 'react';
import EmSidebar from './EmSidebar';

const RequestLeave = () => {
  const [leaveData, setLeaveData] = useState({
    empId: '',
    position: '',
    startDate: '',
    endDate: '',
    leaveType: '',
    reason: ''
  });

  const [leaveDays, setLeaveDays] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLeaveData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === 'startDate' || name === 'endDate') {
      const start = name === 'startDate' ? value : leaveData.startDate;
      const end = name === 'endDate' ? value : leaveData.endDate;
      calculateLeaveDays(start, end);
    }
  };

  const calculateLeaveDays = (start, end) => {
    if (start && end) {
      const startDate = new Date(start);
      const endDate = new Date(end);
      const diffTime = endDate.getTime() - startDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setLeaveDays(diffDays > 0 ? diffDays : 0);
    } else {
      setLeaveDays(0);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Leave request submitted:', leaveData, `Total Leave Days: ${leaveDays}`);
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);

    setLeaveData({
      empId: '',
      position: '',
      startDate: '',
      endDate: '',
      leaveType: '',
      reason: ''
    });
    setLeaveDays(0);
  };

  return (
    <div className="flex">
      <EmSidebar />
      <div className="flex-1 p-8">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-6 text-center">Request Leave</h2>
          {showSuccess && (
            <div className="mb-4 p-3 bg-green-500 text-white text-center font-bold rounded-md">
              Leave request submitted successfully!
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label htmlFor="empId" className="mb-2 font-medium text-gray-700">Employee ID</label>
                <input
                  type="text"
                  id="empId"
                  name="empId"
                  value={leaveData.empId}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="position" className="mb-2 font-medium text-gray-700">Position</label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  value={leaveData.position}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label htmlFor="startDate" className="mb-2 font-medium text-gray-700">Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={leaveData.startDate}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="endDate" className="mb-2 font-medium text-gray-700">End Date</label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={leaveData.endDate}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="mb-2 font-medium text-gray-700">Total Leave Days</label>
              <p className="text-xl font-semibold text-gray-800">{leaveDays} day(s)</p>
            </div>

            <div className="flex space-x-6">
              <button 
                type="submit" 
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-colors duration-300"
              >
                Submit Request
              </button>
              <button 
                type="button" 
                onClick={() => {
                  setLeaveData({
                    empId: '',
                    position: '',
                    startDate: '',
                    endDate: '',
                    leaveType: '',
                    reason: ''
                  });
                  setLeaveDays(0);
                }} 
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-lg shadow-lg transition-colors duration-300"
              >
                Reset Form
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RequestLeave;