import React, { useState,useEffect  } from 'react';
import { DollarSign, TrendingUp } from 'lucide-react';
import EmSidebar from './EmSidebar';
import { useNavigate } from "react-router-dom";

const SalaryPromotion = () => {
  const [activeTab, setActiveTab] = useState('salary');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
      if (!token) {
        navigate('/employeelogin'); // Redirect if no token found
      }
  }, [navigate]);

  return (
    <div className="flex flex-1 bg-gray-100">
      <EmSidebar />
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
            <div className="flex space-x-4 mb-8">
              <button
                className={`flex items-center px-6 py-3 rounded-lg transition-all duration-300 ${
                  activeTab === 'salary'
                    ? 'bg-black text-white shadow-md'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
                onClick={() => setActiveTab('salary')}
              >
                <DollarSign className="w-5 h-5 mr-2" />
                LKR Salary Details
              </button>
              <button
                className={`flex items-center px-6 py-3 rounded-lg transition-all duration-300 ${
                  activeTab === 'promotion'
                    ? 'bg-black text-white shadow-md'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
                onClick={() => setActiveTab('promotion')}
              >
                <TrendingUp className="w-5 h-5 mr-2" />
                Promotion Request
              </button>
            </div>

            {activeTab === 'salary' ? (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-500">Current Salary</p>
                    <p className="text-3xl font-bold text-black">LKR3,500</p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-500">Last Increment</p>
                    <p className="text-3xl font-bold text-black">+LKR300</p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-500">Next Review</p>
                    <p className="text-3xl font-bold text-black">3 months</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-black mb-4">Salary History</h3>
                  <div className="space-y-4">
                    {[
                      { date: '2025-03-20', amount: 'LKR3,500', change: '+LKR300' },
                      { date: '2025-03-21', amount: 'LKR3,200', change: '+LKR200' },
                      { date: '2025-03-22', amount: 'LKR3,000', change: '+LKR500' },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-600">{item.date}</span>
                        <span className="font-semibold text-black">{item.amount}</span>
                        <span className="text-gray-700">{item.change}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
                  <p className="text-sm text-gray-500">Current Position</p>
                  <p className="text-xl font-semibold text-black">Senior Sales Associate</p>
                  <p className="text-sm text-gray-500 mt-2">Time in Position: 2 years</p>
                </div>

                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Desired Position
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      placeholder="e.g., Store Manager"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Justification
                    </label>
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent h-32"
                      placeholder="Describe your achievements and why you deserve this promotion..."
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Key Achievements
                    </label>
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <input
                          key={i}
                          type="text"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                          placeholder={`Achievement ${i}`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      Submit Request
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SalaryPromotion;