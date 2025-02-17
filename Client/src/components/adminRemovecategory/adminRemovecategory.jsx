import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./adminRemovecategory.css";
import config from "../../utils/configurl"

const RenterAddEquipments = () => {
  const [categories, setCategories] = useState([]);

  // Fetch categories from the database
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${config.BASE_API_URL}/admin/fetch-categories`);
      setCategories(response.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to fetch categories";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // Delete a category
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      const response = await axios.delete(`${config.BASE_API_URL}/admin/remove-category/${id}`);
      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 3000,
      });

      // Refresh the list after deletion
      fetchCategories();
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to delete category";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="renter-content">
      <h2>Equipment Categories</h2>
      <table className="admincategory-table">
        <thead>
          <tr>
            <th>Category ID</th>
            <th>Category Name</th>
            <th>Category Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 ? (
            categories.map((category) => (
              <tr key={category._id}>
                <td>{category._id}</td>
                <td>{category.name}</td>
                <td>
                  <img
                    src={`${category.image}`}
                    alt={category.name}
                    className="category-image"
                  />
                </td>
                <td>
                  <button className="delete-btn" onClick={() => handleDelete(category._id)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No categories found</td>
            </tr>
          )}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
};

export default RenterAddEquipments;
