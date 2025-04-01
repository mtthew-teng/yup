import React, { useState } from 'react'
import { MdOutlineDarkMode, MdLightMode } from "react-icons/md";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";

const Header = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="flex justify-between items-center p-4 bg-white border-b border-gray-100 mb-4">
      <div>
        <h1 className="text-xs text-gray-500">Welcome Back</h1>
        <p className="text-xl font-semibold text-gray-800">Matthew</p>
      </div>
      <div className="flex items-center space-x-5">
        <div className="hidden md:flex items-center space-x-4">
          <button className="relative text-xl text-gray-600 hover:text-indigo-500 transition-colors">
            <IoMdNotificationsOutline />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center text-white text-xs">
              2
            </span>
          </button>
          <button className="text-xl text-gray-600 hover:text-indigo-500 transition-colors">
            <IoSettingsOutline />
          </button>
        </div>
        <div className="flex items-center space-x-5">
          <button 
            className="relative text-xl text-gray-600 hover:text-indigo-500 transition-colors"
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <MdLightMode /> : <MdOutlineDarkMode />}
          </button>
          <div className="relative">
            <img
              className="w-10 h-10 rounded-full border-4 border-indigo-400 cursor-pointer"
              src="https://randomuser.me/api/portraits/men/3.jpg"
              alt="User avatar"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header