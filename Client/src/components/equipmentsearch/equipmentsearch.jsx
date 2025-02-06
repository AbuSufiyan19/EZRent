import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "./equipmentsearch.css"; 
import config from "../../utils/configurl"; // Import config for API URL

const EquipmentGrid = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [allEquipments, setAllEquipments] = useState([]);
  const [filteredEquipments, setFilteredEquipments] = useState([]);
  const [userLocation, setUserLocation] = useState({ lat: 0, lng: 0 });
  const [randomEquipments, setRandomEquipments] = useState([]);
  const [randomEquipmentsuser, setRandomEquipmentsuser] = useState([]);
  const [hasToken, setHasToken] = useState(false);
  const navigate = useNavigate();

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    setHasToken(!!token);
    const fetchUserLocation = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const response = await axios.get(`${config.BASE_API_URL}/users/location`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserLocation(response.data.location);
      } catch (error) {
        console.error("Error fetching user location:", error);
      }
    };
    const fetchRandomEquipments = async () => {
      try {
        const response = await axios.get(`${config.BASE_API_URL}/customer/fetchequipments/random`);
        setRandomEquipmentsuser(response.data);
      } catch (error) {
        console.error("Error fetching random equipments:", error);
      }
    };
  

    const fetchAllEquipments = async () => {
      try {
        const response = await axios.get(`${config.BASE_API_URL}/customer/fetchequipments`);
        setAllEquipments(response.data);
      } catch (error) {
        console.error("Error fetching equipments:", error);
      }
    };

    fetchUserLocation();
    fetchAllEquipments();
    fetchRandomEquipments();
  }, []);

  useEffect(() => {
    if (userLocation.lat && userLocation.lng && allEquipments.length > 0) {
      const filtered = allEquipments.filter(({ location }) =>
        calculateDistance(userLocation.lat, userLocation.lng, location.lat, location.lng) <= 100
      );
      setFilteredEquipments(filtered);
      setRandomEquipments(filtered.sort(() => 0.5 - Math.random()).slice(0, 8));
    }
  }, [userLocation, allEquipments]);

  const displayedEquipments = searchTerm
    ? filteredEquipments.filter(({ name }) => name.toLowerCase().includes(searchTerm.toLowerCase()))
    : randomEquipments;

  return (
    <div className="equipment-grid-container">
      <h2 className="equipmentsearch-title">EQUIPMENTS</h2>
      <div className="search-bar-container">
        <div className="search-bar-inner">
          <button className="search-btn">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="searchicon" size="lg" />
          </button>
          <input
            type="text"
            placeholder="Search Here..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="grid">
        {displayedEquipments.map((equipment) => (
          <div key={equipment._id} className="equipment-card">
            <img src={`${config.BASE_API_URL}/multer/equipmentuploads/${equipment.image}`} 
                 alt={equipment.name} className="equipment-img" />
            <div className="equipment-overlay">
              <h3 className="equipment-title">{equipment.name}</h3>
              <button className="equipment-btn" onClick={() => navigate("/equipdesc", { state: { equipment } })}>
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
      {!hasToken && (
        <div className="grid">
          {randomEquipmentsuser.map((equipment) => (
            <div key={equipment._id} className="equipment-card">
              <img src={`${config.BASE_API_URL}/multer/equipmentuploads/${equipment.image}`} 
                   alt={equipment.name} className="equipment-img" />
              <div className="equipment-overlay">
                <h3 className="equipment-title">{equipment.name}</h3>
                {/* <button 
                  className="equipment-btn"
                  onClick={() => handleViewDetails(equipment)}
                >
                  View Details
                </button> */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EquipmentGrid;
