import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, PieChart, BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Pie, Cell } from 'recharts';
import { Users, UserCheck, UserX, Calendar, ArrowUp, ArrowDown } from 'lucide-react';

const AdminAnalytics = () => {

    const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    verifiedUsers: 0,
    unverifiedUsers: 0,
    newUsersThisMonth: 0,
    newUsersLastMonth: 0,
    userGrowthRate: 0
  });
  const [timeRange, setTimeRange] = useState('week'); // 'week', 'month', 'year'

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/users/');
      const userData = response.data.data;
      setUsers(userData);
      calculateStats(userData);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch user data');
      setLoading(false);
      console.error('Error fetching users:', err);
    }
  };

  const calculateStats = (userData) => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    const thisYear = now.getFullYear();
    const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;
    
    // Count users based on verification status
    const verifiedUsers = userData.filter(user => user.isVerified).length;
    
    // Count new users this month
    const newUsersThisMonth = userData.filter(user => {
      const createdAt = new Date(user.createdAt);
      return createdAt.getMonth() === thisMonth && createdAt.getFullYear() === thisYear;
    }).length;
    
    // Count new users last month
    const newUsersLastMonth = userData.filter(user => {
      const createdAt = new Date(user.createdAt);
      return createdAt.getMonth() === lastMonth && createdAt.getFullYear() === lastMonthYear;
    }).length;
    
    // Calculate growth rate
    const userGrowthRate = newUsersLastMonth > 0 
      ? ((newUsersThisMonth - newUsersLastMonth) / newUsersLastMonth) * 100 
      : newUsersThisMonth > 0 ? 100 : 0;
    
    setStats({
      totalUsers: userData.length,
      verifiedUsers,
      unverifiedUsers: userData.length - verifiedUsers,
      newUsersThisMonth,
      newUsersLastMonth,
      userGrowthRate
    });
  };

  // Prepare data for user registration timeline chart based on time range
  const getUserRegistrationData = () => {
    if (users.length === 0) return [];
    
    const now = new Date();
    let dataPoints = [];
    let dateFormat;
    let startDate;
    
    if (timeRange === 'week') {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
      dateFormat = date => `${date.getDate()}/${date.getMonth() + 1}`;
      
      // Create data points for each day of the week
      for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        const formattedDate = dateFormat(date);
        
        const count = users.filter(user => {
          const createdAt = new Date(user.createdAt);
          return createdAt.getDate() === date.getDate() &&
                 createdAt.getMonth() === date.getMonth() &&
                 createdAt.getFullYear() === date.getFullYear();
        }).length;
        
        dataPoints.push({ name: formattedDate, users: count });
      }
    } else if (timeRange === 'month') {
      startDate = new Date(now);
      startDate.setDate(1);
      startDate.setMonth(now.getMonth() - 1);
      dateFormat = date => `Week ${Math.ceil(date.getDate() / 7)}`;
      
      // Create data points for each week of the month
      for (let i = 0; i < 5; i++) {
        const weekStart = new Date(startDate);
        weekStart.setDate(weekStart.getDate() + (i * 7));
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        
        const count = users.filter(user => {
          const createdAt = new Date(user.createdAt);
          return createdAt >= weekStart && createdAt <= weekEnd;
        }).length;
        
        dataPoints.push({ name: dateFormat(weekStart), users: count });
      }
    } else if (timeRange === 'year') {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      // Create data points for each month of the year
      for (let i = 0; i < 12; i++) {
        const monthDate = new Date(now.getFullYear(), i, 1);
        
        const count = users.filter(user => {
          const createdAt = new Date(user.createdAt);
          return createdAt.getMonth() === i && createdAt.getFullYear() === now.getFullYear();
        }).length;
        
        dataPoints.push({ name: months[i], users: count });
      }
    }
    
    return dataPoints;
  };

  // Data for verification status pie chart
  const getVerificationData = () => [
    { name: 'Verified', value: stats.verifiedUsers },
    { name: 'Unverified', value: stats.unverifiedUsers }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Customer Analytics Dashboard</h2>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading customer data...</div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Total Customers</p>
                  <h3 className="text-2xl font-bold mt-1">{stats.totalUsers}</h3>
                </div>
                <div className="bg-blue-100 rounded-full p-3">
                  <Users size={24} className="text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Verified Customers</p>
                  <h3 className="text-2xl font-bold mt-1">{stats.verifiedUsers}</h3>
                </div>
                <div className="bg-green-100 rounded-full p-3">
                  <UserCheck size={24} className="text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Unverified Customers</p>
                  <h3 className="text-2xl font-bold mt-1">{stats.unverifiedUsers}</h3>
                </div>
                <div className="bg-orange-100 rounded-full p-3">
                  <UserX size={24} className="text-orange-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">New This Month</p>
                  <h3 className="text-2xl font-bold mt-1">{stats.newUsersThisMonth}</h3>
                  <div className="flex items-center mt-1">
                    {stats.userGrowthRate > 0 ? (
                      <ArrowUp size={16} className="text-green-500" />
                    ) : stats.userGrowthRate < 0 ? (
                      <ArrowDown size={16} className="text-red-500" />
                    ) : null}
                    
                    <span className={`text-xs ml-1 ${
                      stats.userGrowthRate > 0 ? 'text-green-500' : 
                      stats.userGrowthRate < 0 ? 'text-red-500' : 'text-gray-500'
                    }`}>
                      {Math.abs(stats.userGrowthRate).toFixed(1)}% vs last month
                    </span>
                  </div>
                </div>
                <div className="bg-purple-100 rounded-full p-3">
                  <Calendar size={24} className="text-purple-600" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Time Range Selector */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-700">Registration Trends</h3>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setTimeRange('week')}
                  className={`px-3 py-1 text-sm rounded ${
                    timeRange === 'week' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Week
                </button>
                <button 
                  onClick={() => setTimeRange('month')}
                  className={`px-3 py-1 text-sm rounded ${
                    timeRange === 'month' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Month
                </button>
                <button 
                  onClick={() => setTimeRange('year')}
                  className={`px-3 py-1 text-sm rounded ${
                    timeRange === 'year' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Year
                </button>
              </div>
            </div>
            
            {/* Line Chart for User Registration */}
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={getUserRegistrationData()}
                  margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="users"
                    name="New Registrations"
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Verification Status */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold text-gray-700 mb-4">Verification Status</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getVerificationData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {getVerificationData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} customers`, 'Count']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Recent Activities */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold text-gray-700 mb-4">Last 5 Registered Customers</h3>
              <div className="overflow-y-auto max-h-64">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users
                      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                      .slice(0, 5)
                      .map(user => (
                        <tr key={user._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8">
                                <img className="h-8 w-8 rounded-full" src={user.profilePicture} alt={user.name} />
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.phoneNumber}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    {users.length === 0 && (
                      <tr>
                        <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                          No customer data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default AdminAnalytics