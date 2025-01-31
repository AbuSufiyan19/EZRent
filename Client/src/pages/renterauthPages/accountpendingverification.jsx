import React from "react";
import { useNavigate } from "react-router-dom";
import "./accountuploadidproof.css";
import logo from "/loginlogo.png";
import ezrent from "/ezrent.png";

const AccountPendingVerification = () => {
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
      <h2>Verification Pending</h2>
      <p>
        Your ID proof is currently under review and is being verified by our
        team. Please allow some time for the verification process to be
        completed. You will be notified once the verification is successfully
        done, and your account will be updated accordingly. Thank you for your
        patience.
      </p>
      <button className="go-to-homepage" onClick={handleLogoClick}>Go to Homepage</button>
    </div>
  );
};

export default AccountPendingVerification;
