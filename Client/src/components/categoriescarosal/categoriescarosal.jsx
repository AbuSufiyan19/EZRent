import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import axios from "axios"; // Import axios for API calls
import "./categoriescarosal.css"; // Import the CSS for styling
import config from "../../utils/configurl"; // Import config for API URL

const CategoriesCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Fetch categories data from the server
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${config.BASE_API_URL}/customer/fetchcategories`);
      setCategories(response.data); // Set the categories state with fetched data
    } catch (err) {
      console.error("Error fetching categories", err);
    }
  };

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Function to slide left
  const slideLeft = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? categories.length - 3 : prevIndex - 1));
  };

  // Function to slide right
  const slideRight = () => {
    setCurrentIndex((prevIndex) => (prevIndex === categories.length - 3 ? 0 : prevIndex + 1));
  };

  // Handle card click and navigate to another page
  const handleCardClick = (category) => {
    navigate("/equipcategories", { state: { category } }); // Pass selected category as state
  };

  return (
    <div className="categories-carousel">
      <h2>CATEGORIES</h2>
      <div className="carousel-container">
        {categories.slice(currentIndex, currentIndex + 3).map((category, index) => (
          <div
            key={index}
            className="category-card"
            onClick={() => handleCardClick(category)} // Navigate on card click
            role="button"
            tabIndex={0} // For accessibility
            onKeyDown={(e) => e.key === "Enter" && handleCardClick(category)} // Handle Enter key for accessibility
          >
            <img src={`${config.BASE_API_URL}/multer/categoryuploads/${category.image}`} alt={category.name} className="category-img" />       
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
