import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./equipmentdescription.css"; 
import config from "../../utils/configurl"; 

const EquipmentDescriptionCard = () => {
  const location = useLocation();
  const equipment = location.state?.equipment; // Retrieve equipment details

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (!equipment) {
      console.error("No equipment data found!");
    }
  }, [equipment]);

  const calculatePrice = () => {
    if (fromDate && toDate) {
      const pricePerDay = 3000; 
      const from = new Date(fromDate);
      const to = new Date(toDate);
      const days = (to - from) / (1000 * 60 * 60 * 24) + 1;

      if (days > 0) {
        setTotalPrice(days * pricePerDay);
      } else {
        setTotalPrice(0);
      }
    }
  };

  useEffect(() => {
    calculatePrice();
  }, [fromDate, toDate]);

  if (!equipment) {
    return <h2 className="error-message">Equipment details not found!</h2>;
  }

  return (
    <div className="equipmentdesc-card-outer">
      <div className="equipmentdesc-card">
        <div className="equipmentdesc-image">
          <img src={`${config.BASE_API_URL}/multer/equipmentuploads/${equipment.image}`} alt={equipment.name} />
        </div>
        <div className="equipmentdesc-details">
          <h2 className="equipmentdesc-title">{equipment.name}</h2>
          <p className="equipmentdesc-eqid">Equipment ID: {equipment.equipmentId}</p>
          <p className="equipmentdesc-description">{equipment.description}</p>
          <p className="equipmentdesc-rentername"><b>Renter Name:</b> {equipment.rentername}</p>
          <div className="equipmentdesc-pricing">
            <span className="current-price">RS: {equipment.price}</span>
            <span className="original-price">Per Hour</span>
          </div>
        </div>
      </div>
      <div className="equipmentdesc-datetimedetails">
        <div className="equipmentdesc-options">
          <div className="option">
            <label htmlFor="fromDate">From Date:</label>
            <input
              type="date"
              id="fromDate"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div className="option">
            <label htmlFor="toDate">To Date:</label>
            <input
              type="date"
              id="toDate"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
          <div className="option">
            <label htmlFor="fromTime">From Time:</label>
            <input
              type="time"
              id="fromTime"
              value={fromTime}
              onChange={(e) => setFromTime(e.target.value)}
            />
          </div>
          <div className="option">
            <label htmlFor="toTime">To Time:</label>
            <input
              type="time"
              id="toTime"
              value={toTime}
              onChange={(e) => setToTime(e.target.value)}
            />
          </div>
        </div>

        <div className="equipmentdesc-actions">
          <div className="equipmentdesc-totalprice">
              <span>Total Price: Rs {totalPrice}</span>
          </div>
          <button className="booknow-button">Book Now</button>
        </div>
      </div>
    </div>
  );
};

export default EquipmentDescriptionCard;
