import React, { useState, useEffect } from 'react';
import './mybooking.css';
import axios from 'axios';
import config from '../../utils/configurl';

const MyBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) {
    return <p>Loading bookings...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="my-booking-container">
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
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center' }}>
                No bookings available.
              </td>
            </tr>
          ) : (
            bookings.map((booking) => (
              <tr key={booking._id}>
                <td className="image-cell">
                  <img
                    src={`${config.BASE_API_URL}/multer/equipmentuploads/${booking.equipimg}`}
                    alt={booking.equipimg}
                  />
                </td>
                <td>{booking.equipId}</td>
                <td>{new Date(booking.fromDateTime).toLocaleString()}</td>
                <td>{new Date(booking.toDateTime).toLocaleString()}</td>
                <td>{booking.totalHours} hrs</td>
                <td>Rs {booking.totalPrice}</td>
                <td>{booking.status}</td>
              </tr>
            ))
          )}
        </tbody>

      </table>
    </div>
  );
};

export default MyBooking;
