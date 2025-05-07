import React from 'react';
import contact from "../assets/contact.jpg";

const ContactUs = () => {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center">Contact Us</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left: Image */}
        <div className="flex justify-center">
          <img
            src={contact}
            alt="Contact Us"
            className="w-full h-auto rounded shadow-lg max-w-md"
          />
        </div>

        {/* Right: Contact Details */}
        <div className="bg-gray-100 p-6 rounded shadow-md space-y-6">
          <div>
            <h3 className="text-xl font-semibold">🏪 Our Address</h3>
            <p>No 23 Hakmana Road,<br />Thihagoda,<br />Matara</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold">📞 Phone</h3>
            <p>+94 71 234 5678</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold">✉️ Email</h3>
            <p>anshoe@gmail.com</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold">⏰ Working Hours</h3>
            <p>Mon - Sat: 9:00 AM - 6:00 PM<br />Sunday: Closed</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;

