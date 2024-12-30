import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import "../css/equipmentsearch.css"; 

const EquipmentGrid = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Sample data for construction equipment
  const equipmentData = [
    { name: "Excavator", desc: "Heavy machinery for excavation and digging.", img: "/home page carosal/excavator2.jpg" },
    { name: "Crane", desc: "Used for lifting and moving heavy materials.", img: "/home page carosal/towercrane.jpg" },
    { name: "Bulldozer", desc: "Earth-moving machinery used for clearing and leveling.", img: "/home page carosal/skidder.jpg" },
    { name: "Dump Truck", desc: "Vehicle for transporting materials such as sand, gravel, or dirt.", img: "/home page carosal/truck.jpg" },
    { name: "Forklift", desc: "Lifting truck used for moving goods in warehouses.", img: "/home page carosal/forklift.jpg" },
    { name: "Loader", desc: "Machine for loading materials onto trucks.", img: "/home page carosal/loader.jpg" }
  ];

  // Filter equipment based on search term
  const filteredEquipment = equipmentData.filter((equipment) =>
    equipment.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          placeholder=" Search Here..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        </div>
      </div>

      <div className="grid">
        {filteredEquipment.map((equipment, index) => (
          <div key={index} className="equipment-card">
            <img src={equipment.img} alt={equipment.name} className="equipment-img" />
            <div className="equipment-overlay">
              <h3 className="equipment-title">{equipment.name}</h3>
              <button className="equipment-btn">View Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EquipmentGrid;
