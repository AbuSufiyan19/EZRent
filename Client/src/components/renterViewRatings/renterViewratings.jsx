import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfAlt, faStar as faStarEmpty } from "@fortawesome/free-solid-svg-icons";
import config from "../../utils/configurl";

const RenterReviews = () => {
  const [bookings, setBookings] = useState([]);

  // Fetch reviews & ratings from the database
  const fetchBookings = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You are not logged in.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      const response = await axios.get(`${config.BASE_API_URL}/bookings/fetchall-bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(response.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to fetch reviews";
      toast.error(errorMessage, { position: "top-right", autoClose: 3000 });
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

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
    <div className="renter-content">
      <h2>Customer Ratings & Reviews</h2>
      <table className="mybooking-table">
        <thead>
          <tr>
            <th>Equipment</th>
            <th>Equipment ID</th>
            <th>Ratings</th>
            <th>Reviews</th>
          </tr>
        </thead>
        <tbody>
          {bookings.length > 0 ? (
            bookings
              .filter((booking) => booking.ratings || booking.reviews) // Show only reviewed bookings
              .map((booking) => (
                <tr key={booking._id}>
                  <td className="image-cell">
                    <img
                      src={`${config.BASE_API_URL}/multer/equipmentuploads/${booking.equipimg}`}
                      alt={booking.equipimg}
                      className="mybooking-image"
                      />
                  </td>
                  <td>{booking.equipId}</td>
                  <td><StarRating rating={booking.ratings || 0} /></td>
                  <td>{booking.reviews ? `${booking.reviews}` : "--"}</td>
                </tr>
              ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: "center" }}>No reviews available.</td>
            </tr>
          )}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
};

export default RenterReviews;
