import React from "react";
import "../css/login.css";
import loginlogo from "/loginlogo.jpg"
import googlelogo from "/googlelogo.png"
import loginbackground from "/loginbackground.webp"
import ezrent from "/ezrent.png"

const Login = () => {

  return (
    <div className="login-page">
            <img src={loginbackground} alt="Background" className="background-image" />
        <div className="login-card">
        <div className="login-image">
                <img 
                src={loginlogo}
                height={80}
                alt="Login Illustration" 
                className="header-image"
                />
            </div>
        <img src={ezrent} alt="EZRent" className="ezrent" width={150} height={25}/>
        <p>Your Partner in Construction Equipment Rental</p>
        <button className="google-signin">
          <img
            src={googlelogo}
            alt="Google"
            className="google-icon"
          />
          <p>Sign In With Google</p>
        </button>
        <div className="divider">OR</div>
        <form className="login-form">
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
          <a href="/" className="forgot-password">
            Forgot Password?
          </a>
          <button type="submit" className="login-button">
            LOG IN
          </button>
        </form>
        <a href="/customersignup" className="create-account">
          Create new account
        </a>
      </div>
    </div>
  );
};

export default Login;