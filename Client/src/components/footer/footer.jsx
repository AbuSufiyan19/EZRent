import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faPhoneAlt, faClock, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import "./footer.css"; // Add CSS for styling
import loginlogo from "/loginlogo.png"

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-section about-company">
        <h3>About Company</h3>
        <div className="company-logo">
          <a href="/#home">
              <img src={loginlogo} alt="EZRent" className="logo" />
          </a>
          <h4>EZRent <br />Construction Equipment Rental</h4>
        </div>
        <p>
        Your ultimate partner in construction equipment rental.
        Join us today and explore a world of possibilities!
        </p>
      </div>

      <div className="footer-section information">
        <h3>Information</h3>
        <ul>
          <li><a href="/#home">Main Home</a></li>
          <li><a href="/#categories">Categories</a></li>
          <li><a href="/#equipment">Search</a></li>
          <li><a href="/contactus">Contact Us</a></li>
          <li><a href="/#aboutus">About Us</a></li>
        </ul>
      </div>

      <div className="footer-section contact-info">
        <h3>Contact Info</h3>
        <ul>
          <li>
            <FontAwesomeIcon icon={faMapMarkerAlt} /> 
            Address: 679 Avinashi Road, Pilamedu, Coimbatore
          </li>
          <li>
            <FontAwesomeIcon icon={faPhoneAlt} /> 
            Custom Support & Sale: +1-5050-607080
          </li>
          <li>
            <FontAwesomeIcon icon={faClock} /> 
            Working Time: Mon-Sat: 9 AM – 5 PM
          </li>
          <li>
            <FontAwesomeIcon icon={faEnvelope} /> 
            Email: <a href="mailto:ezrentalservice@gmail.com">ezrentalservice@gmail.com</a>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
