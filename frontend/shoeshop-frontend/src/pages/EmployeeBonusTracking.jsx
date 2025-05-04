// EmployeeBonusTracking.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Clock, DollarSign, ChevronLeft, PlusCircle, Calendar, TrendingUp, Award } from 'lucide-react';

const EmployeeBonusTracking = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [employee, setEmployee] = useState(null);
  const [bonuses, setBonuses] = useState([]);
  const [activeTab, setActiveTab] = useState('current');
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Request form state
  const [requestForm, setRequestForm] = useState({
    date: '',
    hours: '',
    reason: '',
    amount: '',
  });

  // Calculated metrics
  const [metrics, setMetrics] = useState({
    totalBonus: 0,
    pendingBonus: 0,
    approvedBonus: 0,
    projectedBonus: 0,
  });

  // Fetch employee data and bonuses
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/employeelogin');
        return;
      }

      try {
        // Fetch employee data
        const employeeResponse = await axios.get('http://localhost:5000/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Fetch bonuses
        const bonusesResponse = await axios.get('http://localhost:5000/api/bonuses/employee', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setEmployee(employeeResponse.data.user);
        
        // Use mock data if no bonuses are returned
        if (bonusesResponse.data.bonuses && bonusesResponse.data.bonuses.length > 0) {
          setBonuses(bonusesResponse.data.bonuses);
        } else {
          // Mock data for demonstration
          setBonuses([
            { 
              _id: '1', 
              type: 'Overtime', 
              date: '2025-04-28', 
              hours: 4, 
              amount: 2000, 
              status: 'approved', 
              reason: 'Weekend inventory check' 
            },
            { 
              _id: '2', 
              type: 'Overtime', 
              date: '2025-05-01', 
              hours: 2, 
              amount: 1000, 
              status: 'pending', 
              reason: 'Extended customer support' 
            },
            { 
              _id: '3', 
              type: 'Performance', 
              date: '2025-04-15', 
              hours: 0, 
              amount: 5000, 
              status: 'approved', 
              reason: 'Sales target achievement' 
            },
            { 
              _id: '4', 
              type: 'Overtime', 
              date: '2025-05-10', 
              hours: 6, 
              amount: 3000, 
              status: 'scheduled', 
              reason: 'Inventory restocking' 
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        showNotification('Failed to load data. Please try again.', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Calculate metrics whenever bonuses change
  useEffect(() => {
    const approved = bonuses.filter(b => b.status === 'approved').reduce((sum, b) => sum + b.amount, 0);
    const pending = bonuses.filter(b => b.status === 'pending').reduce((sum, b) => sum + b.amount, 0);
    const scheduled = bonuses.filter(b => b.status === 'scheduled').reduce((sum, b) => sum + b.amount, 0);
    
    setMetrics({
      totalBonus: approved,
      pendingBonus: pending,
      approvedBonus: approved,
      projectedBonus: pending + scheduled
    });
  }, [bonuses]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setRequestForm(prev => ({
      ...prev,
      [name]: value,
      // Auto-calculate amount based on hours (assuming LKR 500 per overtime hour)
      ...(name === 'hours' ? { amount: value * 500 } : {})
    }));
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const { date, hours, reason, amount } = requestForm;
      
      // Format the request payload
      const requestData = {
        type: 'Overtime',
        date,
        hours: parseInt(hours),
        reason,
        amount: parseInt(amount),
      };
      
      // Submit request to backend
      // In a real implementation, this would connect to your API
      // const response = await axios.post('http://localhost:5000/api/bonuses/request', requestData, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      
      // For demo purposes, simulate a successful response
      // Add the new request to bonuses with pending status
      const newBonus = {
        _id: Date.now().toString(), // temporary ID for demo
        ...requestData,
        status: 'pending'
      };
      
      setBonuses(prev => [...prev, newBonus]);
      
      // Reset form and hide it
      setRequestForm({
        date: '',
        hours: '',
        reason: '',
        amount: ''
      });
      setShowRequestForm(false);
      
      showNotification('Overtime bonus request submitted successfully!', 'success');
    } catch (error) {
      console.error('Error submitting bonus request:', error);
      showNotification('Failed to submit request. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };
  
  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };
  
  const navigateTo = (path) => {
    navigate(path);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-black text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <button
              onClick={() => navigateTo('/employeeDashboard')}
              className="mr-4 flex items-center text-white hover:text-gray-300"
            >
              <ChevronLeft size={20} />
              <span>Back to Dashboard</span>
            </button>
            <h1 className="text-xl font-bold">Bonus Tracking System</h1>
          </div>
          
          <div className="flex items-center">
            <span className="mr-2">{employee?.firstName} {employee?.lastName}</span>
            <button
              onClick={() => navigateTo('/employeelogin')}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 p-4 rounded-md shadow-md ${
          notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        } text-white z-50`}>
          {notification.message}
        </div>
      )}
      
      {/* Main Content */}
      <main className="container mx-auto py-6 px-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Bonuses (YTD)</p>
                <p className="text-2xl font-semibold">LKR {metrics.totalBonus}</p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-full text-indigo-600">
                <DollarSign size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending Approval</p>
                <p className="text-2xl font-semibold">LKR {metrics.pendingBonus}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full text-yellow-600">
                <Clock size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Last Approved Bonus</p>
                <p className="text-2xl font-semibold">LKR {metrics.approvedBonus}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full text-green-600">
                <Award size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Projected Bonuses</p>
                <p className="text-2xl font-semibold">LKR {metrics.projectedBonus}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                <TrendingUp size={24} />
              </div>
            </div>
          </div>
        </div>
        
        {/* Action Button */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2">
            <button 
              className={`px-4 py-2 rounded-md ${activeTab === 'current' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setActiveTab('current')}
            >
              Current Bonuses
            </button>
            <button 
              className={`px-4 py-2 rounded-md ${activeTab === 'history' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setActiveTab('history')}
            >
              Bonus History
            </button>
            <button 
              className={`px-4 py-2 rounded-md ${activeTab === 'projected' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setActiveTab('projected')}
            >
              Projected Bonuses
            </button>
          </div>
          
          <button
            onClick={() => setShowRequestForm(!showRequestForm)}
            className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
          >
            <PlusCircle size={20} className="mr-2" />
            {showRequestForm ? 'Cancel Request' : 'Request Overtime Bonus'}
          </button>
        </div>
        
        {/* Request Form */}
        {showRequestForm && (
          <div className="bg-white p-6 rounded-lg shadow mb-8 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Request Overtime Bonus</h2>
            <form onSubmit={handleSubmitRequest}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Overtime
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={requestForm.date}
                    onChange={handleFormChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hours Worked
                  </label>
                  <input
                    type="number"
                    name="hours"
                    value={requestForm.hours}
                    onChange={handleFormChange}
                    placeholder="Number of overtime hours"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    required
                    min="1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason
                  </label>
                  <input
                    type="text"
                    name="reason"
                    value={requestForm.reason}
                    onChange={handleFormChange}
                    placeholder="Brief reason for overtime"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Amount (LKR)
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={requestForm.amount}
                    onChange={handleFormChange}
                    placeholder="Calculated based on hours"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    readOnly
                  />
                  <p className="text-xs text-gray-500 mt-1">Calculated at LKR 500 per hour</p>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        )}
        
        {/* Bonuses Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hours
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount (LKR)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bonuses
                .filter(bonus => {
                  if (activeTab === 'current') return bonus.status === 'pending' || bonus.status === 'approved';
                  if (activeTab === 'history') return bonus.status === 'approved';
                  if (activeTab === 'projected') return bonus.status === 'scheduled' || bonus.status === 'pending';
                  return true;
                })
                .map(bonus => (
                  <tr key={bonus._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(bonus.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {bonus.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {bonus.hours > 0 ? bonus.hours : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {bonus.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
                      {bonus.reason}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        bonus.status === 'approved' 
                          ? 'bg-green-100 text-green-800' 
                          : bonus.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-blue-100 text-blue-800'
                      }`}>
                        {bonus.status.charAt(0).toUpperCase() + bonus.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              
              {bonuses.filter(bonus => {
                if (activeTab === 'current') return bonus.status === 'pending' || bonus.status === 'approved';
                if (activeTab === 'history') return bonus.status === 'approved';
                if (activeTab === 'projected') return bonus.status === 'scheduled' || bonus.status === 'pending';
                return true;
              }).length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    No bonuses found in this category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4 px-6 mt-8">
        <div className="container mx-auto text-center text-sm">
          <p>&copy; 2025 ShoeShop Employee Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default EmployeeBonusTracking;