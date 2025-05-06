import React, { useEffect, useState } from 'react';
import CustomersList from '../components/CustomersList';
import AdminAnalytics from '../components/AdminAnalytics';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Settings,
  LogOut,
  PersonStanding
} from 'lucide-react';
import HRDashboard from './HRDashboard';
import ShoeDashboard from './ShoeDashboard';
import Dashboard from './AllOrders';

const AdminDashboard = () => {
    const [activeComponent, setActiveComponent] = useState('dashboard');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/employeelogin'); // Redirect if no token found
        }
      }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/employeelogin');
      };

  // Function to render the appropriate component based on state
  // Note: HRDashboard is now accessed via direct navigation to '/hr-dashboard' route instead of being rendered here
  const renderComponent = () => {
    switch (activeComponent) {
      case 'dashboard':
        return <AdminAnalytics />;
      case 'users':
        return <CustomersList />;
      case 'products':
        return <ShoeDashboard />;
      case 'orders':
        return <Dashboard />;
      case 'HRDashboard':
        return <HRDashboard />;
      default:
        return <CustomersList />;
    }
  };

  const menuItems = [
    { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} />, isExternalRoute: false },
    { key: 'users', label: 'Users', icon: <Users size={18} />, isExternalRoute: false },
    { key: 'products', label: 'Products', icon: <Package size={18} />, isExternalRoute: true, route: '/dashboard' },
    { key: 'orders', label: 'Orders', icon: <ShoppingCart size={18} />, isExternalRoute: true, route: '/AllOrders' },
    { key: 'HRDashboard', label: 'HR Dashboard', icon: <PersonStanding size={18} />, isExternalRoute: true, route: '/HRdashboard' }
  ];

  return (
    <div className="flex h-screen bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg hidden md:flex flex-col">
        <div className="p-6 text-2xl font-bold text-indigo-600 tracking-wide border-b">Admin Panel</div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map(item => (
            <button
              key={item.key}
              onClick={() => {
                if (item.isExternalRoute) {
                  navigate(item.route);
                } else {
                  setActiveComponent(item.key);
                }
              }}
              className={`flex items-center gap-3 w-full px-4 py-2 text-sm rounded-md transition-all duration-200 
              ${activeComponent === item.key && !item.isExternalRoute ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50'}`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
        <div className="px-4 pb-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm w-full px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-all"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
          <h1 className="text-lg md:text-xl font-semibold">Welcome, Admin</h1>
          <div className="text-sm text-gray-500">Manage your application efficiently</div>
        </header>

        {/* Content Area */}
        <main className="p-6 overflow-auto">{renderComponent()}</main>
      </div>
    </div>
  );
};

export default AdminDashboard;