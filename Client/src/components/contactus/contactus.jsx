import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./contactus.css";
import config from "../../utils/configurl";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    message: "",
  });

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.mobile || !formData.message) {
      toast.error("All fields are required", { position: "top-right", autoClose: 3000 });
      return;
    }

    try {
      const response = await axios.post(`${config.BASE_API_URL}/admin/contactsupport`, formData);
      toast.success(response.data.message, { position: "top-right", autoClose: 3000 });

      // Clear form after successful submission
      setFormData({ name: "", email: "", mobile: "", message: "" });
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to submit contact request";
      toast.error(errorMessage, { position: "top-right", autoClose: 3000 });
    }
  };

  return (
    <div className="contactus-container">
      <div className="contactus-form-container-outer">
        <h1 className="contactus-heading">CONTACT US</h1>
        <p className="contactus-heading-desc">
          Have questions or need assistance with your construction equipment rental? 
          Contact us via phone, email, or our online form for quick and reliable support. 
          We're here to ensure a seamless experience and assist you every step of the way!
        </p>
        <form onSubmit={handleSubmit} className="contactus-form-container">
          <div className="contactus-form-flex">
            <div className="contactus-conts">
          <div className="contactus-left">
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="contactus-input"
              value={formData.name}
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="contactus-input"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              type="tel"
              name="mobile"
              placeholder="Mobile"
              className="contactus-input"
              value={formData.mobile}
              onChange={handleChange}
            />
          </div>
          <div className="contactus-right">
            <textarea
              name="message"
              placeholder="Your Message"
              className="contactus-textarea"
              value={formData.message}
              onChange={handleChange}
            ></textarea>
          </div>
          </div>
          <div className="contactus-btn">
          <button type="submit">Submit</button>
          </div>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ContactUs;
