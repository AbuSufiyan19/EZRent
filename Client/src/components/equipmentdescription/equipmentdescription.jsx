import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./equipmentdescription.css"; 
import axios from "axios";
import { useNavigate } from "react-router-dom";
import config from "../../utils/configurl"; 
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfAlt, faStar as faStarEmpty } from "@fortawesome/free-solid-svg-icons";


const EquipmentDescriptionCard = () => {
  const location = useLocation();
  const equipment = location.state?.equipment;

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [totalHours, setTotalHours] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]); // Store booked date-time ranges
  const [isBooking, setIsBooking] = useState(false); // New state to track booking status
  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!equipment) {
      console.error("No equipment data found!");
    } else {
      fetchBookedSlots();
    }
  }, [equipment]);

  const fetchBookedSlots = async () => {
    try {
      const response = await axios.get(`${config.BASE_API_URL}/bookings/equipment/${equipment._id}`);
      setBookedSlots(response.data); 
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching booked slots:", error);
    }
  };

  const isDateBooked = (date) => {
    return bookedSlots.some(slot => {
      const from = new Date(slot.fromDateTime).toISOString().split("T")[0];
      const to = new Date(slot.toDateTime).toISOString().split("T")[0];
      return new Date(date) >= new Date(from) && new Date(date) <= new Date(to);
    });
  };

  const isTimeBooked = (date, time) => {
    return bookedSlots.some(slot => {
      const fromDateTime = new Date(slot.fromDateTime);
      const toDateTime = new Date(slot.toDateTime);
      const checkDateTime = new Date(`${date}T${time}`);
      return checkDateTime >= fromDateTime && checkDateTime < toDateTime;
    });
  };

  const isBookingValid = (fromDateTime, toDateTime) => {
    return !bookedSlots.some(slot => {
      const existingFromDateTime = new Date(slot.fromDateTime);
      const existingToDateTime = new Date(slot.toDateTime);
  
      // Add a 1-hour buffer before and after existing bookings
      const bufferBefore = new Date(existingFromDateTime);
      bufferBefore.setHours(bufferBefore.getHours() - 1);
  
      const bufferAfter = new Date(existingToDateTime);
      bufferAfter.setHours(bufferAfter.getHours() + 1);
  
      // Check for overlap considering the buffer time
      return (new Date(fromDateTime) < bufferAfter && new Date(toDateTime) > bufferBefore);
    });
  };
  

  const calculatePrice = () => {
    if (fromDate && toDate && fromTime && toTime) {
      const fromDateTime = new Date(`${fromDate}T${fromTime}`);
      const toDateTime = new Date(`${toDate}T${toTime}`);
      
      const hours = (toDateTime - fromDateTime) / (1000 * 60 * 60);

      if (hours < equipment.minHours) {
        setErrorMessage(`Minimum rental period is ${equipment.minHours} hours.`);
        setTotalHours(0);
        setTotalPrice(0);
      } else {
        setErrorMessage("");
        setTotalHours(hours);
        setTotalPrice(hours * equipment.price);
      }
    }
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };
  

  const handleBooking = async () => {
    setIsBooking(true); 
    const token = localStorage.getItem("token");
    if (!fromDate || !toDate || !fromTime || !toTime) {
      toast.warn("Please select a valid date and time.");
      setIsBooking(false);
      return;
    }
    const currentTime = getCurrentTime();
    if (fromDate === today && fromTime < currentTime) {
      toast.error("Cannot select a past time for today.");
      setIsBooking(false);
      return;
    }

    // Convert to ISO format for comparison
    const fromDateTime = new Date(`${fromDate}T${fromTime}`).toISOString();
    const toDateTime = new Date(`${toDate}T${toTime}`).toISOString();

    // Validate if the selected date-time range is available
    if (!isBookingValid(fromDateTime, toDateTime)) {
      toast.error("The selected time range is already booked. Please choose another slot.");
      setIsBooking(false);
      return;
    }
    try {
      const response = await axios.post(`${config.BASE_API_URL}/bookings/book`, {
        equipId: equipment.equipmentId,
        renterId: equipment.renterid,
        equipmentId: equipment._id,
        equipimg: equipment.image,
        fromDateTime,
        toDateTime,
        totalHours,
        totalPrice
      }, { 
        headers: { Authorization: `Bearer ${token}` },
      });
      
      toast.success("Booking successful!");

      await axios.post(`${config.BASE_API_URL}/bookings/save-datacsv`, {
        bookingId: response.data.booking._id,
        equipmentId: response.data.equipment._id
      });
  
      // Send email confirmation
      await axios.post(`${config.BASE_API_URL}/bookings/send-booking-email`, { 
        bookingId: response.data.booking._id 
    });

      setTimeout(() => {
        navigate("/mybookings");
      }, 2000);

      fetchBookedSlots(); // Refresh booked slots
      setFromDate("");
      setToDate("");
      setFromTime("");
      setToTime("");
      setTotalHours(0);
      setTotalPrice(0);
      setErrorMessage("");

    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Session expired. Redirecting to login...");
        navigate('/login'); // Redirect to login page
      } else {
        toast.error(error.response?.data?.message || "Error booking equipment.");
        setIsBooking(false);
      }
    } finally {
      setIsBooking(false); // Re-enable the button after completion
    }
  };

  useEffect(() => {
    calculatePrice();
  }, [fromDate, toDate, fromTime, toTime]);

  if (!equipment) {
    return <h2 className="error-message">Equipment details not found!</h2>;
  }
  const StarRating = ({ rating }) => {
    if (rating === 0) return null; // Hide stars if no rating
  
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  
    return (
      <div style={{ color: "gold", fontSize: "18px" }}>
        {[...Array(fullStars)].map((_, i) => (
          <FontAwesomeIcon key={i} icon={faStar} />
        ))}
        {halfStar && <FontAwesomeIcon icon={faStarHalfAlt} />}
        {[...Array(emptyStars)].map((_, i) => (
          <FontAwesomeIcon key={i + fullStars + 1} icon={faStarEmpty} style={{ color: "gray" }} />
        ))}
      </div>
    );
  };
  

  return (
    <div className="equipmentdesc-card-outer">
      <ToastContainer />
      <div className="equipmentdesc-card">
        <div className="equipmentdesc-image">
          <img src={`${equipment.image}`} alt={equipment.name} />
        </div>
        <div className="equipmentdesc-details">
          <h2 className="equipmentdesc-title">{equipment.name}</h2>
          <p className="equipmentdesc-eqid">Equipment ID: {equipment.equipmentId}</p>
          <p className="equipmentdesc-description">{equipment.description}</p>
          <p className="equipmentdesc-rentername"><b>Renter Name:</b> {equipment.rentername}</p>
            <StarRating rating={equipment.averageRating || 0} />
          <div className="equipmentdesc-pricing">
            <span className="current-price">Rs: {equipment.price}</span>
            <span className="original-price">Per Hour (Min {equipment.minHours} hrs)</span>
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
              min={today}
              onChange={(e) => {
                setFromDate(e.target.value);
                setToDate("");
              }}
              style={{
                backgroundColor:
                  fromTime && !isTimeBooked(fromDate, fromTime) ? "lightgreen" : isDateBooked(fromDate) ? "red" : "lightgreen",
                cursor: "pointer"
              }}
            />
          </div>

          <div className="option">
            <label htmlFor="toDate">To Date:</label>
            <input
              type="date"
              id="toDate"
              value={toDate}
              min={fromDate || today}
              onChange={(e) => setToDate(e.target.value)}
              style={{
                backgroundColor:
                  toTime && !isTimeBooked(toDate, toTime) ? "lightgreen" : isDateBooked(toDate) ? "red" : "lightgreen",
                cursor: "pointer"
              }}
            />
          </div>
          <div className="option">
            <label htmlFor="fromTime">From Time:</label>
            <input
              type="time"
              id="fromTime"
              value={fromTime}
              min={fromDate === today ? new Date().toISOString().slice(11, 16) : ""}
              onChange={(e) => setFromTime(e.target.value)}
              style={{ backgroundColor: isTimeBooked(fromDate, fromTime) ? "red" : "lightgreen", cursor: "pointer" }}
            />
          </div>
          <div className="option">
            <label htmlFor="toTime">To Time:</label>
            <input
              type="time"
              id="toTime"
              value={toTime}
              onChange={(e) => setToTime(e.target.value)}
              style={{ backgroundColor: isTimeBooked(toDate, toTime) ? "red" : "lightgreen", cursor: "pointer" }}
            />
          </div>
        </div>

        <div className="equipmentdesc-actions">
          {errorMessage ? (
            <p className="error-message">{errorMessage}</p>
          ) : (
            <>
              <div className="equipmentdesc-totalprice">
                <span>Total Hours: {totalHours} hrs</span><br />
                <span>Total Price: Rs {totalPrice}</span>
              </div>
              <button 
                  className="booknow-button" 
                  onClick={handleBooking} 
                  disabled={isBooking} // Disable button when booking is in progress
                >
                  {isBooking ? "Booking..." : "Book Now"} {/* Show loading text */}
                </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EquipmentDescriptionCard;
