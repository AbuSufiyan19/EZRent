import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./renterApproveBookings.css"; 
import config from "../../utils/configurl";

const RenterApproveBookings = () => {
  const [bookings, setBookings] = useState([]);

  // Fetch bookings from the database
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
      const response = await axios.get(`${config.BASE_API_URL}/bookings/fetchbookingapproval`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBookings(response.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to fetch bookings";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleApprove = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.patch(`${config.BASE_API_URL}/bookings/approvebooking/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 3000,
      });
      fetchBookings(); // Refresh the bookings list
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to approve booking";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // Reject a booking
  const handleReject = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.patch(`${config.BASE_API_URL}/bookings/rejectbooking/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 3000,
      });
      fetchBookings(); // Refresh the bookings list
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to reject booking";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };


  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="renter-content">
      <h2>Bookings</h2>
      <table className="mybooking-table">
        <thead>
          <tr>
            <th>Equipment ID</th>
            <th>Equipment Image</th>
            <th>From Date</th>
            <th>To Date</th>
            <th>Total Hours</th>
            <th>Total Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <tr key={booking._id}>
                <td>{booking.equipId}</td>
                <td className="image-cell">
                  <img
                    src={`${config.BASE_API_URL}/multer/equipmentuploads/${booking.equipimg}`}
                    alt={booking.equipimg}
                    className="mybooking-image"
                  />
                </td>
                <td>{new Date(booking.fromDateTime).toLocaleString()}</td>
                <td>{new Date(booking.toDateTime).toLocaleString()}</td>
                <td>{booking.totalHours} hrs</td>
                <td>Rs {booking.totalPrice}</td>
                <td>
                   <button className="activate-btn" onClick={() => handleApprove(booking._id)}>Approve</button>
                   <button className="reject-btn" onClick={() => handleReject(booking._id)}>Reject</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center' }}>
                No bookings available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
};

export default RenterApproveBookings;