import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Sidebar from "./Sidebar";
import { userService } from "../services/api";


const AddNewEmployee = () => {
  const [employeeData, setEmployeeData] = useState({
    name: "",
    email: "",
    role: "",
    age: ""
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData({
      ...employeeData,
      [name]: name === 'age' ? parseInt(value, 10) || "" : value
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (file) {
      console.log("Uploading file:", file.name);
      alert("File selected: " + file.name);
    } else {
      alert("Please select a file first.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      const userData = {
        name: employeeData.name,
        email: employeeData.email,
        role: employeeData.role,
        age: employeeData.age
      };

      await userService.addUser(userData);
      alert('Employee Created Successfully!');
      navigate('/employee');
    } catch (err) {
      setError("Failed to create employee. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content">
      <Sidebar />
      <div className="add-employee-container">
        <div className="form-header">
          <h2>New Employee</h2>
        </div>
        {error && <div className="error-message">{error}</div>}
        <form className="add-employee-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={employeeData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={employeeData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">Role *</label>
            <input
              type="text"
              id="role"
              name="role"
              value={employeeData.role}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="age">Age *</label>
            <input
              type="number"
              id="age"
              name="age"
              value={employeeData.age}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Upload File (optional):</label>
            <input type="file" onChange={handleFileChange} />
            <button type="button" onClick={handleUpload}>
              Upload
            </button>
          </div>
          <div className="form-footer">
            <button type="submit" className="create-employee-btn" disabled={loading}>
              {loading ? "Creating..." : "Create Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewEmployee;
