import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";




const Leave = () => {
  const [searchId, setSearchId] = useState("");
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    leaveType: "",
    department: "",
    position: "",
    status: ""
  });

  const navigate = useNavigate();

  // Fetch all leave records on component mount
  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const data = await leaveService.getAllLeaves();
      setLeaves(data.leaves);
      setError(null);
    } catch (err) {
      setError("Failed to fetch leave records. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLeave = () => {
    // Navigate to add leave page or show add form
    navigate("/add-leave");
    // Alternatively, you could show a form modal:
    // setIsAdding(true);
  };

  const handleSearch = async () => {
    if (!searchId.trim()) {
      fetchLeaves();
      return;
    }

    try {
      setLoading(true);
      const data = await leaveService.getLeaveByEmpId(searchId);
      if (data.leaves) {
        setLeaves([data.leaves]);
      }
    } catch (err) {
      setError("Leave record not found");
      setLeaves([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (leave) => {
    setIsEditing(true);
    setFormData({
      leaveType: leave.leaveType,
      department: leave.department,
      position: leave.position,
      status: leave.status
    });
    setSelectedLeave(leave);
  };

  const handleUpdateClick = async () => {
    if (!selectedLeave) return;

    try {
      setLoading(true);
      await leaveService.updateLeave(selectedLeave._id, formData);
      setIsEditing(false);
      setSelectedLeave(null);
      fetchLeaves();
    } catch (err) {
      setError("Failed to update leave record.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this leave record?")) {
      try {
        setLoading(true);
        await leaveService.deleteLeave(id);
        fetchLeaves();
      } catch (err) {
        setError("Failed to delete leave record.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      setLoading(true);
      await leaveService.updateLeaveStatus(id, status);
      fetchLeaves();
    } catch (err) {
      setError("Failed to update leave status.");
      console.error(err);
    } finally {
      setLoading(false);
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
        <div className="leave-container">
          <div className="page-header">
            <h1>Manage Leaves</h1>
          </div>
          <div className="action-buttons">
            <button onClick={handleAddLeave} className="add-leave-button">
              <i className="fa fa-plus"></i> Add New Leave
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="search-filter">
            <input
              type="text"
              placeholder="Search By Emp ID"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
          </div>

          {loading ? (
            <div className="loading">Loading leave records...</div>
          ) : (
            <div className="card table-card">
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>Emp ID</th>
                      <th>Name</th>
                      <th>Leave Type</th>
                      <th>Department</th>
                      <th>Position</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaves.length > 0 ? (
                      leaves.map((leave) => (
                        <tr key={leave._id}>
                          <td>{leave.empId}</td>
                          <td>{leave.name}</td>
                          <td>{leave.leaveType}</td>
                          <td>{leave.department}</td>
                          <td>{leave.position}</td>
                          <td className={`status ${leave.status.toLowerCase()}`}>
                            {leave.status}
                          </td>
                          <td className="action-cell">
                            <button className="view-btn" onClick={() => setSelectedLeave(leave)}>
                              <i className="fa fa-eye"></i>
                            </button>
                            <button className="edit-btn" onClick={() => handleEditClick(leave)}>
                              <i className="fa fa-pencil"></i>
                            </button>
                            <button className="delete-btn" onClick={() => handleDeleteClick(leave._id)}>
                              <i className="fa fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7">No leave records found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {isEditing && (
            <div className="card edit-form">
              <h3>Edit Leave</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Leave Type:</label>
                  <input
                    type="text"
                    name="leaveType"
                    value={formData.leaveType}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Department:</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Position:</label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Status:</label>
                  <input
                    type="text"
                    name="status"
                    value={formData.status}
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

          {selectedLeave && !isEditing && (
            <div className="modal-backdrop">
              <div className="card leave-details">
                <div className="details-header">
                  <h3>Leave Details</h3>
                  <button className="close-btn" onClick={() => setSelectedLeave(null)}>
                    <i className="fa fa-times"></i>
                  </button>
                </div>
                <div className="details-content">
                  <div className="detail-item">
                    <label>Leave Type</label>
                    <p>{selectedLeave.leaveType}</p>
                  </div>
                  <div className="detail-item">
                    <label>Department</label>
                    <p>{selectedLeave.department}</p>
                  </div>
                  <div className="detail-item">
                    <label>Position</label>
                    <p>{selectedLeave.position}</p>
                  </div>
                  <div className="detail-item">
                    <label>Status</label>
                    <p>{selectedLeave.status}</p>
                  </div>
                </div>
                <div className="details-footer">
                  <button className="edit-btn" onClick={() => handleEditClick(selectedLeave)}>
                    <i className="fa fa-pencil"></i> Edit
                  </button>
                  <button className="close-btn secondary" onClick={() => setSelectedLeave(null)}>
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

export default Leave;