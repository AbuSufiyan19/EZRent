import React from "react";
import { useNavigate } from "react-router-dom";
import "./accountuploadidproof.css";
import logo from "/loginlogo.png";
import ezrent from "/ezrent.png";

const RenterAccountBlocked = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/"); // Navigate to the homepage
  };

  return (
    <div className="upload-container">
      <img
        src={logo}
        alt="logo"
        className="logo"
        onClick={handleLogoClick} // Handle click event
      />
      <img src={ezrent} alt="ezrent" className="ezrent" onClick={handleLogoClick}/>
      <h2>Account Blocked</h2>
      <p>Your account has been temporarily blocked due to issues with your verification process. This is a security measure to ensure the safety of your account. To resolve this and regain access, please contact the admin. We apologize for any inconvenience caused and appreciate your understanding. Our team is ready to assist you in getting your account back to normal.</p>
      <button className="go-to-homepage" onClick={handleLogoClick}>Go to Homepage</button>
      </div>
  );
};

export default RenterAccountBlocked;
