import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./adminAllEquipments.css";
import config from "../../utils/configurl";

const AdminAllEquipments = () => {
  const [equipments, setEquipments] = useState([]);

  // Fetch equipments from the database
  const fetchEquipments = async () => {
    try {
      const response = await axios.get(`${config.BASE_API_URL}/admin/fetchall-equipments`);
      setEquipments(response.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to fetch equipments";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // Delete an equipment
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this equipment?")) return;

    try {
      const response = await axios.delete(`${config.BASE_API_URL}/renter/remove-equipment/${id}`);
      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 3000,
      });

      // Refresh the list after deletion
      fetchEquipments();
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to delete equipment";
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
      <h2>Equipments</h2>
      <table className="renterequipment-table">
        <thead>
          <tr>
            <th>Equipment ID</th>
            <th>Equipment Name</th>
            <th>Price</th>
            <th>Min Hours</th>
            <th>Rating</th>
            <th>Location</th>
            <th>Equipment Image</th>
            <th>Description</th>
            <th>Availability</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {equipments.length > 0 ? (
            equipments.map((equipment) => (
              <tr key={equipment._id}>
                <td>{equipment.equipmentId}</td>
                <td>{equipment.name}</td>
                <td>{equipment.price}</td>
                <td>{equipment.minHours}</td>
                <td>{equipment.averageRating ? `${equipment.averageRating}` : "--"}</td>
                <td className="eq-location">{equipment.address}</td>
                <td>
                  <img
                    src={`${equipment.image}`}
                    alt={equipment.name}
                    className="equipment-image"
                    />
                </td>
                <td className="eq-desc">{equipment.description}</td>
                <td>{equipment.availabilityStatus}</td>
                <td>
                  <button className="delete-btn" onClick={() => handleDelete(equipment._id)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No equipments found</td>
            </tr>
          )}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
};

export default AdminAllEquipments;