// File: src/pages/HomeMainPage.jsx
import React from "react";
import "../css/home.css";
import CustomerNavbar from "../components/customernavbar";
import BackgroundSlider from "../components/BackgroundSlider"; // Import the new carousel component
import CategoriesCarousel from "../components/categoriescarosal";

const HomeMainPage = () => {
  return (
    <>
      <CustomerNavbar />
      {/* Home Main Page Section */}
      <section id="home" className="home-main-page">
        {/* Slider */}
        <BackgroundSlider />

        {/* Content Section */}
        <div className="content-section">
          {/* Overlay Image */}
          <h1 className="title">Construction Equipment Rental</h1>
          {/* Description */}
          <p className="description">
            Welcome to EZRent, your ultimate partner in construction equipment rental.
            Join us today and explore a world of possibilities!
          </p>
        </div>
      </section>
       {/* Categories Section */}
       <section id="categories" className="categories-section">
        <CategoriesCarousel />
      </section>
    </>
  );
};

export default HomeMainPage;