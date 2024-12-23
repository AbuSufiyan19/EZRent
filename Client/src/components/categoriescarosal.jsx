import React, { useState } from "react";
import "../css/categoriescarosal.css"; // Import the CSS for styling

const CategoriesCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Categories data (you can replace these with actual categories)
  const categories = [
    { name: "Excavators", img: "/home page carosal/excavator2.jpg" },
    { name: "Cranes", img: "/home page carosal/towercrane.jpg" },
    { name: "Bulldozers", img: "/home page carosal/skidder.jpg" },
    { name: "Excavators", img: "/home page carosal/excavator1.jpg" },
    { name: "Dump Trucks", img: "/home page carosal/truck.jpg" }
  ];

  // Function to slide left
  const slideLeft = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? categories.length - 3 : prevIndex - 1));
  };

  // Function to slide right
  const slideRight = () => {
    setCurrentIndex((prevIndex) => (prevIndex === categories.length - 3 ? 0 : prevIndex + 1));
  };

  return (
    <div className="categories-carousel">
        <h2>CATEGORIES</h2>
      <div className="carousel-container">
        {categories.slice(currentIndex, currentIndex + 3).map((category, index) => (
          <div key={index} className="category-card">
            <img src={category.img} alt={category.name} className="category-img" />
            <h3 className="category-name">{category.name}</h3>
          </div>
        ))}
      </div>

      {/* Arrows */}
      <div className="carousel-arrows">
        <button className="arrow left" onClick={slideLeft}>
          &#60;
        </button>
        <button className="arrow right" onClick={slideRight}>
          &#62;
        </button>
      </div>
    </div>
  );
};

export default CategoriesCarousel;
