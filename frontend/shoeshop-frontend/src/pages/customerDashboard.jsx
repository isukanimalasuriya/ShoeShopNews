import React, { useState, useRef,useEffect } from 'react'
import { useAuthStore } from '../store/authStore';
import { useNavigate } from "react-router-dom";
import NavBar2 from '../components/NavBar2';
import axios from "axios";
import toast from "react-hot-toast";

const customerDashboard = () => {
    const { user, logout, isCheckingAuth } = useAuthStore();
    const [name, setName] = useState(user?.name || '');
    const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
    const [profilePicture, setProfilePicture] = useState(user?.profilePicture || '');
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const handleFileUpload = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      // Check file size (e.g., limit to 1024MB)
      if (file.size > 1000 * 1024 * 1024) {
          alert("File size should be less than 5MB");
          toast.error("Error");
          return;
      }

      // Create a FileReader to convert image to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
          try {
              // Set the profile picture preview
              setProfilePicture(reader.result);
          } catch (error) {
              console.error("Error uploading file", error);
          }
      };
      reader.readAsDataURL(file);
  };

    const handleUpdateProfile = async () => {
      try {
          const response = await axios.put("http://localhost:5000/api/auth/update-profile", {
              name,
              phoneNumber,
              profilePicture,
          }, { withCredentials: true });
  
          if (response.data.success) {
              console.log("Profile updated successfully");
              toast.success("Profile updated successfully")
              // Update the user data in your store or state
          } else {
              console.log("Failed to update profile");
              toast.error("Failed to update profile")
          }
      } catch (error) {
          console.log("Error updating profile", error);
      }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div>
    <div className="p-30 font-display">
        <div>
            <div className="flex items-center space-x-4 px-4 sm:px-0 relative">
                <div className="relative">
                    <img
                        src={profilePicture}
                        alt="Profile"
                        className="w-16 h-16 rounded-full border border-gray-300 object-cover"
                    />
                    <button 
                        onClick={triggerFileInput}
                        className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    >
                        +
                    </button>
                    <input 
                        type="file" 
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept="image/*"
                        className="hidden" 
                    />
                </div>
                <div>
                    <h3 className="text-base/7 font-semibold text-gray-900">Customer Information</h3>
                    <p className="mt-1 max-w-2xl text-sm/6 text-gray-500">Personal details.</p>
                </div>
            </div>
            <div className="mt-6 border-t border-gray-100">
                <dl className="divide-y divide-gray-100">
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm/6 font-medium text-gray-900">Full name</dt>
                        <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                            <input 
                                type="text" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                className="w-full border rounded px-2 py-1"
                            />
                        </dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm/6 font-medium text-gray-900">Mobile number</dt>
                        <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                            <input 
                                type="text" 
                                value={phoneNumber} 
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="w-full border rounded px-2 py-1"
                            />
                        </dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm/6 font-medium text-gray-900">Email address</dt>
                        <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{user?.email}</dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm/6 font-medium text-gray-900">Joined on An Shoe Paradise</dt>
                        <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{new Date(user.createdAt).toLocaleDateString("en-US", {
							            year: "numeric",
							            month: "long",
							            day: "numeric",
						            })}</dd>
                    </div>
                    {/* Rest of the existing code remains the same */}
                </dl>
                <button 
                    onClick={handleUpdateProfile}
                    className='px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition-all'
                >
                    Update Details
                </button>
            </div>
        </div>
    </div>
</div>
  )
}

export default customerDashboard
