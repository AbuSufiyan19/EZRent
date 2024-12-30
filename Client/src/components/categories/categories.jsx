import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import "./categories.css"; 

const Categories = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Sample data for construction equipment
  const categoriesData = [
    { name: "Crane1", img: "/home page carosal/towercrane.jpg" },
    { name: "Crane2", img: "/home page carosal/towercrane.jpg" },
    { name: "Crane3", img: "/home page carosal/towercrane.jpg" },
    { name: "Crane4", img: "/home page carosal/towercrane.jpg" },
    { name: "Crane5", img: "/home page carosal/towercrane.jpg" },
    { name: "Crane6", img: "/home page carosal/towercrane.jpg" }
  ];

  // Filter equipment based on search term
  const filteredCategories = categoriesData.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="categories-grid-container">
        <h2 className="categoriessearch-title">CRANES</h2>
      <div className="search-bar-container">
      <div className="search-bar-inner">
        <button className="search-btn">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="searchicon" size="lg" />
        </button>
        <input
          type="text"
          placeholder=" Search Here..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        </div>
      </div>

      <div className="grid">
        {filteredCategories.map((category, index) => (
          <div key={index} className="categories-card">
            <img src={category.img} alt={category.name} className="categories-img" />
            <div className="categories-overlay">
              <h3 className="categories-title">{category.name}</h3>
              <button className="categories-btn">View Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
