import React, { useEffect, useState } from "react";
import { Clock, Calendar, DollarSign, Award, LogOut, Gift } from "lucide-react";
import EmSidebar from "./EmSidebar";
import { useNavigate } from "react-router-dom";

const EmployeeDashboard = () => {
  const [employee, setEmployee] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
        if (!token) {
          navigate('/employeelogin'); // Redirect if no token found
        }
    const data = JSON.parse(localStorage.getItem("employee"));
    if (data) {
      setEmployee(data);
    } else {
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/employeelogin');
  };

  const handleTrackBonus = () => {
    navigate("/EmployeeBonusTracking");
  };

  if (!employee) return <div>Loading...</div>;

  return (
    <div className="flex flex-1 bg-gray-100 min-h-screen">
      <EmSidebar />
      <main className="flex-1 p-6 relative">
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="absolute top-6 right-6 flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 mt-9 mr-9 rounded-lg shadow"
        >
          <LogOut className="mr-2" size={18} /> Logout
        </button>

        <div className="space-y-6">
          {/* Header */}
          <div className="bg-black text-white p-6 rounded-lg shadow-lg flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Welcome, {employee.name}</h1>
              <p className="text-gray-300 mt-2">Role: {employee.role}</p>
            </div>

            {/* Track Bonus Button */}
            <button
              onClick={handleTrackBonus}
              className="flex items-center bg-black hover:bg-gray-900 text-white px-4 py-2 rounded-lg shadow"
            >
              <Gift className="mr-2" size={18} /> Track Bonus
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card title="Today's Status" value="Present" icon={<Clock className="w-8 h-8" />} />
            <Card title="Leave Balance" value={`${employee.leaves} Days`} icon={<Calendar className="w-8 h-8" />} />
            <Card title="Current Salary" value={`LKR ${employee.salary}`} icon={<DollarSign className="w-8 h-8" />} />
            <Card title="Performance" value={employee.performance} icon={<Award className="w-8 h-8" />} />
          </div>

          {/* Activities and Events */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Section title="Recent Activities" items={[
              { date: "2025-03-15", label: "Marked attendance" },
              { date: "2025-03-18", label: "Applied for casual leave" },
              { date: "2025-03-19", label: "Completed monthly report" },
            ]} />

            <Section title="Upcoming Events" items={[
              { date: "2025-03-20", label: "Team Meeting" },
              { date: "2025-03-25", label: "Performance Review" },
              { date: "2025-04-01", label: "Training Session" },
            ]} />
          </div>
        </div>
      </main>
    </div>
  );
};

const Card = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-semibold text-black">{value}</p>
      </div>
      <div className="bg-gray-100 p-3 rounded-full text-black">{icon}</div>
    </div>
  </div>
);

const Section = ({ title, items }) => (
  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
    <h2 className="text-xl font-semibold text-black mb-4">{title}</h2>
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="flex items-center justify-between py-2 border-b border-gray-200">
          <span className="text-gray-700">{item.label}</span>
          <span className="text-sm text-gray-500">{item.date}</span>
        </div>
      ))}
    </div>
  </div>
);

export default EmployeeDashboard;
