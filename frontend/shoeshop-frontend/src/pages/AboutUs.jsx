import React from 'react';
import AboutusImage from '../assets/AboutUs.jpg'; // Make sure this path is correct

const AboutUs = () => {
  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-4 md:px-8 lg:px-12">

    {/* Text Content */}
    <div className="max-w-2xl">
    <h1 className="text-5xl font-bold text-gray-800 mb-6">ABOUT US</h1>
    <p className="text-gray-700 text-lg mb-6">
    An Shoe Shop was born out of a passion for innovation and a desire to transform the way people shop for footwear.
    Our journey began with a simple idea: to create a platform where customers can effortlessly discover, explore, and purchase stylish, high-quality shoes from the comfort of their homes.
    </p>
    <p className="text-gray-700 text-lg mb-6">
    Since our inception, we’ve worked tirelessly to curate a diverse selection of premium footwear that caters to every style, occasion, and personality. 
    From casual sneakers and elegant heels to durable boots and comfy sandals, we source our collections from trusted brands and skilled manufacturers who share our commitment to quality and comfort.
    </p>

    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
    <p className="text-gray-700 text-lg mb-6">
    An An Shoe Shop, our mission is to empower customers with choice, convenience, and confidence. 
    We are committed to delivering an exceptional shopping experience — from easy browsing and secure ordering to fast delivery and responsive customer support.
    </p>

    <h2 className="text-2xl font-semibold text-gray-800 mb-4">WHY CHOOSE US</h2>
    <ul className="list-disc list-inside text-gray-700 text-lg space-y-3">
      <li>
        <span className="font-semibold text-gray-900">Quality Assurance:</span> We meticulously select and vet each product 
        to ensure it meets our stringent quality standards.
      </li>
      <li>
        <span className="font-semibold text-gray-900">Convenience:</span> With our user-friendly interface and hassle-free 
        ordering process, shopping has never been easier.
      </li>
      <li>
        <span className="font-semibold text-gray-900">Exceptional Customer Service:</span> Our team of dedicated professionals 
        is here to assist you every step of the way — your satisfaction is our top priority.
      </li>
    </ul>
  </div>

  {/* Image Section */}
  <div>
    <img
      src={AboutusImage}
      alt="About Us"
      className="rounded-2xl shadow-xl w-full h-auto object-cover"
    />
  </div>
    </div>
  );
};

export default AboutUs;