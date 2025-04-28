import React from "react";
import { Link } from "react-router-dom";


const Sidebar = () => {
  return (
    <aside className="sidebar">
      <nav>
        <ul>
          <li><Link to="/Employeedashboard">EmployeeDashboard</Link></li>
          <li><Link to="/employee">Employees</Link></li>
          <li><Link to="/department">Departments</Link></li>
          <li><Link to="/leaves">Leaves</Link></li>
          <li><Link to="/salary">Salary</Link></li>
          <li><Link to="/Attendance">Attendance</Link></li>
          <li><Link to="/TrackingBonus">TrackingBonus</Link></li>
          <li><Link to="/setting">Settings</Link></li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;


