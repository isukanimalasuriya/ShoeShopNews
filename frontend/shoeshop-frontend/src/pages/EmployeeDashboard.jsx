import React from 'react';

import Sidebar from "./Sidebar";


const EmployeeDashboard = () => {
  return (
    <div className="app-container">
      <Header />
      <div className="main-content">
        <Sidebar />
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
      </header>
      <div className="dashboard-content">
        <div className="card registered-employees">
          <h2>REGISTERED EMPLOYEES</h2>
          <p>15</p>
        </div>
        <div className="card listed-departments">
          <h2>LISTED DEPARTMENTS</h2>
          <p>6</p>
        </div>
        <div className="card listed-leave-type">
          <h2>LISTED LEAVE TYPE</h2>
          <p>4</p>
        </div>
        <div className="section-title">
          <h2>Leaves Details</h2>
        </div>
        <div className="card leaves-applied">
          <h2>LEAVES APPLIED</h2>
          <p>4</p>
        </div>
        <div className="card new-leave-requests">
          <h2>NEW LEAVE REQUESTS</h2>
          <p>1</p>
        </div>
        <div className="card rejected-leave-requests">
          <h2>REJECTED LEAVE REQUESTS</h2>
          <p>1</p>
        </div>
        <div className="card approved-leave-requests">
          <h2>APPROVED LEAVE REQUESTS</h2>
          <p>2</p>
        </div>
      </div>
    </div>
    </div>
    </div>
  );
};

export default EmployeeDashboard;
