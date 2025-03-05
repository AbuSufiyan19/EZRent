import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./renterViewAllBookings.css"; 
import config from "../../utils/configurl";

const RenterViewAllBookings = () => {
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
      const response = await axios.get(`${config.BASE_API_URL}/bookings/fetchall-bookings`, {
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

  // Function to update booking status
  const updateStatus = async (id, status) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You are not logged in.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      const response = await axios.put(
        `${config.BASE_API_URL}/bookings/update-status/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 3000,
      });

      // Refresh bookings after status update
      fetchBookings();
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to update booking status";
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
      <h2>All Bookings</h2>
      <table className="mybooking-table">
        <thead>
          <tr>
            <th>Equipment ID</th>
            <th>Equipment Image</th>
            <th>From Date</th>
            <th>To Date</th>
            <th>Total Hours</th>
            <th>Total Amount</th>
            <th>Extra Time</th>
            <th>Extra Amount</th>
            <th>Payment Status</th>
            <th>Transaction-Id</th>
            <th>UPI-PaymentId</th>
            <th>Status</th>
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
                    src={`${booking.equipimg}`}
                    alt={booking.equipimg}
                    className="mybooking-image"
                  />
                </td>
                <td>{new Date(booking.fromDateTime).toLocaleString()}</td>
                <td>{new Date(booking.toDateTime).toLocaleString()}</td>
                <td>{booking.totalHours} hrs</td>
                <td>Rs {booking.totalPrice}</td>
                <td>{booking.extraTimehours ? `${booking.extraTimehours} hrs` : "--"}</td>
                <td>{booking.extraPrice ? `Rs ${booking.extraPrice}` : "--"}</td>
                <td>{booking.paymentStatus}</td>
                <td>{booking.transactionId}</td>
                <td>{booking.upitransactionId}</td>
                <td>{booking.status}</td>
                <td>
                  {booking.status === "Confirmed" && (
                    <>
                      <button className="activate-btn" onClick={() => updateStatus(booking._id, "Completed")}>
                        Completed
                      </button>
                      <button className="reject-btn" onClick={() => updateStatus(booking._id, "Cancelled")}>
                        Cancel
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="13" style={{ textAlign: "center" }}>No bookings available.</td>
            </tr>
          )}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
};

export default RenterViewAllBookings;
