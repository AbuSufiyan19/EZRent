import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./adminManageCustomers.css";
import config from "../../utils/configurl";

const AdminManageCustomers = () => {
  const [customers, setCustomers] = useState([]);

  // Fetch customers from the database
  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${config.BASE_API_URL}/admin/fetchall-customers`);
      setCustomers(response.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to fetch customers";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // Delete a customer
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this customer?")) return;

    try {
      const response = await axios.delete(`${config.BASE_API_URL}/admin/remove-customer/${id}`);
      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 3000,
      });

      // Refresh the list after deletion
      fetchCustomers();
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to remove customer";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="renter-content">
      <h2>Manage Customers</h2>
      <table className="customers-table">
        <thead>
          <tr>
            <th>Customer ID</th>
            <th>Customer Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Location</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.length > 0 ? (
            customers.map((customer) => (
              <tr key={customer._id}>
                <td>{customer._id}</td>
                <td>{customer.fullName}</td>
                <td>{customer.email}</td>
                <td>{customer.mobileNumber}</td>
                <td>{customer.locationDistrict}</td>
                <td>
                  <button className="delete-btn" onClick={() => handleDelete(customer._id)}>
                    Remove Account
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No customers found</td>
            </tr>
          )}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
};

export default AdminManageCustomers;
