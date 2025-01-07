import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/login.css";
import loginlogo from "/loginlogo.png";
import loginbackground from "/loginbackground.jpg";
import ezrent from "/ezrent.png";
import config from "../utils/configurl";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "email":
        if (!value) error = "Email is required";
        else if (!/^\S+@\S+\.\S+$/.test(value)) error = "Enter a valid email address";
        break;
      case "password":
        if (!value) error = "Password is required";
        break;
      default:
        break;
    }
    return error;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validate the specific field on input change
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setIsSubmitting(true);

    try {
      const response = await axios.post(`${config.BASE_API_URL}/auth/login`, {
        email: formData.email,
        password: formData.password,
      });
    
      setIsSubmitting(false);
    
      // Success: Handle login success message and redirect
      setSuccessMessage(response.data.message || "Login successful!");
      setErrorMessage("");
    
      // Optionally save the token and user info to localStorage or state
      localStorage.setItem("token", response.data.token);
          
      const userType = response.data.userType;
    if (userType === "customer") {
      navigate("/");
    } else {
      navigate("/renterhome");
    }
    } catch (error) {
      setIsSubmitting(false);
    
      // Handle error response
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          setErrorMessage(data.message || "Invalid email or password.");
        } else if (status === 403) {
          setErrorMessage(data.message || "Please verify your email before logging in.");
        } else {
          setErrorMessage(data.message || "Something went wrong. Please try again.");
        }
      } else {
        // Handle network or unknown errors
        setErrorMessage("Unable to connect to the server. Please try again.");
      }
    
      setSuccessMessage("");
    }    
  };

  return (
    <div className="login-page">
      <img src={loginbackground} alt="Background" className="background-image" />
      <div className="login-card">
        <div className="login-image">
          <img src={loginlogo} height={80} alt="Login Illustration" className="header-image" />
        </div>
        <img src={ezrent} alt="EZRent" className="ezrent" width={150} />
        <p>Your Partner in Construction Equipment Rental</p>
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleInputChange}
            className="login-input"
          />
          {errors.email && <span className="error-text">{errors.email}</span>}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            className="login-input"
          />
          {errors.password && <span className="error-text">{errors.password}</span>}

          <a href="/forgot-password" className="forgot-password">
            Forgot Password?
          </a>

          <button type="submit" className="login-button" disabled={isSubmitting}>
            {isSubmitting ? "Signing In..." : "SIGN IN"}
          </button>
        </form>

        {successMessage && <div className="success-message">{successMessage}</div>}
        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <div className="create-account">
          <p>Don't have an account?&nbsp;</p>
          <a href="/customersignup">Sign Up</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
