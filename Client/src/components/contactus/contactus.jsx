import React from "react";
import "./contactus.css"; // Add CSS for styling

const ContactUs = () => {
  return (
    <div className="contactus-container">
      <h1 className="contactus-heading">CONTACT US</h1>
      <div className="contactus-form-container-outer">
        <div className="contactus-form-container">
        <div className="contactus-left">
          <input type="text" placeholder="Name" className="contactus-input" />
          <input type="email" placeholder="Email" className="contactus-input" />
          <input type="tel" placeholder="Mobile" className="contactus-input" />
        </div>
        <div className="contactus-right">
          <textarea
            placeholder="Your Message"
            className="contactus-textarea"
          ></textarea>
        </div>
        </div>
        <button>Submit</button>
      </div>
    </div>
  );
};

export default ContactUs;
