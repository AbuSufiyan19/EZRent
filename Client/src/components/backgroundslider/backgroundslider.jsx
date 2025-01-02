// File: src/components/BackgroundSlider.jsx
import React from "react";
import Slider from "react-slick";
import "./backgroundslider.css"; 

// Example images for the slider
import backgroundImage1 from "/home page carosal/truck.jpg";
import backgroundImage2 from "/home page carosal/excavator2.jpg";
import backgroundImage3 from "/home page carosal/skidder.jpg";
import backgroundImage4 from "/home page carosal/excavator1.jpg";
import backgroundImage5 from "/home page carosal/towercrane.jpg";

const BackgroundSlider = () => {
  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false, // Optional: Remove navigation arrows
  };

  return (
    <Slider {...sliderSettings} className="background-slider">
      <div className="slider-image">
        <img src={backgroundImage1} alt="Slide 1" />
      </div>
      <div className="slider-image">
        <img src={backgroundImage2} alt="Slide 2" />
      </div>
      <div className="slider-image">
        <img src={backgroundImage3} alt="Slide 3" />
      </div>
      <div className="slider-image">
        <img src={backgroundImage4} alt="Slide 4" />
      </div>
      <div className="slider-image">
        <img src={backgroundImage5} alt="Slide 5" />
      </div>
    </Slider>
  );
};

export default BackgroundSlider;
