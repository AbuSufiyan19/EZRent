import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./adminManageProviders.css";
import config from "../../utils/configurl";

const AdminManageProviders = () => {
  const [providers, setProviders] = useState([]);

  // Fetch providers from the database
  const fetchProviders = async () => {
    try {
      const response = await axios.get(`${config.BASE_API_URL}/admin/fetchall-providers`);
      setProviders(response.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to fetch providers";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // Delete a provider
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this provider?")) return;

    try {
      const response = await axios.delete(`${config.BASE_API_URL}/admin/remove-provider/${id}`);
      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 3000,
      });

      // Refresh the list after deletion
      fetchProviders();
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to remove provider";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  return (
    <div className="renter-content">
      <h2>Manage Providers</h2>
      <table className="providers-table">
        <thead>
          <tr>
            <th>Provider ID</th>
            <th>Provider Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Location</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {providers.length > 0 ? (
            providers.map((provider) => (
              <tr key={provider._id}>
                <td>{provider._id}</td>
                <td>{provider.fullName}</td>
                <td>{provider.email}</td>
                <td>{provider.mobileNumber}</td>
                <td>{provider.locationDistrict}</td>
                <td>
                  <button className="delete-btn" onClick={() => handleDelete(provider._id)}>
                    Remove Account
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No providers found</td>
            </tr>
          )}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
};

export default AdminManageProviders;
