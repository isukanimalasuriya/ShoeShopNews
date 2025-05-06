import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Search from "../assets/search.png";
import Cross from "../assets/cross.png";
import {useLocation} from 'react-router-dom'
const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
  const [visible,setVisible] = useState(false)
  const location = useLocation();

  useEffect(()=>{
    if(location.pathname.includes('Collection')){
        setVisible(true);
    }else{
        setVisible(false)
    }
    
   //console.log(location.pathname)
  },[location])

  return showSearch && visible? (
<div className='border-t border-b bg-gray-50 text-center px-4 py-4'>
  <div className='flex items-center justify-between border border-gray-400 px-4 py-2 rounded-full w-full sm:w-2/3 md:w-1/2 lg:w-1/3 mx-auto'>
    <input
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className='flex-grow outline-none bg-inherit text-sm md:text-base px-2'
      type='text'
      placeholder='Search...'
    />
    <img
      src={Search}
      alt='Search'
      className='w-5 h-5 sm:w-6 sm:h-6 ml-2 cursor-pointer'
    />
    <img
      onClick={() => setShowSearch(false)}
      src={Cross}
      alt='Close'
      className='w-5 h-5 sm:w-6 sm:h-6 ml-2 cursor-pointer'
    />
  </div>
</div>
  ) : null;
};

export default SearchBar;
