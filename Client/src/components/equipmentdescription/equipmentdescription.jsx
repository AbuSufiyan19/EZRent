import React, { useState, useEffect } from "react";
import "./equipmentdescription.css"; // External CSS for styling
import equipmentImage from "/home page carosal/truck.jpg"; // Replace with the correct path to your image

const EquipmentDescriptionCard = () => {
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [fromTime, setFromTime] = useState("");
    const [toTime, setToTime] = useState("");
    const [totalPrice, setTotalPrice] = useState(0);
  
    const calculatePrice = () => {
        if (fromDate && toDate) {
          const pricePerDay = 3000; 
          const from = new Date(fromDate);
          const to = new Date(toDate);
          const days = (to - from) / (1000 * 60 * 60 * 24) + 1;
    
          // Ensure valid date range
          if (days > 0) {
            setTotalPrice(days * pricePerDay);
          } else {
            setTotalPrice(0);
          }
        }
      };
    
      // Automatically calculate price when dates or times change
      useEffect(() => {
        calculatePrice();
      }, [fromDate, toDate]);

  return (
    <div className="equipmentdesc-card-outer">
    <div className="equipmentdesc-card">
      <div className="equipmentdesc-image">
        <img src={equipmentImage} alt="Equipment" />
      </div>
      <div className="equipmentdesc-details">
        <h2 className="equipmentdesc-title">CAT MiningTruck</h2>
        
        <p className="equipmentdesc-description">
          A facial cleanser is a skincare product used to remove make-up, dead
          skin cells, oil, dirt, and other types of pollutants from the skin,
          helping to keep pores clear and prevent skin conditions such as acne.
        </p>
        <div className="equipmentdesc-pricing">
          <span className="current-price">RS: 3000</span>
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
