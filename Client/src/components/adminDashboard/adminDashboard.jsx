import React, { useState, useEffect } from "react";
import axios from "axios";
import './adminDashboard.css';
import config from "../../utils/configurl";

const AdminDashboard = () => {
  const [categoryCount, setCategoryCount] = useState(0);
  const [equipmentCount, setEquipmentCount] = useState(0); // New state for equipment count
  const [customerCount, setCustomerCount] = useState(0); // New state for customer count
  const [providerCount, setProviderCount] = useState(0); // New state for provider count
  const [bookingCount, setBookingCount] = useState(0); 

  // Fetch counts from the server when the component mounts
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // Fetch category count
        const categoryResponse = await axios.get(`${config.BASE_API_URL}/admin/category-count`);
        setCategoryCount(categoryResponse.data.count);

        // Fetch equipment count
        const equipmentResponse = await axios.get(`${config.BASE_API_URL}/admin/equipment-count`);
        setEquipmentCount(equipmentResponse.data.count);

        // Fetch customer count
        const customerResponse = await axios.get(`${config.BASE_API_URL}/admin/customer-count`);
        setCustomerCount(customerResponse.data.count);

        // Fetch provider count
        const providerResponse = await axios.get(`${config.BASE_API_URL}/admin/provider-count`);
        setProviderCount(providerResponse.data.count);

        const bookingResponse = await axios.get(`${config.BASE_API_URL}/admin/booking-count`);
        setBookingCount(bookingResponse.data.count);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCounts();
  }, []); // Empty dependency array to run once on mount

  return (
    <div className="renter-content admin-content">
      <div className="admindashboard-container">
        <div className="card">
          <h4>Categories</h4>
          <p className="count">{categoryCount}</p> {/* Display category count */}
        </div>
        <div className="card">
          <h4>Equipments</h4>
          <p className="count">{equipmentCount}</p> {/* Display equipment count */}
        </div>
        <div className="card">
          <h4>Bookings</h4>
          <p className="count">{bookingCount}</p> {/* Static bookings count */}
        </div>
        <div className="card">
          <h4>Customers</h4>
          <p className="count">{customerCount}</p> {/* Display customer count */}
        </div>
        <div className="card">
          <h4>Providers</h4>
          <p className="count">{providerCount}</p> {/* Display provider count */}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
