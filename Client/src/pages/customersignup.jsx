import React, { useState } from "react";
import "../css/login.css";
import loginlogo from "/loginlogo.jpg";
import loginbackground from "/loginbackground.webp"
import ezrent from "/ezrent.png"

const CustomerSignup = () => {
    const [userType, setUserType] = useState("");

    const handleUserTypeChange = (e) => {
      setUserType(e.target.value);
    };
  
  return (
    <div className="login-page">
        <img src={loginbackground} alt="Background" className="background-image" />
      <div className="login-card">
          <div className="login-image">
            <img
              src={loginlogo}
              height={80}
              alt="Signup Illustration"
              className="header-image"
            />
          </div>
        <img src={ezrent} alt="EZRent" className="ezrent" width={150} />
        <p>Your Partner in Construction Equipment Rental</p>
        <br></br>
        <form className="login-form">
          <input
            type="text"
            placeholder="Full Name"
            className="login-input"
          />
          <input
            type="text"
            placeholder="Mobile Number"
            className="login-input"
          />
          <input
            type="text"
            placeholder="Email Address"
            className="login-input"
          />
          <input
            type="password"
            placeholder="Password"
            className="login-input"
          />
            <select
              id="user-type"
              value={userType}
              onChange={handleUserTypeChange}
              className="login-input login-select"
            >
              <option value="">Do you want to Provide or Rent Equipments</option>
              <option value="rent">Want to rent equipment</option>
              <option value="provide">Want to provide equipment for rental</option>
            </select>
          <button type="submit" className="login-button">
            SIGN UP
          </button>
        </form>
        <a href="/login" className="create-account">
          Already have an account? Sign in here.
        </a>
      </div>
    </div>
  );
};

export default CustomerSignup;