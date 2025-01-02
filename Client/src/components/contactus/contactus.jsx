import React from "react";
import "./contactus.css"; // Add CSS for styling

const ContactUs = () => {
  return (
    <div className="contactus-container">
      <div className="contactus-form-container-outer">
      <h1 className="contactus-heading">CONTACT US</h1>
      <p className="contactus-heading-desc">Have questions or need assistance with your construction equipment rental? Contact us via phone, email, or our online form for quick and reliable support.
      We're here to ensure a seamless experience and assist you every step of the way!
      </p>
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
