import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/login.css";
import "../css/popup.css"
import loginlogo from "/loginlogo.png";
import loginbackground from "/loginbackground.jpg";
import ezrent from "/ezrent.png";
import axios from "axios";
import config from "../utils/configurl";

const CustomerSignup = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "fullName":
        if (!value.trim()) error = "Full Name is required";
        else if (!/^[A-Za-z\s]+$/.test(value)) error = "Full Name must contain only letters and spaces";
        break;
        case "mobileNumber":
          if (!value) error = "Mobile Number is required";
          else if (!/^\d{10}$/.test(value)) error = "Mobile Number must be a valid 10-digit number";
          else if (/^(.)\1{9}$/.test(value)) error = "Continuous numbers are not allowed"; // Checks for repeated digits like 0000000000
          break;
        case "email":
          if (!value) error = "Email is required";
          else if (!/^\S+@\S+\.\S+$/.test(value)) error = "Enter a valid email address";
          break;
        case "password":
          if (!value) error = "Password is required";
          else if (value.length < 8) error = "Password must be at least 8 characters long";
          else if (!/[A-Z]/.test(value)) error = "Password must contain at least one uppercase letter";
          else if (!/[a-z]/.test(value)) error = "Password must contain at least one lowercase letter";
          else if (!/\d/.test(value)) error = "Password must contain at least one number";
          else if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) error = "Password must contain at least one special character";
          break;
      case "confirmPassword":
        if (value !== formData.password) error = "Passwords do not match";
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

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
    if (!e.target.value) {
      setErrors((prev) => ({ ...prev, userType: "Please select an option" }));
    } else {
      setErrors((prev) => ({ ...prev, userType: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    if (!userType) newErrors.userType = "Please select an user type";
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
      const response = await axios.post(`${config.BASE_API_URL}/auth/register`, {
        fullName: formData.fullName,
        mobileNumber: formData.mobileNumber,
        email: formData.email,
        password: formData.password,
        userType,
      });

      setIsSubmitting(false);
      setSuccessMessage(response.data.message || "Registration successful! Please check your email to verify.");
      setErrorMessage("");

      setTimeout(() => {
        navigate("/login"); 
      }, 2000);
    } catch (error) {
      setIsSubmitting(false);
  
      // Check for a 400 error response
      if (error.response.status === 400) {
        setErrorMessage("This email is already associated with an account that is verified.");  // Display the message from the backend
      } else {
        setErrorMessage("Something went wrong. Please try again.");  // Default error message
      }
      setSuccessMessage("");  // Clear success message in case of error
    }
  };

  return (
    <div className="login-page">
      <img src={loginbackground} alt="Background" className="background-image" />
      <div className="login-card">
        <div className="login-image">
          <img src={loginlogo} height={80} alt="Signup Illustration" className="header-image" />
        </div>
        <img src={ezrent} alt="EZRent" className="ezrent" width={150} />
        <p>Your Partner in Construction Equipment Rental</p>
        <br />
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            className="login-input"
          />
          {errors.fullName && <span className="error-text">{errors.fullName}</span>}

          <input
            type="tel"
            placeholder="Mobile Number"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleInputChange}
            className="login-input"
          />
          {errors.mobileNumber && <span className="error-text">{errors.mobileNumber}</span>}

          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="login-input"
          />
          {errors.email && <span className="error-text">{errors.email}</span>}

          <input
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="login-input"
          />
          {errors.password && <span className="error-text">{errors.password}</span>}

          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="login-input"
          />
          {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}

          <select
            id="user-type"
            value={userType}
            onChange={handleUserTypeChange}
            className="login-input login-select"
          >
            <option value="">Do you want to Provide or Rent Equipments</option>
            <option value="customer">Want to rent equipment</option>
            <option value="provider">Want to provide equipment for rental</option>
          </select>
          {errors.userType && <span className="error-text">{errors.userType}</span>}

          <button type="submit" className="login-button" disabled={isSubmitting}>
            {isSubmitting ? "Signing Up..." : "SIGN UP"}
          </button>
        </form>

        {successMessage && <div className="success-message">{successMessage}</div>}
        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <div className="create-account">
          <p>Already have an account?&nbsp;</p>
          <a href="/login">Sign In</a>
        </div>
      </div>
    {successMessage && (
      <div className="modal-overlay">
        <div className="modal">
          <h3>Success!</h3>
          <p>{successMessage}</p>
          <button onClick={() => navigate("/login")}>Go to Login</button>
        </div>
      </div>
    )}

    {/* Error Message Modal */}
    {errorMessage && (
      <div className="modal-overlay">
        <div className="modal">
          <h3>Error!</h3>
          <p>{errorMessage}</p>
          <button onClick={() => setErrorMessage("")}>Close</button>
        </div>
      </div>
    )}
    </div>
  );
};

export default CustomerSignup;
