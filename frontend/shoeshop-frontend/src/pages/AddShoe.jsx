import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddShoeForm from '../components/inventory/AddShoeForm';
import { createShoe } from '../services/api.js';

const AddShoe = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const employeeData = localStorage.getItem('employee');
  
    if (!token || !employeeData) {
      navigate('/employeelogin');
      return;
    }
  
    const user = JSON.parse(employeeData);
  
    if (user.role === 'admin' || user.role === 'INVENTORY_MANAGER') {
      setIsAuthorized(true);
    } else {
      // Optional: redirect or show unauthorized message
      navigate('/unauthorized'); // Or you can navigate elsewhere
    }
    }, [navigate]);

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      const response = await createShoe(formData);
      console.log('Shoe created successfully:', response);
      navigate('/'); // Redirect to dashboard after success
    } catch (err) {
      setError('Failed to add shoe. Please check your input and try again.');
      // Error already logged in service
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/'); // Navigate back to dashboard
  };

  return (
    <div className="container mx-[100px] p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold"></h1>
        <div className="flex items-center mx-[180px] mt-6">
        <button
          onClick={handleBack}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-200"
        >
          Back to Dashboard
        </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <AddShoeForm onSubmit={handleSubmit} />

      {isSubmitting && (
        <div className="mt-4 text-center">
          <p className="text-gray-600">Submitting...</p>
        </div>
      )}
    </div>
  );
};

export default AddShoe;