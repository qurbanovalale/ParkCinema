import React, { useState, useContext } from 'react'
import Dropdown from './Dropdown'
import { Link } from 'react-router-dom'
import { MovieContext } from '../Context/DataContext'
import { FaBars, FaTimes, FaSun, FaMoon } from 'react-icons/fa'

function Navbar({ transparent }) {
  const { theme, toggleTheme } = useContext(MovieContext)
  const [menuOpen, setMenuOpen] = useState(false)

  const textColor = transparent 
    ? 'text-white' 
    : (theme === 'light' ? 'text-neutral-800' : 'text-white')

  const hoverColor = 'hover:text-red-500'

  return (
    <>
      <div className="absolute top-0 left-0 w-full z-20 flex justify-between items-center px-4 md:px-10 py-5 bg-transparent">
        {/* Left Section: Logo & Desktop Navigation */}
        <div className="flex items-center gap-4 md:gap-[40px]">
          <Link to="/">
            <img src="https://new.parkcinema.az/images/logo.svg" width={120} height={60} className="w-[110px] h-auto md:w-[130px]" alt="logo" />
          </Link>
          
          <nav className="hidden lg:flex items-center space-x-6 text-[17px] gap-[25px] font-bold">
            <a href="#" className={`transition-all ${textColor} ${hoverColor}`}>Kinoteatrlar</a>
            <a href="#" className={`transition-all ${textColor} ${hoverColor}`}>Aksiyalar</a>
            <a href="#" className={`transition-all ${textColor} ${hoverColor}`}>FAQ</a>
            <a href="#" className={`transition-all ${textColor} ${hoverColor}`}>Əlaqə</a>
            <Link to="/profile" className={`transition-all ${textColor} ${hoverColor}`}>Profil</Link>
          </nav>
        </div>

        {/* Right Section: Theme Toggle, Language Dropdown & Burger Menu Icon */}
        <div className="flex items-center gap-3 md:gap-5">
          {/* Theme Toggle Button (Desktop) */}
          <button 
            onClick={toggleTheme}
            className={`hidden lg:flex p-2.5 rounded-full items-center justify-center cursor-pointer transition-all ${
              transparent 
                ? 'bg-white/10 hover:bg-white/20 text-yellow-400' 
                : (theme === 'light' 
                    ? 'bg-neutral-200 hover:bg-neutral-300 text-black shadow' 
                    : 'bg-neutral-800 hover:bg-neutral-700 text-yellow-400')
            }`}
            title={theme === 'light' ? "Qaranlıq Rejim" : "Aydınlıq Rejim"}
          >
            {theme === 'light' ? <FaMoon size={16} /> : <FaSun size={16} />}
          </button>

          {/* Language Dropdown */}
          <Dropdown textColor={textColor} />

          {/* Hamburger Icon Button (Mobile/Tablet) */}
          <button
            onClick={() => setMenuOpen(true)}
            className={`lg:hidden p-2 rounded-xl transition-all cursor-pointer ${textColor}`}
          >
            <FaBars size={22} />
          </button>
        </div>

        {/* Mobile Sidebar Navigation Drawer */}
        <div className={`fixed inset-0 z-50 flex justify-end transition-opacity duration-300 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}>
          {/* Overlay background */}
          <div 
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Drawer Content */}
          <div className={`relative w-[280px] max-w-full h-full flex flex-col p-6 shadow-2xl transition-transform duration-300 transform ${
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          } ${
            theme === 'light' ? 'bg-white text-neutral-850' : 'bg-[#141414] text-white'
          }`}>
            {/* Header: Close Button & Logo */}
            <div className="flex justify-between items-center border-b pb-4 mb-6 border-neutral-200 dark:border-neutral-850">
              <img src="https://new.parkcinema.az/images/logo.svg" width={100} height={50} alt="logo" />
              <button 
                onClick={() => setMenuOpen(false)}
                className={`p-2 rounded-xl cursor-pointer ${
                  theme === 'light' ? 'text-black hover:bg-neutral-100' : 'text-white hover:bg-neutral-900'
                }`}
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Links */}
            <nav className="flex flex-col gap-5 text-lg font-extrabold flex-1">
              <a href="#" onClick={() => setMenuOpen(false)} className={`transition-all ${theme === 'light' ? 'text-neutral-800' : 'text-white'} hover:text-red-500`}>Kinoteatrlar</a>
              <a href="#" onClick={() => setMenuOpen(false)} className={`transition-all ${theme === 'light' ? 'text-neutral-800' : 'text-white'} hover:text-red-500`}>Aksiyalar</a>
              <a href="#" onClick={() => setMenuOpen(false)} className={`transition-all ${theme === 'light' ? 'text-neutral-800' : 'text-white'} hover:text-red-500`}>FAQ</a>
              <a href="#" onClick={() => setMenuOpen(false)} className={`transition-all ${theme === 'light' ? 'text-neutral-800' : 'text-white'} hover:text-red-500`}>Əlaqə</a>
              <Link to="/profile" onClick={() => setMenuOpen(false)} className={`transition-all ${theme === 'light' ? 'text-neutral-800' : 'text-white'} hover:text-red-500`}>Profil</Link>
            </nav>

            {/* Mobile Footer: Theme Toggle inside drawer */}
            <div className="border-t pt-4 mt-auto flex items-center justify-between border-neutral-200 dark:border-neutral-850">
              <span className="text-sm font-semibold">Mövzu:</span>
              <button 
                onClick={() => {
                  toggleTheme();
                  setMenuOpen(false);
                }}
                className={`p-2.5 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                  theme === 'light' ? 'bg-neutral-200 text-black shadow' : 'bg-neutral-800 text-yellow-400'
                }`}
              >
                {theme === 'light' ? <FaMoon size={16} /> : <FaSun size={16} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar
