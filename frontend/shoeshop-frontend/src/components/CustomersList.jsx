import React, { useState, useEffect } from 'react';
import { Search } from "lucide-react";

const CustomersList = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
  
    useEffect(() => {
      fetchUsers();
    }, []);
    
    // Filter users when search term or users list changes
    useEffect(() => {
      filterUsers();
    }, [searchTerm, users]);
    
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users/');
        const data = await response.json();
        setUsers(data.data);
        setFilteredUsers(data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch users');
        setLoading(false);
        console.error('Error fetching users:', err);
      }
    };
    
    const filterUsers = () => {
      if (!searchTerm.trim()) {
        setFilteredUsers(users);
        return;
      }
      
      const term = searchTerm.toLowerCase();
      const filtered = users.filter(user => 
        user.email.toLowerCase().includes(term)
      );
      setFilteredUsers(filtered);
    };
    
    const handleSearchChange = (e) => {
      setSearchTerm(e.target.value);
    };

    const handleDeleteClick = (user) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
    };
      
    const cancelDelete = () => {
        setUserToDelete(null);
        setShowDeleteModal(false);
        setDeleteError(null);
    };
      
    const confirmDelete = async () => {
        if (!userToDelete) return;
        
        setDeleteLoading(true);
        setDeleteError(null);
        
        try {
          await fetch(`http://localhost:5000/api/users/${userToDelete._id}`, {
            method: 'DELETE'
          });
          
          // Remove user from the state
          setUsers(users.filter(user => user._id !== userToDelete._id));
          
          // Close modal and reset
          setUserToDelete(null);
          setShowDeleteModal(false);
          setDeleteLoading(false);
        } catch (err) {
          setDeleteError('Failed to delete user. Please try again.');
          setDeleteLoading(false);
          console.error('Error deleting user:', err);
        }
    };
    
  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Users</h2>
        <div className="text-sm text-gray-600">Total: {filteredUsers.length} of {users.length} Customers</div>
      </div>
      
      {/* Search Input */}
      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search by email..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      {loading ? (
        <div className="text-center py-4">Loading users...</div>
      ) : error ? (
        <div className="text-center py-4 text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100 text-left text-gray-700">
              <tr>
                <th className="px-4 py-3 font-medium">#</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user, index) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-600">{index + 1}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{user.name}</td>
                  <td className="px-4 py-3 text-gray-600">{user.email}</td>
                  <td className="px-4 py-3 text-gray-600">{user.phoneNumber}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center space-x-2">
                      <button 
                        className="bg-red-500 hover:bg-red-600 text-white p-1 rounded"
                        title="Delete User"
                        onClick={() => handleDeleteClick(user)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-4 py-6 text-center text-gray-500">
                    {searchTerm ? 'No users found matching your search.' : 'No users found in the system.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 z-60">
            <div className="flex items-start">
              <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Delete User</h3>
                <p className="text-sm text-gray-500 mt-2">
                  Are you sure you want to delete this user? This action cannot be undone.
                </p>
                {deleteError && <div className="mt-2 text-sm text-red-600">{deleteError}</div>}
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded hover:bg-gray-100"
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersList;