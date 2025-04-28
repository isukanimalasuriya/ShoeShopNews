import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";



const EmployeePage = () => {
  const [searchId, setSearchId] = useState("");
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    age: ""
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllEmployees();
      setEmployees(data.employees);
      setError(null);
    } catch (err) {
      setError("Failed to fetch employees. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchId.trim()) {
      fetchEmployees();
      return;
    }
    try {
      setLoading(true);
      const data = await userService.getById(searchId);
      if (data.employees) {
        setEmployees([data.employees]);
      }
    } catch (err) {
      setError("Employee not found");
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = () => {
    navigate("/AddNewEmployee");
  };

  const handleView = async (id) => {
    try {
      const data = await userService.getById(id);
      setSelectedEmployee(data.employees);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditClick = (employee) => {
    setIsEditing(true);
    setFormData({
      name: employee.name,
      email: employee.email,
      role: employee.role,
      age: employee.age
    });
    setSelectedEmployee(employee);
  };

  const handleUpdateClick = async () => {
    if (!selectedEmployee) return;
    try {
      setLoading(true);
      await userService.updateEmployee(selectedEmployee._id, formData);
      setIsEditing(false);
      setSelectedEmployee(null);
      fetchEmployees();
    } catch (err) {
      setError("Failed to update employee");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        setLoading(true);
        await userService.deleteEmployee(id);
        fetchEmployees();
      } catch (err) {
        setError("Failed to delete employee");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  return (
    <div className="app-container">
      <Header />
      <div className="main-content">
        <Sidebar />
        <div className="employee-container">
          <div className="page-header">
            <h2>Manage Employees</h2>
            <div className="action-buttons">
              <button onClick={handleAddEmployee} className="add-employee-button">
                <i className="fa fa-plus"></i> Add New Employee
              </button>
            </div>
          </div>

          {error && <div className="error-message"><i className="fa fa-exclamation-circle"></i> {error}</div>}

          <div className="card search-card">
            <div className="search-bar">
              <i className="fa fa-search search-icon"></i>
              <input
                type="text"
                placeholder="Search By Employee ID"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
              />
              <button onClick={handleSearch}>Search</button>
            </div>
          </div>

          {isEditing && (
            <div className="card edit-form">
              <h3>Edit Employee</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Role:</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Role</option>
                    <option value="HR_MANAGER">HR Manager</option>
                    <option value="DELIVERY_MANAGER">Delivery Manager</option>
                    <option value="DELIVERY_PERSON">Delivery Person</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Age:</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="form-buttons">
                <button className="save-btn" onClick={handleUpdateClick}>
                  <i className="fa fa-save"></i> Save
                </button>
                <button className="cancel-btn" onClick={() => setIsEditing(false)}>
                  <i className="fa fa-times"></i> Cancel
                </button>
              </div>
            </div>
          )}

          <div className="card table-card">
            {loading ? (
              <div className="loading">
                <div className="loading-spinner"></div>
                <p>Loading employees...</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>S No</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Age</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.length > 0 ? (
                      employees.map((emp, index) => (
                        <tr key={emp._id}>
                          <td>{index + 1}</td>
                          <td>
                            <div className="user-info">
                              <div className="user-avatar">{emp.name.charAt(0)}</div>
                              <span>{emp.name}</span>
                            </div>
                          </td>
                          <td>{emp.email}</td>
                          <td>{emp.role}</td>
                          <td>{emp.age}</td>
                          <td className="action-cell">
                            <button className="view-btn" onClick={() => handleView(emp._id)}>
                              <i className="fa fa-eye"></i>
                            </button>
                            <button className="edit-btn" onClick={() => handleEditClick(emp)}>
                              <i className="fa fa-pencil"></i>
                            </button>
                            <button className="delete-btn" onClick={() => handleDeleteClick(emp._id)}>
                              <i className="fa fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="no-records">
                          <i className="fa fa-folder-open"></i>
                          <p>No employees found</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {selectedEmployee && !isEditing && (
            <div className="modal-backdrop">
              <div className="card employee-details">
                <div className="details-header">
                  <h3>Employee Details</h3>
                  <button className="close-btn" onClick={() => setSelectedEmployee(null)}>
                    <i className="fa fa-times"></i>
                  </button>
                </div>
                <div className="user-profile">
                  <div className="profile-avatar">
                    {selectedEmployee.name.charAt(0)}
                  </div>
                  <h4>{selectedEmployee.name}</h4>
                </div>
                <div className="details-content">
                  <div className="detail-item">
                    <i className="fa fa-envelope"></i>
                    <div>
                      <label>Email</label>
                      <p>{selectedEmployee.email}</p>
                    </div>
                  </div>
                  <div className="detail-item">
                    <i className="fa fa-user-tag"></i>
                    <div>
                      <label>Role</label>
                      <p>{selectedEmployee.role}</p>
                    </div>
                  </div>
                  <div className="detail-item">
                    <i className="fa fa-birthday-cake"></i>
                    <div>
                      <label>Age</label>
                      <p>{selectedEmployee.age}</p>
                    </div>
                  </div>
                </div>
                <div className="details-footer">
                  <button className="edit-btn" onClick={() => handleEditClick(selectedEmployee)}>
                    <i className="fa fa-pencil"></i> Edit
                  </button>
                  <button className="close-btn secondary" onClick={() => setSelectedEmployee(null)}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeePage;
