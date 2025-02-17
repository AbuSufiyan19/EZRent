import React, { useState, useEffect } from 'react';
import './mybooking.css';
import axios from 'axios';
import config from '../../utils/configurl';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaStar } from "react-icons/fa";


const MyBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [extraTime, setExtraTime] = useState(1);
  const [availabilityMessage, setAvailabilityMessage] = useState("");
  const [ratingPopup, setRatingPopup] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You are not logged in.");
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(`${config.BASE_API_URL}/bookings/fetchmybookings`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookings(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setError("Failed to fetch bookings.");
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleRequestExtraTime = (booking) => {
    setSelectedBooking(booking);
    setExtraTime(1);
    setAvailabilityMessage("");
  };

  const checkAvailability = async () => {
    if (extraTime < 1 || extraTime > 3) {
      setAvailabilityMessage("Please enter extra time between 1 to 3 hours.");
      return;
    }
    try {
      const response = await axios.post(`${config.BASE_API_URL}/bookings/check-extra-availability`, {
        bookingId: selectedBooking._id,
        equipId: selectedBooking.equipmentId,
        fromDateTime: selectedBooking.toDateTime,
        extraHours: extraTime
      });
      if (response.data.available) {
        setAvailabilityMessage("Time slot available. Click Proceed to extend.");
      } else {
        setAvailabilityMessage("Time slot not available.");
      }
    } catch (error) {
      console.error("Error checking availability:", error);
      setAvailabilityMessage("Failed to check availability.");
    }
  };

  const proceedWithExtraTime = async () => {
    try {
      await axios.post(`${config.BASE_API_URL}/bookings/extend-booking`, {
        bookingId: selectedBooking._id,
        extraHours: extraTime
      });
      toast.success("Booking extended successfully!");
      setSelectedBooking(null);
      setAvailabilityMessage("");
    } catch (error) {
      console.error("Error extending booking:", error);
      toast.error("Failed to extend booking.");
    }
  };

  if (loading) return <p>Loading bookings...</p>;
  if (error) return <p>{error}</p>;

  const handleRateReview = (booking) => {
    setRatingPopup(booking);
    setRating(0);
    setReview("");
  };

  const submitReview = async () => {
    if (!rating || !review) {
      toast.error("Rating and review are required!");
      return;
    }
  
    try {
      await axios.post(`${config.BASE_API_URL}/bookings/submit-review`, {
        bookingId: ratingPopup?._id,
        equipId: ratingPopup?.equipmentId,
        rating,
        review,
      });
  
      toast.success("Review submitted successfully!");
      setRatingPopup(null);
      window.location.reload(); // Reload page after successful submission
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review.");
    }
  };
  

  return (
    <div className="my-booking-container">
            <ToastContainer />
      <h2 className="mybooking-heading">My Bookings</h2>
      <table className="my-booking-table">
        <thead>
          <tr>
            <th>Equipment Image</th>
            <th>Equipment ID</th>
            <th>From Date</th>
            <th>To Date</th>
            <th>Total Hours</th>
            <th>Total Amount</th>
            <th>Extra Hours</th>
            <th>Extra Amount</th>
            <th>Status</th>
            <th>Ratings</th>
            <th>Reviews</th>
            <th>Action</th>
            <th>Rate Equipment</th>
          </tr>
        </thead>
        <tbody>
          {bookings.length === 0 ? (
            <tr><td colSpan="13" style={{ textAlign: 'center' }}>No bookings available.</td></tr>
          ) : (
            bookings.map((booking) => (
              <tr key={booking._id}>
                <td className="image-cell"><img src={`${booking.equipimg}`} alt={booking.equipimg} /></td>
                <td>{booking.equipId}</td>
                <td>{new Date(booking.fromDateTime).toLocaleString()}</td>
                <td>{new Date(booking.toDateTime).toLocaleString()}</td>
                <td>{booking.totalHours} hrs</td>
                <td>Rs {booking.totalPrice}</td>
                <td>{booking.extraTimehours ? `${booking.extraTimehours} hrs` : "--"}</td>
                <td>{booking.extraPrice ? `Rs ${booking.extraPrice}` : "--"}</td>
                <td>{booking.status}</td>
                <td>{booking.ratings ? `${booking.ratings}` : "--"}</td>
                <td>{booking.reviews ? `${booking.reviews}` : "--"}</td>
                <td>
                  {booking.status === "Confirmed" && !booking.extraPrice ? (
                    <button className="extend-btn" onClick={() => handleRequestExtraTime(booking)}>
                      Check Extra Time
                    </button>
                  ) : "--"}
                </td>
                <td>
                  {booking.status === "Completed" && !booking.ratings ? (
                    <button className="extend-btn2" onClick={() => handleRateReview(booking)}>
                      Rate Equipment
                    </button>
                  ) : "--"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {ratingPopup && (
        <div className="popup">
          <h3>Rate Equipment</h3>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar key={star} className={star <= rating ? "gold-star" : "gray-star"} onClick={() => setRating(star)} />
            ))}
          </div>
          <textarea className="reviewarea" placeholder="Write your review..." value={review} onChange={(e) => setReview(e.target.value)}></textarea><br />
          <button className="popup-proceed-btn" onClick={submitReview}>Submit</button>
          <button className="popup-cancel-btn" onClick={() => setRatingPopup(null)}>Close</button>
        </div>
      )}
      
      {selectedBooking && (
      <>
        <div className="popup-overlay" onClick={() => setSelectedBooking(null)}></div>
        <div className="popup">
          <h3>Request Extra Time</h3>
          <input
            type="number"
            min="1"
            max="3"
            value={extraTime}
            onChange={(e) => setExtraTime(Number(e.target.value))}
          />
          <button className="popup-check-btn" onClick={checkAvailability}>Check Availability</button>
          {availabilityMessage && <p>{availabilityMessage}</p>}
          {availabilityMessage.includes("available") && (
            <button className="popup-proceed-btn" onClick={proceedWithExtraTime}>Proceed</button>
          )}
          <button className="popup-cancel-btn" onClick={() => setSelectedBooking(null)}>Close</button>
        </div>
      </>
    )}

    </div>
  );
};

export default MyBooking;