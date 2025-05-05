import { useState } from 'react';
import { Search } from 'lucide-react';

export default function SalesPerformancePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('sales');
  const [sortDirection, setSortDirection] = useState('desc');
  
  // Sample data - in a real app this would come from your backend
  const employeeData = [
    { id: 1, name: 'Emma Johnson', position: 'Senior Sales Associate', sales: 42500, target: 40000, date: '2025-05-01' },
    { id: 2, name: 'Michael Chen', position: 'Sales Associate', sales: 38700, target: 35000, date: '2025-05-01' },
    { id: 3, name: 'Sofia Rodriguez', position: 'Sales Associate', sales: 45200, target: 40000, date: '2025-05-02' },
    { id: 4, name: 'James Wilson', position: 'Junior Associate', sales: 28900, target: 30000, date: '2025-05-02' },
    { id: 5, name: 'Aisha Patel', position: 'Sales Associate', sales: 36100, target: 35000, date: '2025-05-03' },
  ];

  // Filter employees based on search query
  const filteredEmployees = employeeData.filter(employee => 
    employee.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort employees
  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    if (sortDirection === 'asc') {
      return a[sortField] > b[sortField] ? 1 : -1;
    } else {
      return a[sortField] < b[sortField] ? 1 : -1;
    }
  });

  // Calculate total and average sales
  const totalSales = employeeData.reduce((sum, employee) => sum + employee.sales, 0);
  const averageSales = totalSales / employeeData.length;

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and reset to descending
      setSortField(field);
      setSortDirection('desc');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Sales Performance</h1>
      
      {/* Search and Summary */}
      <div className="mb-6 flex flex-col md:flex-row justify-between gap-4">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-500" />
          </div>
          <input
            type="text"
            className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none"
            placeholder="Search employees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500">Total Sales</p>
            <p className="text-xl font-bold">${totalSales.toLocaleString()}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500">Average Sales</p>
            <p className="text-xl font-bold">${Math.round(averageSales).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Employee Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <h2 className="text-lg font-medium p-4 border-b">Employee Sales</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  Employee
                  {sortField === 'name' && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('sales')}
                >
                  Sales
                  {sortField === 'sales' && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('target')}
                >
                  Target
                  {sortField === 'target' && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('date')}
                >
                  Date
                  {sortField === 'date' && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedEmployees.map((employee) => (
                <tr key={employee.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{employee.position}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${employee.sales.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${employee.target.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {employee.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {employee.sales >= employee.target ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Above Target
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Below Target
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Top Performers Summary Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mt-6">
        <h2 className="text-lg font-medium p-4 border-b">Top Performers</h2>
        <div className="p-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% of Target</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[...employeeData]
                .sort((a, b) => b.sales - a.sales)
                .slice(0, 3)
                .map((employee, index) => (
                  <tr key={employee.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">#{index + 1}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${employee.sales.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {Math.round((employee.sales / employee.target) * 100)}%
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}