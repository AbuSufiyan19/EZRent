import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./renterProfile.css"; 
import config from "../../utils/configurl";
import profile from "/profile.png";

const RenterDashboard = () => {
  const [renterData, setRenterData] = useState({
    fullName: "",
    contactNumber: "",
    upiId: "",
  });
  const [renterId, setRenterId] = useState(null);

  useEffect(() => {
    const fetchRenterId = async () => {
      try {
        const token = localStorage.getItem("token"); // Get token from local storage
        if (!token) {
          toast.error("User not authenticated");
          return;
        }
        // Validate the token and get the renter ID
        const response = await axios.get(`${config.BASE_API_URL}/auth/validate-token`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const id = response.data.userId;
          setRenterId(id);

        // Fetch renter details
        fetchRenterDetails(id);
      } catch (error) {
        alert("Session expired. Please log in again.");
      }
    };

    const fetchRenterDetails = async (id) => {
      try {
        const response = await axios.get(`${config.BASE_API_URL}/renter/renterdata/${id}`);
        setRenterData(response.data);
      } catch (error) {
        toast.error("Failed to fetch renter details");
      }
    };

    fetchRenterId();
  }, []);

  const handleChange = (e) => {
    setRenterData({ ...renterData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
        console.log(renterData);
      await axios.put(`${config.BASE_API_URL}/renter/updateprofile/${renterId}`, renterData);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="renter-content">
      <h2>Profile</h2>
      <div className="profile-container">
        <div className="profile-header">            
          <img src={profile} alt="Profile" className="profile-image" />
          <div className="profile-info">
            <h3>{renterData.fullName || "Your Name"}</h3>
            <p>{renterData.email || "your.email@example.com"}</p>
          </div>
        </div>

        <div className="profile-details">
          <div className="input-group">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={renterData.fullName}
              onChange={handleChange}
              placeholder="Your Full Name"
            />
          </div>
          <div className="input-group">
            <label>Contact Number</label>
            <input
              type="number"
              name="mobileNumber"
              value={renterData.mobileNumber}
              onChange={handleChange}
              placeholder="Your Contact Number"
            />
          </div>
          <div className="input-group">
            <label>UPI ID</label>
            <input
              type="text"
              name="upiId"
              value={renterData.upiId}
              onChange={handleChange}
              placeholder="Your UPI ID"
            />
          </div>
        </div>
        <button className="edit-button" onClick={handleUpdate}>Update</button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default RenterDashboard;
