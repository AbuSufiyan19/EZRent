import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import "./categories.css"; 
import config from "../../utils/configurl"; 

const Categories = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const category = location.state?.category; // Get category from navigation state
  const [searchTerm, setSearchTerm] = useState("");
  const [equipments, setEquipments] = useState([]);

  useEffect(() => {
    if (category?._id) {
      fetchEquipments(category._id);
    }
  }, [category]);

  const fetchEquipments = async (categoryId) => {
    try {
      const response = await axios.get(`${config.BASE_API_URL}/customer/equipmentsbycat?categoryId=${categoryId}`);
      setEquipments(response.data);
    } catch (error) {
      console.error("Error fetching equipment data:", error);
    }
  };

  // Filter equipment based on search term
  const filteredEquipments = equipments.filter((equipment) =>
    equipment.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle "View Details" button click
  const handleViewDetails = (equipment) => {
    navigate("/equipdesc", { state: { equipment } });
  };

  return (
    <div className="categories-grid-container">
      <h2 className="categoriessearch-title">{category?.name || "Equipments"}</h2>

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
        {filteredEquipments.length > 0 ? (
          filteredEquipments.map((equipment) => (
            <div key={equipment._id} className="categories-card">
              <img src={`${config.BASE_API_URL}/multer/equipmentuploads/${equipment.image}`} 
                   alt={equipment.name} className="categories-img" />
              <div className="categories-overlay">
                <h3 className="categories-title">{equipment.name}</h3>
                <button className="categories-btn" onClick={() => handleViewDetails(equipment)}>
                  View Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-data-message">No equipment found for this category</p>
        )}
      </div>
    </div>
  );
};

export default Categories;
