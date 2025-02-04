import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import config from "../utils/configurl";
import "../css/login.css";
import loginlogo from "/loginlogo.png";
import loginbackground from "/loginbackground.jpg";
import ezrent from "/ezrent.png";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "newPassword":
        if (!value) error = "Password is required";
        else if (value.length < 8) error = "Password must be at least 8 characters long";
        else if (!/[A-Z]/.test(value)) error = "Password must contain at least one uppercase letter";
        else if (!/[a-z]/.test(value)) error = "Password must contain at least one lowercase letter";
        else if (!/\d/.test(value)) error = "Password must contain at least one number";
        else if (!/[!@#$%^&*(),.?\":{}|<>]/.test(value)) error = "Password must contain at least one special character";
        break;
      case "confirmPassword":
        if (value !== formData.newPassword) error = "Passwords do not match";
        break;
      default:
        break;
    }
    return error;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validate the field
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate fields before submitting
    const newPasswordError = validateField("newPassword", formData.newPassword);
    const confirmPasswordError = validateField("confirmPassword", formData.confirmPassword);

    if (newPasswordError || confirmPasswordError) {
      setErrors({ newPassword: newPasswordError, confirmPassword: confirmPasswordError });
      return;
    }

    try {
      const response = await axios.post(`${config.BASE_API_URL}/auth/reset-password/${token}`, {
        newPassword: formData.newPassword,
      });

      toast.success(response.data.message || "Password reset successful!", { autoClose: 2000 });

      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error resetting password.", { autoClose: 3000 });
    }
  };

  return (
    <>
      <div className="login-page">
        <img src={loginbackground} alt="Background" className="background-image" />
        <div className="login-card">
          <div className="login-image">
            <img src={loginlogo} height={80} alt="Signup Illustration" className="header-image" />
          </div>
          <img src={ezrent} alt="EZRent" className="ezrent" width={150} />
          <p>Your Partner in Construction Equipment Rental</p>
          <br />
          <form onSubmit={handleSubmit} className="login-form">
            <input
              type="password"
              name="newPassword"
              placeholder="Enter new password"
              value={formData.newPassword}
              onChange={handleInputChange}
              className="login-input"
              required
            />
            {errors.newPassword && <span className="error-text">{errors.newPassword}</span>}

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="login-input"
              required
            />
            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            <br />

            <button type="submit" className="login-button" disabled={errors.newPassword || errors.confirmPassword}>
              Reset Password
            </button>
          </form>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </>
  );
};

export default ResetPassword;
