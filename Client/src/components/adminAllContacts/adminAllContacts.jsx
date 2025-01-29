import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./adminAllContacts.css"; // You can modify the CSS for this table as needed
import config from "../../utils/configurl";

const AdminAllContacts = () => {
  const [contacts, setContacts] = useState([]);

  // Fetch contacts from the database
  const fetchContacts = async () => {
    try {
      const response = await axios.get(`${config.BASE_API_URL}/admin/fetchall-contactsupport`);
      setContacts(response.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to fetch contact support data";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <div className="renter-content">
      <h2>Contact Support Requests</h2>
      <table className="contactsupport-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Message</th>
            <th>Received On</th>
          </tr>
        </thead>
        <tbody>
          {contacts.length > 0 ? (
            contacts.map((contact) => (
              <tr key={contact._id}>
                <td>{contact.name}</td>
                <td>{contact.email}</td>
                <td>{contact.mobile}</td>
                <td>{contact.message}</td>
                <td>{new Date(contact.createdAt).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No contact requests found</td>
            </tr>
          )}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
};

export default AdminAllContacts;
