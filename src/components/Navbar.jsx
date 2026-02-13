import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark, faSearch, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import useResize from '../state/windowSize';
import Logo from '../assets/s.png';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setLogout } from '../state/States'; // Adjust path to your slice file

const Navbar = () => {
  const size = useResize();
  const [isClicked, setIsClicked] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  // Get user and cart data from Redux
  const LoggedInUser = useSelector((state) => state.item?.user);
  const cartItems = useSelector((state) => state.item?.cartItems || {});

  // Calculate total cart items quantity
  const cartCount = Object.values(cartItems).reduce(
    (total, item) => total + (item.quantity || 1),
    0
  );

  const mobList = () => setIsClicked(!isClicked);

  // Close dropdown/search on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setShowSearch(false);
    }
  };

  return (
    <div className="navbar-container bg-white shadow-md">
      {size.width < 768 ? (
        // Mobile Navbar
        <div className="mob-navbar flex items-center justify-between p-4">
          <div className="mob-navbar-menu">
            <FontAwesomeIcon
              icon={faBars}
              className="text-2xl cursor-pointer hover:text-blue-600 transition-colors duration-200"
              onClick={mobList}
            />
          </div>

          <div className="mob-navbar-icon">
            <img src={Logo} alt="Logo" className="h-10" />
          </div>

          <div className="flex items-center space-x-6">
            {/* Search Icon */}
            <FontAwesomeIcon
              icon={faSearch}
              className="text-2xl cursor-pointer hover:text-blue-600 transition-colors duration-200"
              onClick={() => setShowSearch(!showSearch)}
            />

            {/* Cart Icon */}
            <div className="relative cursor-pointer" onClick={() => navigate('/cart')}>
              <FontAwesomeIcon
                icon={faShoppingCart}
                className="text-2xl hover:text-blue-600 transition-colors duration-200"
              />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
          </div>

          {showSearch && (
            <div ref={searchRef} className="fixed top-16 left-0 right-0 bg-white shadow-md p-4 z-50">
              <form onSubmit={handleSearch} className="flex items-center relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {searchQuery && (
                  <FontAwesomeIcon
                    icon={faXmark}
                    className="absolute right-20 text-gray-500 cursor-pointer"
                    onClick={() => setSearchQuery('')}
                  />
                )}
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-3 rounded-r-lg hover:bg-blue-700"
                >
                  Search
                </button>
              </form>
            </div>
          )}

          {isClicked && (
            <>
              <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={mobList} />

              <div className="mob-navbar-list fixed top-0 left-0 right-0 bg-white shadow-xl z-50 flex flex-col">
                <div className="mob-navbar-men flex items-center justify-between px-6 py-4 border-b">
                  <span className="text-lg font-semibold">Menu</span>
                  <FontAwesomeIcon
                    icon={faXmark}
                    className="text-2xl cursor-pointer hover:text-red-600 transition-colors duration-200"
                    onClick={mobList}
                  />
                </div>

                <div className="w-full px-6 py-4 hover:bg-gray-100 cursor-pointer transition-colors duration-200 text-lg font-medium">
                  Men
                </div>
                <div className="w-full px-6 py-4 hover:bg-gray-100 cursor-pointer transition-colors duration-200 text-lg font-medium">
                  Women
                </div>
                <div className="w-full px-6 py-4 hover:bg-gray-100 cursor-pointer transition-colors duration-200 text-lg font-medium">
                  T-shirts
                </div>
                <div className="w-full px-6 py-4 hover:bg-gray-100 cursor-pointer transition-colors duration-200 text-lg font-medium">
                  Pants
                </div>

                <div className="w-full px-6 py-5 bg-blue-600 text-white font-bold text-center hover:bg-blue-700 cursor-pointer transition-colors duration-200 text-lg">
                  {LoggedInUser ? (
                    `Hi, ${LoggedInUser.displayName?.split(' ')[0] || 'User'}!`
                  ) : (
                    <span onClick={() => { mobList(); navigate('/loginpage'); }}>
                      Login
                    </span>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        // Desktop Navbar
        <div className="desktop-navbar flex items-center justify-between px-8 py-4">
          <div className="navbar-icon">
            <img src={Logo} alt="Logo" className="h-12" />
          </div>

          {/* Search + Menu */}
          <div className="flex items-center flex-1 justify-center space-x-8">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="w-full max-w-md">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full py-2 px-4 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                <FontAwesomeIcon
                  icon={faSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                  onClick={handleSearch}
                />
              </div>
            </form>

            {/* Menu Items */}
            <div className="flex items-center space-x-8">
              <div className="navbar-men px-6 py-3 text-gray-700 font-medium cursor-pointer hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-all duration-200">
                Men
              </div>
              <div className="navbar-women px-6 py-3 text-gray-700 font-medium cursor-pointer hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-all duration-200">
                Women
              </div>
              <div className="navbar-tshirts px-6 py-3 text-gray-700 font-medium cursor-pointer hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-all duration-200">
                T-shirts
              </div>
              <div className="navbar-pants px-6 py-3 text-gray-700 font-medium cursor-pointer hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-all duration-200">
                Pants
              </div>
            </div>
          </div>

          {/* Cart + Greeting */}
          <div className="flex items-center space-x-8">
            {/* Cart Icon */}
            <div className="relative cursor-pointer" onClick={() => navigate('/cart')}>
              <FontAwesomeIcon
                icon={faShoppingCart}
                className="text-2xl hover:text-blue-600 transition-colors duration-200"
              />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>

            {/* Greeting + Dropdown */}
            <div className="relative" ref={dropdownRef}>
              {LoggedInUser ? (
                <div className="relative">
                  <p
                    className="font-bold p-2 flex items-center justify-center cursor-pointer hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    Hi, {LoggedInUser.displayName?.split(' ')[0] || 'User'}!
                  </p>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-200 z-50">
                      <button
                        className="w-full px-4 py-3 text-left text-red-600 hover:bg-gray-100 hover:text-red-700 transition-colors duration-200 font-medium"
                        onClick={() => {
                          dispatch(setLogout());
                          navigate('/');
                          setShowDropdown(false);
                        }}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  className="w-full py-3 px-8 bg-blue-600 text-white font-semibold rounded-2xl hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                  onClick={() => navigate('/loginpage')}
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;