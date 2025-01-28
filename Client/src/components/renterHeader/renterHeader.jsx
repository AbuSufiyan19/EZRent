import React from "react";
import { useNavigate } from "react-router-dom"; // Correct import for useNavigate
import "./renterHeader.css";
import logout from "/logout.webp";

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate(); // Initialize the navigate hook

  const handleLogoutClick = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    navigate("/"); // Navigate to the login page
  };

  return (
    <header className="header">
      <button className="menu-btn" onClick={toggleSidebar}>
        ☰
      </button>
      <h1>Construction Equipments Rental</h1>
      <div className="search-profile">
        <img
          className="profile-icon"
          src={logout}
          alt="Logout"
          onClick={handleLogoutClick} // Correct onClick handler
          style={{ cursor: "pointer" }} // Adds pointer cursor on hover
        />
      </div>
    </header>
  );
};

export default Header;
