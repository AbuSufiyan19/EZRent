import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "./equipmentsearch.css"; 
import config from "../../utils/configurl"; // Import config for API URL

const EquipmentGrid = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [allEquipments, setAllEquipments] = useState([]); // Stores all equipment for searching
  const [randomEquipments, setRandomEquipments] = useState([]); // Stores 8 random equipment
  const navigate = useNavigate();

  // Fetch 8 random equipments
  const fetchRandomEquipments = async () => {
    try {
      const response = await axios.get(`${config.BASE_API_URL}/customer/fetchequipments/random`);
      setRandomEquipments(response.data);
    } catch (error) {
      console.error("Error fetching random equipments:", error);
    }
  };

  // Fetch all equipments for searching
  const fetchAllEquipments = async () => {
    try {
      const response = await axios.get(`${config.BASE_API_URL}/customer/fetchequipments`);
      setAllEquipments(response.data);
    } catch (error) {
      console.error("Error fetching all equipments:", error);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchRandomEquipments();
    fetchAllEquipments();
  }, []);

  // Filter equipments based on search term
  const filteredEquipment = searchTerm
    ? allEquipments.filter((equipment) =>
        equipment.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Handle "View Details" button click
  const handleViewDetails = (equipment) => {
    navigate("/equipdesc", { state: { equipment } });
  };

  return (
    <div className="equipment-grid-container">
      <h2 className="equipmentsearch-title">EQUIPMENTS</h2>

      {/* Search Bar */}
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

      {/* Display Search Results if Search is Active */}
      {searchTerm && filteredEquipment.length > 0 && (
        <div className="grid">
          {filteredEquipment.map((equipment) => (
            <div key={equipment._id} className="equipment-card">
              <img src={`${config.BASE_API_URL}/multer/equipmentuploads/${equipment.image}`} 
                   alt={equipment.name} className="equipment-img" />
              <div className="equipment-overlay">
                <h3 className="equipment-title">{equipment.name}</h3>
                <button 
                  className="equipment-btn"
                  onClick={() => handleViewDetails(equipment)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!searchTerm && (
        <div className="grid">
          {randomEquipments.map((equipment) => (
            <div key={equipment._id} className="equipment-card">
              <img src={`${config.BASE_API_URL}/multer/equipmentuploads/${equipment.image}`} 
                   alt={equipment.name} className="equipment-img" />
              <div className="equipment-overlay">
                <h3 className="equipment-title">{equipment.name}</h3>
                <button 
                  className="equipment-btn"
                  onClick={() => handleViewDetails(equipment)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EquipmentGrid;
