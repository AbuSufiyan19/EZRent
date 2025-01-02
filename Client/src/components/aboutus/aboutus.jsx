import React from "react";
import "./aboutus.css"; // Add CSS for styling

const AboutUs = () => {
  return (
    <section className="aboutus-container">
      <div className="aboutus-overlay">
        <h1 className="aboutus-title">ABOUT US</h1>
        <p className="aboutus-description">
        Welcome to EZRent, your trusted partner in transforming 
        the construction rental industry. Our mission is to bridge the gap between 
        equipment renters and local vendors, ensuring seamless access to the tools 
        and machinery you need to complete your projects efficiently.
        With a focus on innovation and convenience, we provide a user-friendly platform
        that simplifies the rental process. Whether you're a contractor, builder, or 
        individual, we cater to diverse construction needs by connecting you with a wide 
        network of reliable vendors offering a vast inventory of equipment.
        </p>
      </div>
    </section>
  );
};

export default AboutUs;
