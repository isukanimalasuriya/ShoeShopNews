import React, { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FiSearch,
  FiUser,
  FiShoppingCart,
  FiMenu,
  FiArrowLeft,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const NavBar2 = () => {
  const [visible, setVisible] = useState(false);
  const{setShowSearch} = useContext(ShopContext)
  const [cartCount, setCartCount] = useState(0);

  const { getCartCount } = useContext(ShopContext);

  const { user, isAuthenticated, logout } = useAuthStore();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/customerlogin");
  };

  const navigateorders = () => {
    navigate("/orders");
  };

  const navigateWishlist =() => {
      navigate("/wishlist");
  }

  const handleIconClick = () => {
    if (!isAuthenticated || !user) {
      navigate("/customerlogin");
    }
  };

   
  

  //  const fetchCartCount = async () => {
  //   try {
  //     const res = await axios.get(`http://localhost:5000/api/cart/count/${user._id}`);
  //     setCartCount(res.data.itemCount); // Store the count in state
  //   } catch (err) {
  //     console.error("Failed to fetch cart count:", err);
  //   }
  // };
  
  // useEffect(() => {
  //   if (user && user._id) {
  //     fetchCartCount();
  //   }
  // }, []);
 
  
  

  return (
    <div className="flex items-center justify-between py-5 font-medium ml-10 mr-10 text-lg font-display">
      <Link to="/">
        <span className="text-xl w-36">
          <img src="" /> Shoe Paradise
        </span>
      </Link>

      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        <NavLink to="/" className="flex flex-col items-center gap-1">
          <p>HOME</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>

        <NavLink to="/Collection" className="flex flex-col items-center gap-1 ">
          <p>COLLECTION</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden " />
        </NavLink>

        <NavLink to="/About" className="flex flex-col items-center gap-1">
          <p>ABOUT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden " />
        </NavLink>

        <NavLink to="/Contact" className="flex flex-col items-center gap-1">
          <p>CONTACT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden " />
        </NavLink>
      </ul>

      <div className="flex items-center gap-6">
        {!isAuthenticated && (
          <Link
            to="/customerlogin"
            className="bg-black text-white px-4 py-2 rounded-full text-sm hover:bg-gray-800 transition-colors duration-300 flex items-center gap-2"
          >
            Login
          </Link>
        )}
        <FiSearch onClick={()=>setShowSearch(true)}className="w-5 cursor-pointer" />
        <div className="group relative" onClick={handleIconClick}>
          <FiUser className="w-5 cursor-pointer" />
          {isAuthenticated && user && (
            <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
              <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded">
                <Link to="/customerdashboard">
                  <p className="cursor-pointer hover:text-black">My Profile</p>
                </Link>
                <p
                  className="cursor-pointer hover:text-black"
                  onClick={navigateorders}
                >
                  Orders
                </p>
                <p className="cursor-pointer hover:text-black" onClick={navigateWishlist}>WishList</p>
                <p
                  onClick={handleLogout}
                  className="cursor-pointer hover:text-black"
                >
                  Logout
                </p>
              </div>
            </div>
          )}
        </div>

        <div
          className="relative cursor-pointer"
          onClick={() => {
            if (isAuthenticated && user) {
              navigate("/cart");
            } else {
              navigate("/customerlogin");
            }
          }}
        >
          <FiShoppingCart className="w-5 min-w-5" />
          <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 ">
           
          </p>
        </div>

        <FiMenu
          onClick={() => setVisible(true)}
          className="w-5 cursor-pointer sm:hidden"
        />
      </div>
      <div
        className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${
          visible ? "w-full" : "w-0"
        }`}
      >
        <div className="flex flex-col text-gray-600">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p-3 cursor-pointer"
          >
            <FiArrowLeft />
            <span>Back</span>
          </div>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/"
          >
            HOME
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/Collection"
          >
            COLLECTION
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/About"
          >
            ABOUT
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/Contact"
          >
            CONTACT
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default NavBar2;
