import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./adminAddcategory.css";
import config from "../../utils/configurl";


const adminAddcategory = () => {
  const [formData, setFormData] = useState({
    name: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form default behavior

    const data = new FormData();
    data.append("name", formData.name);
    data.append("image", formData.image);

    try {
      const response = await axios.post(`${config.BASE_API_URL}/admin/addequipment-category`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Success toast
      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
});

      // Clear form after success
      setFormData({
        name: "",
        image: null,
      });

      // Reset file input
      document.getElementById("image").value = null;
    } catch (err) {
      // Error toast
      const errorMessage = err.response?.data?.message || "An error occurred";
      toast.error(errorMessage, {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
      });
    }
  };

  return (
    <div className="renter-content formss">
      <h2>Add Equipment Category</h2>
      <form className="equipment-form" onSubmit={handleSubmit}>
        {/* Name */}
        <div className="form-group">
          <label htmlFor="categoryname">Category Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter equipment category name"
            required
          />
        </div>

        {/* Image */}
        <div className="form-group">
          <label htmlFor="categoryimage">Category Image</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="submit-btn">
          Add Equipment Category
        </button>
      </form>

      {/* Toastify Container */}
      <ToastContainer />
    </div>
  );
};

export default adminAddcategory;
