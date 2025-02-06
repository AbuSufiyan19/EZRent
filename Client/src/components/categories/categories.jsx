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
  const [userLocation, setUserLocation] = useState({ lat: 0, lng: 0 });
  const [filteredEquipments, setFilteredEquipments] = useState([]);

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  useEffect(() => {
    fetchUserLocation();
    if (category?._id) {
      fetchEquipments(category._id);
    }
  }, [category]);

  const fetchUserLocation = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found!");
        return;
      }
      const response = await axios.get(`${config.BASE_API_URL}/users/location`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserLocation(response.data.location);
    } catch (error) {
      console.error("Error fetching user location:", error);
    }
  };

  const fetchEquipments = async (categoryId) => {
    try {
      const response = await axios.get(
        `${config.BASE_API_URL}/customer/equipmentsbycat?categoryId=${categoryId}`
      );
      setEquipments(response.data);
    } catch (error) {
      console.error("Error fetching equipment data:", error);
    }
  };

  useEffect(() => {
    if (userLocation.lat && userLocation.lng && equipments.length > 0) {
      const filtered = equipments.filter((equipment) => {
        const { lat, lng } = equipment.location;
        return calculateDistance(userLocation.lat, userLocation.lng, lat, lng) <= 100;
      });
      setFilteredEquipments(filtered);
    }
  }, [userLocation, equipments]);

  const searchedEquipments = searchTerm
    ? filteredEquipments.filter((equipment) =>
        equipment.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : filteredEquipments;

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
        {searchedEquipments.length > 0 ? (
          searchedEquipments.map((equipment) => (
            <div key={equipment._id} className="categories-card">
              <img
                src={`${config.BASE_API_URL}/multer/equipmentuploads/${equipment.image}`}
                alt={equipment.name}
                className="categories-img"
              />
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
