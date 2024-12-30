import React from "react";
import "../css/login.css";
import loginlogo from "/loginlogo.png"
// import googlelogo from "/googlelogo.png"
import loginbackground from "/loginbackground.jpg"
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
        {/* <button className="google-signin">
          <img
            src={googlelogo}
            alt="Google"
            className="google-icon"
          />
          <p>Sign In With Google</p>
        </button>
        <div className="divider">OR</div> */}
        <br></br>
        <form className="login-form">
          <input
            type="email"
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
            SIGN IN
          </button>
        </form>
        <div className="create-account">
        <p>Don't have an account?&nbsp;</p>
        <a href="/customersignup">
          Sign Up
        </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
