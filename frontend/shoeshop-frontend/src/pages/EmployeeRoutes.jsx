import React from 'react';
import { Routes, Route } from 'react-router-dom';
import EmployeeLogin from '../pages/EmployeeLogin';
import AdminDashboard from './AdminDashboard';
import CustomersList from '../components/CustomersList';
import EmployeeDetails from '../components/EmployeeDetails';

const EmployeeRoutes = () => {
  return (
    <Routes>
      <Route path="/employeelogin" element={<EmployeeLogin />} />
      <Route path="/admindashboard" element={<AdminDashboard />} />
      <Route path="/customers" element={<CustomersList />} />
      <Route path="/employeedetails" element={<EmployeeDetails />} />
    </Routes>
  );
};

export default EmployeeRoutes;
