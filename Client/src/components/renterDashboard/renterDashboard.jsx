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

  // Update availability status
  const updateAvailability = async (id, status) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.patch(`${config.BASE_API_URL}/renter/update-availability/${id}`, { status }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 3000,
      });
      fetchEquipments(); // Refresh the list after updating
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to update availability";
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
            <th>Min Hours</th>
            <th>Rating</th>
            <th>Location</th>
            <th>Description</th>
            <th>Availability Status</th>
            <th>Actions</th> {/* New column for actions */}
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
                    src={`${equipment.image}`}
                    alt={equipment.name}
                    className="equipment-image"
                  />
                </td>
                <td>Rs {equipment.price}</td>
                <td>{equipment.minHours}</td>
                <td>{equipment.averageRating ? `${equipment.averageRating}` : "--"}</td>
                <td className="eq-location">{equipment.address}</td>
                <td className="eq-desc">{equipment.description}</td>
                <td>{equipment.availabilityStatus}</td>
                <td>
                  {(() => {
                      switch (equipment.availabilityStatus) {
                        case "unavailable":
                          return (
                            <>
                              <button className="activate-btn" onClick={() => updateAvailability(equipment._id, 'available')}>
                                Set Available</button>
                            </>
                          );
                  
                        case "available":
                          return (
                            <>
                              <button className="reject-btn" onClick={() => updateAvailability(equipment._id, 'unavailable')}>
                                Set Unavailable</button>
                            </>
                          );
                  
                        default:
                          return null;
                      }
                    })()}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">No equipments found</td>
            </tr>
          )}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
};

export default RenterDashboard;