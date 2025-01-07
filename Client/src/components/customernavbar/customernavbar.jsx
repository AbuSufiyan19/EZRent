import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./customernavbar.css";
import logo1 from "/loginlogo.png";
import logo2 from "/ezrent.png";
import locationIcon from "/locationlogo.png";

const CustomerNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
  const navigate = useNavigate();

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // Update state based on token presence
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleSignInClick = () => {
    navigate("/login");
  };

  const handleLogoutClick = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    setIsLoggedIn(false); // Update state
    navigate("/"); // Redirect to login page
  };

  return (
    <nav className="navbar">
      {/* Left Section: Logos */}
      <div className="navbar-left">
        <a href="/#home">
          <img src={logo1} alt="Logo 1" className="navbar-logo1" />
        </a>
        <a href="/#home">
          <img src={logo2} alt="Logo 2" className="navbar-logo2" />
        </a>
      </div>

      {/* Center Section: Menu */}
      <div className={`navbar-center ${isMenuOpen ? "active" : ""}`}>
        <ul className="navbar-menu">
          <li><a href="/#home">Home</a></li>
          <li><a href="/#categories">Equipments</a></li>
          <li><a href="/#aboutus">About Us</a></li>
          <li><a href="/contactus">Contact</a></li>
          {isLoggedIn && (
            <li><a href="/mybookings">MyBookings</a></li>
          )}
        </ul>
      </div>

      {/* Right Section: Login/Signup & Location */}
      <div className="navbar-right">
        {isLoggedIn ? (
          <button className="navbar-button" onClick={handleLogoutClick}>
            Logout
          </button>
        ) : (
          <button className="navbar-button" onClick={handleSignInClick}>
            Sign In
          </button>
        )}
        <div className="navbar-location">
          <img src={locationIcon} alt="Location" className="navbar-location-icon" />
          <span>Coimbatore, TN</span>
        </div>
      </div>

      {/* Right Section: Hamburger Menu */}
      <div className="navbar-hamburger" onClick={toggleMenu}>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>

      {/* Sliding Menu */}
      <div className={`navbar-slide-menu ${isMenuOpen ? "open" : ""}`}>
        <ul className="navbar-menu-mobile">
          <li><a href="/#home" onClick={closeMenu}>Home</a></li>
          <li><a href="/#categories" onClick={closeMenu}>Equipments</a></li>
          <li><a href="/#aboutus" onClick={closeMenu}>About Us</a></li>
          <li><a href="/contactus" onClick={closeMenu}>Contact</a></li>
          {isLoggedIn && (
            <li><a href="/mybookings">MyBookings</a></li>
          )}
        </ul>
        {isLoggedIn ? (
          <button className="navbar-button" onClick={handleLogoutClick}>
            Logout
          </button>
        ) : (
          <button className="navbar-button" onClick={handleSignInClick}>
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
};

export default CustomerNavbar;
