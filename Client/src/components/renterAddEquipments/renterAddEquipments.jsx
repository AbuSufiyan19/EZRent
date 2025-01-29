import React, { useState, useEffect } from "react";
import axios from "axios";
import "./renterAddEquipments.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import config from "../../utils/configurl";


const RenterAddEquipments = () => {
  const [formData, setFormData] = useState({
    category: "",
    name: "",
    description: "",
    image: null,
    price: "",
    location: {
      lat: null,
      lng: null,
    },
    address: "",
  });

  const [categories, setCategories] = useState([]);
  const [isMapOpen, setIsMapOpen] = useState(false);

  // Fetch categories from the database
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${config.BASE_API_URL}/admin/fetch-categories`
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories: ", error);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleMapClick = async (lat, lng) => {
    try {
      const address = await getAddressFromLatLng(lat, lng);
      setFormData((prev) => ({
        ...prev,
        location: { lat, lng },
        address,
      }));
      setIsMapOpen(false);
    } catch (error) {
      console.error("Error getting address:", error);
      toast.error("Failed to fetch the address. Try again.");
    }
  };

  const getAddressFromLatLng = async (lat, lng) => {
    const geocoder = new google.maps.Geocoder();
    return new Promise((resolve, reject) => {
      const latLng = new google.maps.LatLng(lat, lng);
      geocoder.geocode({ location: latLng }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results[0]) {
          resolve(results[0].formatted_address);
        } else {
          reject("Unable to get address");
        }
      });
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("category", formData.category);
    form.append("name", formData.name);
    form.append("description", formData.description);
    form.append("price", formData.price);
    form.append("lat", formData.location.lat);
    form.append("lng", formData.location.lng);
    form.append("address", formData.address);
    form.append("image", formData.image);
    const token = localStorage.getItem("token"); 

    try {
      const response = await axios.post(`${config.BASE_API_URL}/renter/add-equipment`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, 
        },
      });
      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Reset form
      setFormData({
        category: "",
        name: "",
        description: "",
        image: null,
        price: "",
        location: { lat: null, lng: null },
        address: "",
      });
      document.getElementById("image").value = null;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "An error occurred";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  useEffect(() => {
    if (isMapOpen) {
      const loadGoogleMaps = async () => {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAiEvhHmhIdeKSVUF2DqUEVKdWi3LOOjIw&callback=initMap`;
        script.async = true;
        document.body.appendChild(script);

        window.initMap = () => {
          const map = new google.maps.Map(document.getElementById("map"), {
            center: {
              lat: formData.location.lat || 11.026432,
              lng: formData.location.lng || 76.988416,
            },
            zoom: 13,
          });

          const marker = new google.maps.Marker({
            position: map.getCenter(),
            map: map,
            draggable: true,
          });

          google.maps.event.addListener(marker, "dragend", function () {
            const newLat = marker.getPosition().lat();
            const newLng = marker.getPosition().lng();
            handleMapClick(newLat, newLng);
          });

          google.maps.event.addListener(map, "click", function (event) {
            const lat = event.latLng.lat();
            const lng = event.latLng.lng();
            handleMapClick(lat, lng);
          });
        };
      };

      loadGoogleMaps();
    }
  }, [isMapOpen]);

  return (
    <>
      <div className="renter-content formss">
        <h2>Add New Equipment</h2>
        <form className="equipment-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <option key={category._id} value={category.name}>
                    {category.name}
                  </option>
                ))
              ) : (
                <option value="">No categories available</option>
              )}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter equipment name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter a brief description"
              rows="4"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Image</label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Price</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter price per day"
              required
            />
          </div>

          <div className="form-group">
            <button className="select-location-button" type="button" onClick={() => setIsMapOpen(true)}>
              Select Location on Map
            </button>
          </div>

          <div className="form-group">
            <label>Location Address</label>
            <input
              type="text"
              value={formData.address}
              readOnly
              className="location-address"
              placeholder="Location address"
            />
          </div>

          <button type="submit" className="submit-btn">
            Add Equipment
          </button>
        </form>

        {isMapOpen && (
          <div className="map-modal">
            <div className="map-container">
              <button
                className="close-map"
                onClick={() => setIsMapOpen(false)}
              >
                Close
              </button>
              <div id="map" style={{ width: "100%", height: "400px" }}></div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </>
  );
};

export default RenterAddEquipments;
