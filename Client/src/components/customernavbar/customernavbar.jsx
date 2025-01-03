import React, { useState } from "react";
import "./customernavbar.css";
import logo1 from "/loginlogo.png"; // Replace with your image path
import logo2 from "/ezrent.png"; // Replace with your image path
import locationIcon from "/locationlogo.png"; // Replace with your image path

const CustomerNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
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
        </ul>
      </div>

      {/* Center Section: Location */}
      {/* <div className="navbar-center-mobile">
        <div className="navbar-location">
          <img src={locationIcon} alt="Location" className="navbar-location-icon" />
          <span>Coimbatore, TN</span>
        </div>
      </div> */}

      {/* Right Section: Login/Signup & Location */}
      <div className="navbar-right">
        <button className="navbar-button">Sign In</button>
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
        </ul>
        <button className="navbar-button">Sign In</button>
      </div>

    </nav>
  );
};

export default CustomerNavbar;
