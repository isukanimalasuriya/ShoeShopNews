import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EditShoeForm from "../components/inventory/EditShoeForm";
import { getShoe, updateShoe } from "../services/api.js";

const EditShoe = () => {
  const { id } = useParams(); // Get shoe ID from URL
  const navigate = useNavigate();
  const [shoe, setShoe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchShoe();
  }, [id]);

  const fetchShoe = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getShoe(id);
      setShoe(data);
    } catch (err) {
      setError("Failed to load shoe details. Please try again.");
      // Error already logged in service
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      const response = await updateShoe(id, formData);
      console.log("Shoe updated successfully:", response);
      navigate("/"); // Redirect to dashboard after success
    } catch (err) {
      setError("Failed to update shoe. Please check your input and try again.");
      // Error already logged in service
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate("/"); // Navigate back to dashboard
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center mt-8">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error && !shoe) {
    return (
      <div className="container mx-[550px] p-4 text-center mt-8">
        <p className="text-red-500">{error}</p>
        <button
          onClick={fetchShoe}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
        >
          Retry
        </button>
        <button
          onClick={handleBack}
          className="mt-4 ml-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-200"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!shoe) {
    return (
      <div className="container mx-auto p-4 text-center mt-8">
        <p className="text-gray-600">Shoe not found</p>
        <button
          onClick={handleBack}
          className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-200"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

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

      <EditShoeForm shoeData={shoe} onSubmit={handleSubmit} />

      {isSubmitting && (
        <div className="mt-4 text-center">
          <p className="text-gray-600">Updating...</p>
        </div>
      )}
    </div>
  );
};

export default EditShoe;
