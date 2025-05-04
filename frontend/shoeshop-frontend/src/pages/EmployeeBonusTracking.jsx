// EmployeeBonusTracker.jsx

import React, { useState, useEffect } from 'react';
import { FaMoneyBillWave, FaCalendarPlus, FaHistory, FaHome, FaShoppingBag } from 'react-icons/fa';
import { BsClockHistory } from 'react-icons/bs';
import { MdDashboard } from 'react-icons/md';

function EmployeeBonusTracker() {
  const [activeView, setActiveView] = useState('dashboard');
  const [bonuses, setBonuses] = useState([]);
  const [overtimeRequests, setOvertimeRequests] = useState([]);
  const [futureBonuses, setFutureBonuses] = useState([]);
  const [newBonus, setNewBonus] = useState({
    amount: '',
    reason: '',
    date: new Date().toISOString().substr(0, 10)
  });
  const [overtimeRequest, setOvertimeRequest] = useState({
    hours: '',
    date: new Date().toISOString().substr(0, 10),
    reason: ''
  });

  const [employee, setEmployee] = useState({
    id: 'EMP001',
    name: 'John Doe',
    position: 'Sales Associate',
    department: 'Footwear',
    joinDate: '2022-05-15',
    totalBonus: 0
  });

  useEffect(() => {
    const dummyBonuses = [
      { id: 1, amount: 250, reason: 'Sales target achievement', date: '2025-04-15', status: 'Paid' },
      { id: 2, amount: 150, reason: 'Employee of the month', date: '2025-03-10', status: 'Paid' },
      { id: 3, amount: 175, reason: 'Customer service excellence', date: '2025-02-20', status: 'Paid' }
    ];

    const dummyOvertimeRequests = [
      { id: 1, hours: 8, date: '2025-04-25', reason: 'Inventory check', status: 'Approved' },
      { id: 2, hours: 5, date: '2025-04-10', reason: 'Special sale event', status: 'Pending' }
    ];

    const dummyFutureBonuses = [
      { id: 1, amount: 300, reason: 'Quarterly performance bonus', date: '2025-06-30', status: 'Scheduled' },
      { id: 2, amount: 200, reason: 'Annual bonus', date: '2025-12-15', status: 'Scheduled' }
    ];

    setBonuses(dummyBonuses);
    setOvertimeRequests(dummyOvertimeRequests);
    setFutureBonuses(dummyFutureBonuses);

    const total = dummyBonuses.reduce((sum, bonus) => sum + bonus.amount, 0);
    setEmployee(prev => ({ ...prev, totalBonus: total }));
  }, []);

  const handleAddBonus = (e) => {
    e.preventDefault();

    const bonus = {
      id: bonuses.length + 1,
      amount: parseFloat(newBonus.amount),
      reason: newBonus.reason,
      date: newBonus.date,
      status: 'Pending'
    };

    setBonuses([...bonuses, bonus]);
    setNewBonus({ amount: '', reason: '', date: new Date().toISOString().substr(0, 10) });
    alert('Bonus added successfully!');
  };

  const handleOvertimeRequest = (e) => {
    e.preventDefault();

    const request = {
      id: overtimeRequests.length + 1,
      hours: parseInt(overtimeRequest.hours),
      date: overtimeRequest.date,
      reason: overtimeRequest.reason,
      status: 'Pending'
    };

    setOvertimeRequests([...overtimeRequests, request]);
    setOvertimeRequest({ hours: '', date: new Date().toISOString().substr(0, 10), reason: '' });
    alert('Overtime request submitted successfully!');
  };

  const navigateTo = (view) => {
    setActiveView(view);
  };

  return (
    <div className="employee-bonus-tracker bg-gray-100 min-h-screen flex flex-col">
    

      <div className="flex flex-1">
        <nav className="w-64 bg-gray-800 text-white">
          <ul>
            <li className={`py-4 px-6 cursor-pointer ${activeView === 'dashboard' ? 'bg-blue-600' : ''}`} onClick={() => navigateTo('dashboard')}>
              <MdDashboard className="inline-block mr-2" />
              Dashboard
            </li>
            <li className={`py-4 px-6 cursor-pointer ${activeView === 'bonusHistory' ? 'bg-blue-600' : ''}`} onClick={() => navigateTo('bonusHistory')}>
              <FaHistory className="inline-block mr-2" />
              Bonus History
            </li>
            <li className={`py-4 px-6 cursor-pointer ${activeView === 'addBonus' ? 'bg-blue-600' : ''}`} onClick={() => navigateTo('addBonus')}>
              <FaMoneyBillWave className="inline-block mr-2" />
              Add Bonus
            </li>
            <li className={`py-4 px-6 cursor-pointer ${activeView === 'requestOvertime' ? 'bg-blue-600' : ''}`} onClick={() => navigateTo('requestOvertime')}>
              <BsClockHistory className="inline-block mr-2" />
              Request Overtime
            </li>
            <li className={`py-4 px-6 cursor-pointer ${activeView === 'futureBonus' ? 'bg-blue-600' : ''}`} onClick={() => navigateTo('futureBonus')}>
              <FaCalendarPlus className="inline-block mr-2" />
              Future Bonuses
            </li>
            <li className="py-4 px-6 cursor-pointer" onClick={() => alert('Navigating to home page')}>
              <FaHome className="inline-block mr-2" />
              Back to Home
            </li>
          </ul>
        </nav>

        <main className="flex-1 p-8">
          {activeView === 'dashboard' && (
            <div className="dashboard">
              <h2 className="text-2xl font-semibold mb-4">Bonus Dashboard</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-4 rounded shadow-md">
                  <h3 className="text-lg font-medium">Total Bonuses</h3>
                  <p className="text-xl">${employee.totalBonus}</p>
                  <p className="text-sm text-gray-500">Year to Date</p>
                </div>
                <div className="bg-white p-4 rounded shadow-md">
                  <h3 className="text-lg font-medium">Pending Bonuses</h3>
                  <p className="text-xl">{bonuses.filter(b => b.status === 'Pending').length}</p>
                  <p className="text-sm text-gray-500">Awaiting Approval</p>
                </div>
                <div className="bg-white p-4 rounded shadow-md">
                  <h3 className="text-lg font-medium">Overtime Requests</h3>
                  <p className="text-xl">{overtimeRequests.filter(r => r.status === 'Pending').length}</p>
                  <p className="text-sm text-gray-500">Pending Review</p>
                </div>
                <div className="bg-white p-4 rounded shadow-md">
                  <h3 className="text-lg font-medium">Future Bonuses</h3>
                  <p className="text-xl">{futureBonuses.length}</p>
                  <p className="text-sm text-gray-500">Upcoming</p>
                </div>
              </div>
              <div className="recent-activity">
                <h3 className="text-xl font-medium mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {[...bonuses, ...overtimeRequests].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5).map((item, index) => (
                    <div key={index} className="flex items-center p-4 bg-white rounded shadow-md">
                      <div className="mr-4">
                        {item.hours ? <BsClockHistory /> : <FaMoneyBillWave />}
                      </div>
                      <div>
                        <p className="font-medium">
                          {item.hours ? `Overtime: ${item.hours} hours` : `Bonus: $${item.amount}`}
                        </p>
                        <p>{item.reason}</p>
                        <p className="text-sm text-gray-500">{new Date(item.date).toLocaleDateString()}</p>
                      </div>
                      <div className={`ml-auto text-sm ${item.status === 'Approved' ? 'text-green-500' : 'text-yellow-500'}`}>
                        {item.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeView === 'bonusHistory' && (
            <div className="bonus-history">
              <h2 className="text-2xl font-semibold mb-4">Bonus History</h2>
              <div className="flex space-x-4 mb-8">
                <select defaultValue="all" className="p-2 border rounded">
                  <option value="all">All Bonuses</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                </select>
                <input type="month" defaultValue="2025-05" className="p-2 border rounded" />
                <button className="bg-blue-500 text-white px-4 py-2 rounded">Filter</button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded">
                  <thead>
                    <tr className="border-b">
                      <th className="p-4 text-left">Date</th>
                      <th className="p-4 text-left">Amount</th>
                      <th className="p-4 text-left">Reason</th>
                      <th className="p-4 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bonuses.map((bonus) => (
                      <tr key={bonus.id} className="border-b">
                        <td className="p-4">{new Date(bonus.date).toLocaleDateString()}</td>
                        <td className="p-4">${bonus.amount}</td>
                        <td className="p-4">{bonus.reason}</td>
                        <td className="p-4 text-center">{bonus.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeView === 'addBonus' && (
            <div className="add-bonus">
              <h2 className="text-2xl font-semibold mb-4">Add New Bonus</h2>
              <form onSubmit={handleAddBonus} className="space-y-4">
                <div className="flex flex-col">
                  <label className="font-medium">Bonus Amount ($)</label>
                  <input
                    type="number"
                    className="p-2 border rounded"
                    value={newBonus.amount}
                    onChange={(e) => setNewBonus({ ...newBonus, amount: e.target.value })}
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-medium">Reason for Bonus</label>
                  <select
                    className="p-2 border rounded"
                    value={newBonus.reason}
                    onChange={(e) => setNewBonus({ ...newBonus, reason: e.target.value })}
                    required
                  >
                    <option value="">Select a reason</option>
                    <option value="Sales target achievement">Sales Target Achievement</option>
                    <option value="Customer service excellence">Customer Service Excellence</option>
                    <option value="Employee of the month">Employee of the Month</option>
                    <option value="Special project completion">Special Project Completion</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="font-medium">Date of Bonus</label>
                  <input
                    type="date"
                    className="p-2 border rounded"
                    value={newBonus.date}
                    onChange={(e) => setNewBonus({ ...newBonus, date: e.target.value })}
                    required
                  />
                </div>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Add Bonus</button>
              </form>
            </div>
          )}

          {activeView === 'requestOvertime' && (
            <div className="request-overtime">
              <h2 className="text-2xl font-semibold mb-4">Request Overtime</h2>
              <form onSubmit={handleOvertimeRequest} className="space-y-4">
                <div className="flex flex-col">
                  <label className="font-medium">Overtime Hours</label>
                  <input
                    type="number"
                    className="p-2 border rounded"
                    value={overtimeRequest.hours}
                    onChange={(e) => setOvertimeRequest({ ...overtimeRequest, hours: e.target.value })}
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-medium">Reason for Overtime</label>
                  <textarea
                    className="p-2 border rounded"
                    value={overtimeRequest.reason}
                    onChange={(e) => setOvertimeRequest({ ...overtimeRequest, reason: e.target.value })}
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-medium">Date</label>
                  <input
                    type="date"
                    className="p-2 border rounded"
                    value={overtimeRequest.date}
                    onChange={(e) => setOvertimeRequest({ ...overtimeRequest, date: e.target.value })}
                    required
                  />
                </div>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Submit Overtime Request</button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default EmployeeBonusTracker;
