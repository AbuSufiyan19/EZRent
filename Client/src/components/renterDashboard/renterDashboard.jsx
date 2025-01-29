import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./renterDashboard.css";
import config from "../../utils/configurl";


const RenterDashboard = () => {
  const [equipments, setEquipments] = useState([]);

  // Fetch equipments from the database
  const fetchEquipments = async () => {
  const token = localStorage.getItem("token"); 
  try {
    const response = await axios.get(`${config.BASE_API_URL}/renter/fetch-equipments`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setEquipments(response.data);
  } catch (err) {
    const errorMessage = err.response?.data?.message || "Failed to fetch equipments";
    toast.error(errorMessage, {
      position: "top-right",
      autoClose: 3000,
    });
  }
  };

  useEffect(() => {
    fetchEquipments();
  }, []);

  return (
    <div className="renter-content">
      <h2>Equipments List</h2>
      <table className="renterequipment-table">
        <thead>
          <tr>
            <th>Equipment ID</th>
            <th>Equipment Name</th>
            <th>Equipment Image</th>
            <th>Price</th>
            <th>Location</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {equipments.length > 0 ? (
            equipments.map((equipment) => (
              <tr key={equipment._id}>
                <td>{equipment.equipmentId}</td>
                <td>{equipment.name}</td>
                <td>
                  <img
                    src={`${config.BASE_API_URL}/multer/equipmentuploads/${equipment.image}`}
                    alt={equipment.name}
                    className="equipment-image"
                  />
                </td>
                <td>Rs {equipment.price}</td>
                <td>{equipment.address}</td>
                <td>{equipment.description}</td>
                
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No equipments found</td>
            </tr>
          )}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
};

export default RenterDashboard;
