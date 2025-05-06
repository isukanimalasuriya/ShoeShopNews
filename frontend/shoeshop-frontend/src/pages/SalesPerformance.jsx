import { useState } from 'react';
import {
  Calendar, TrendingUp, Target, Award,
  ArrowUp, ArrowDown, DollarSign, Users, Clock
} from 'lucide-react';
import EmSidebar from './EmSidebar'; // ✅ Make sure this path is correct

export default function EmployeeSalesPerformance() {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  const employee = {
    id: 1,
    name: "Emma Johnson",
    position: "Senior Sales Associate",
    avatar: "/api/placeholder/100/100",
    department: "Enterprise Solutions",
    email: "emma.johnson@company.com",
    phone: "(555) 123-4567"
  };

  const monthlySalesData = [
    { month: 'Jan', sales: 32500, target: 30000 },
    { month: 'Feb', sales: 38700, target: 30000 },
    { month: 'Mar', sales: 42200, target: 35000 },
    { month: 'Apr', sales: 38900, target: 35000 },
    { month: 'May', sales: 45200, target: 40000 }
  ];

  const weeklySalesData = [
    { week: 'Week 1', sales: 10500, target: 10000 },
    { week: 'Week 2', sales: 11700, target: 10000 },
    { week: 'Week 3', sales: 9200, target: 10000 },
    { week: 'Week 4', sales: 13800, target: 10000 }
  ];

  const recentTransactions = [
    { id: 1, client: "Acme Corp", amount: 12500, date: "2025-05-04", status: "completed" },
    { id: 2, client: "TechNova", amount: 8700, date: "2025-05-02", status: "completed" },
    { id: 3, client: "GlobalSoft", amount: 15400, date: "2025-04-29", status: "completed" },
    { id: 4, client: "InnovateCo", amount: 9600, date: "2025-04-27", status: "pending" }
  ];

  const formatLKR = (value) =>
    value.toLocaleString('en-LK', { style: 'currency', currency: 'LKR' });

  const currentPeriodData = selectedPeriod === 'monthly' ? monthlySalesData : weeklySalesData;
  const currentData = currentPeriodData[currentPeriodData.length - 1];
  const previousData = currentPeriodData[currentPeriodData.length - 2];

  const totalSales = currentPeriodData.reduce((sum, item) => sum + item.sales, 0);
  const totalTarget = currentPeriodData.reduce((sum, item) => sum + item.target, 0);
  const targetAchievement = Math.round((totalSales / totalTarget) * 100);

  const salesChange = previousData
    ? Math.round(((currentData.sales - previousData.sales) / previousData.sales) * 100)
    : 0;

  const chartData = currentPeriodData;
  const periodLabel = selectedPeriod === 'monthly' ? 'month' : 'week';

  return (
    <div className="flex">
      <EmSidebar />
      <div className="bg-gray-50 min-h-screen p-6 flex-1">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex space-x-2">
            {['weekly', 'monthly'].map(period => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg ${selectedPeriod === period ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Current Sales */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Current {periodLabel} Sales</p>
                <p className="text-2xl font-bold">{formatLKR(currentData.sales)}</p>
                <div className={`flex items-center mt-1 text-sm ${salesChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {salesChange >= 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                  <span>{Math.abs(salesChange)}% from previous {periodLabel}</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <TrendingUp size={24} className="text-blue-600" />
              </div>
            </div>
          </div>

          {/* Target */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Target Achievement</p>
                <p className="text-2xl font-bold">{targetAchievement}%</p>
                <p className="text-sm text-gray-500 mt-1">
                  {formatLKR(totalSales)} of {formatLKR(totalTarget)}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <Target size={24} className="text-green-600" />
              </div>
            </div>
          </div>

          {/* Rating */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Performance Rating</p>
                <p className="text-2xl font-bold">
                  {targetAchievement >= 100 ? 'Excellent' : targetAchievement >= 85 ? 'Good' : 'Needs Improvement'}
                </p>
                <p className="text-sm text-gray-500 mt-1">Based on target achievement</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Award size={24} className="text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
          <h2 className="text-lg font-medium mb-6">Sales Performance Timeline</h2>
          <div className="space-y-4">
            {chartData.map((data, index) => {
              const label = selectedPeriod === 'monthly' ? data.month : data.week;
              const percentage = Math.round((data.sales / data.target) * 100);
              return (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-medium">{label}</div>
                    <div className={`text-sm font-semibold ${data.sales >= data.target ? 'text-green-600' : 'text-red-600'}`}>
                      {data.sales >= data.target ? 'Above Target' : 'Below Target'}
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 mb-2">
                    <span>Sales: {formatLKR(data.sales)}</span>
                    <span>Target: {formatLKR(data.target)}</span>
                  </div>
                  <div className="relative pt-1">
                    <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                      <div
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                        className={`h-2 rounded-l ${
                          percentage >= 100
                            ? 'bg-green-500'
                            : percentage >= 85
                            ? 'bg-blue-500'
                            : 'bg-orange-500'
                        }`}
                      ></div>
                    </div>
                    <span className="text-xs text-blue-600 mt-1 block">{percentage}% of target</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Transactions + Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Recent Transactions */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex justify-between mb-6">
              <h2 className="text-lg font-medium">Recent Transactions</h2>
              <Calendar size={16} className="text-gray-600" />
            </div>
            <div className="space-y-4">
              {recentTransactions.map(tx => (
                <div key={tx.id} className="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                  <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <DollarSign size={18} className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{tx.client}</div>
                    <div className="text-sm text-gray-500">{tx.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatLKR(tx.amount)}</div>
                    <div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        tx.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Insights */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex justify-between mb-6">
              <h2 className="text-lg font-medium">Performance Insights</h2>
              <TrendingUp size={16} className="text-gray-600" />
            </div>
            <div className="space-y-4">
              {[
                {
                  icon: <Users size={18} className="text-green-600" />,
                  bg: 'bg-green-100',
                  title: 'Client Acquisition',
                  value: '+20%',
                  note: `4 new clients this ${periodLabel}`
                },
                {
                  icon: <Clock size={18} className="text-purple-600" />,
                  bg: 'bg-purple-100',
                  title: 'Average Deal Time',
                  value: '-12%',
                  note: '3.5 days to close'
                },
                {
                  icon: <Target size={18} className="text-blue-600" />,
                  bg: 'bg-blue-100',
                  title: 'Conversion Rate',
                  value: '+5%',
                  note: '68% of leads converted'
                }
              ].map((item, i) => (
                <div key={i} className="flex items-center p-3 border border-gray-100 rounded-lg">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-4 ${item.bg}`}>
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{item.title}</div>
                    <div className="text-sm text-gray-500">{item.note}</div>
                  </div>
                  <div className="text-green-600 font-medium">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-medium mb-6">Sales by Product Category</h2>
          {[
            { label: 'Enterprise Solutions', percent: 60 },
            { label: 'Cloud Services', percent: 25 },
            { label: 'Consulting', percent: 15 }
          ].map((item, i) => (
            <div key={i} className="flex items-center mb-3">
              <div className="w-1/4 font-medium">{item.label}</div>
              <div className="w-3/4 flex items-center">
                <div className="h-6 bg-blue-600 rounded-l" style={{ width: `${item.percent}%` }}></div>
                <div className="h-6 bg-gray-100 rounded-r" style={{ width: `${100 - item.percent}%` }}></div>
                <div className="ml-3">{item.percent}%</div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        
      </div>
    </div>
  );
}
