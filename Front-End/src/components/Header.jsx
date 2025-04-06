import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { User, Plus, Moon, Sun, Menu, X } from 'lucide-react';
import { toggleTheme } from '../store/themeSlice';

const Header = () => {
  const isDark = useSelector((state) => state.theme.isDark);
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  // Prevent body scrolling when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  return (
    <>
      {/* Mobile Header */}
      <header className="md:hidden bg-white dark:bg-gray-900 shadow-md font-sans py-4 fixed top-0 left-0 right-0 z-30">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="text-gray-700 dark:text-gray-300"
          >
            <Menu size={24} className="stroke-2" />
          </button>
          
          <div className="flex-1 text-center">
            <a href="/" className="text-xl font-extrabold tracking-tight inline-block">
              <span className="text-black dark:text-white">ADvertise</span>
              <span className="text-primary">ments.lk</span>
            </a>
          </div>
          
          <a href="/login" className="text-gray-700 dark:text-gray-300">
            <User size={24} className="stroke-2" />
          </a>
        </div>
      </header>

      {/* Desktop Header */}
      <header className="hidden md:block bg-white dark:bg-gray-900 shadow-md font-sans py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="text-2xl font-extrabold tracking-tight">
              <span className="text-black dark:text-white">ADvertise</span>
              <span className="text-primary">ments.lk</span>
            </a>
          </div>

          {/* Center Navigation */}
          <nav className="flex items-center space-x-8">
            <a href="/" className="text-gray-700 dark:text-gray-300 hover:text-primary font-medium transition-colors">Home</a>
            <a href="/about" className="text-gray-700 dark:text-gray-300 hover:text-primary font-medium transition-colors">About Us</a>
            <a href="/contact" className="text-gray-700 dark:text-gray-300 hover:text-primary font-medium transition-colors">Contact Us</a>
            <a href="/business" className="text-gray-700 dark:text-gray-300 hover:text-primary font-medium transition-colors">Business</a>
          </nav>

          {/* Right Auth Buttons */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => dispatch(toggleTheme())} 
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              title="Toggle Theme"
            >
              {isDark ? 
                <Sun size={20} className="text-yellow-400 stroke-2" /> : 
                <Moon size={20} className="text-gray-800 stroke-2" />
              }
            </button>

            <a href="/login" className="flex items-center text-gray-700 dark:text-gray-300 hover:text-primary">
              <User size={20} className="mr-2 stroke-2" />
              <span className="font-medium">Log In</span>
            </a>
            <a href="/register" className="text-gray-700 dark:text-gray-300 hover:text-primary font-medium">
              Register
            </a>
            <a 
              href="/post-ad" 
              className="relative overflow-hidden group bg-primary text-white px-6 py-2 rounded-md flex items-center"
            >
              <span className="relative z-10 flex items-center font-medium">
                Post Your Ad
                <Plus size={20} className="ml-2 stroke-2" />
              </span>
              <span className="absolute inset-0 bg-orange-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></span>
            </a>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsMenuOpen(false)}
          ></div>
          
          {/* Drawer */}
          <div className="absolute top-0 left-0 bottom-0 w-4/5 max-w-xs bg-white dark:bg-gray-900 flex flex-col h-full">
            {/* Drawer Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <a 
                href="/post-ad" 
                className="relative overflow-hidden group bg-primary text-white px-6 py-2 rounded-md flex-1 flex items-center justify-center"
              >
                <span className="relative z-10 flex items-center font-medium">
                  Post Your Ad
                  <Plus size={20} className="ml-2 stroke-2" />
                </span>
                <span className="absolute inset-0 bg-orange-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></span>
              </a>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-700 dark:text-gray-300 ml-4"
              >
                <X size={24} className="stroke-2" />
              </button>
            </div>
            
            {/* Navigation Links */}
            <nav className="flex-1 overflow-y-auto p-4">
              <ul className="space-y-4">
                <li>
                  <a href="/" className="block text-gray-700 dark:text-gray-300 hover:text-primary font-medium py-2">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/about" className="block text-gray-700 dark:text-gray-300 hover:text-primary font-medium py-2">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="/contact" className="block text-gray-700 dark:text-gray-300 hover:text-primary font-medium py-2">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="/business" className="block text-gray-700 dark:text-gray-300 hover:text-primary font-medium py-2">
                    Business
                  </a>
                </li>
              </ul>
              
              <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-gray-600 dark:text-gray-400 font-medium">Email Address</div>
                <a href="mailto:support@advertisements.lk" className="text-primary">
                  support@advertisements.lk
                </a>
              </div>
              
              {/* Social Media Placeholder - Replace with actual icons */}
              <div className="mt-8 flex items-center space-x-4">
                <a href="#" className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-full">
                  <span className="text-primary">f</span>
                </a>
                <a href="#" className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-full">
                  <span className="text-primary">t</span>
                </a>
                <a href="#" className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-full">
                  <span className="text-primary">in</span>
                </a>
                <a href="#" className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-full">
                  <span className="text-primary">ig</span>
                </a>
              </div>
            </nav>
          </div>
        </div>
      )}
      
      {/* Spacer for fixed mobile header */}
      <div className="md:hidden h-16"></div>
    </>
  );
};

export default Header;