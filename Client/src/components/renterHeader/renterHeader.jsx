import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Correct import for useNavigate
import config from "../../utils/configurl";
import "./renterHeader.css";
import logout from "/logout.webp";
import locationIcon from "/locationlogo.png";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";



const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate(); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false); // For the map modal user interface
  const [currentLocation, setCurrentLocation] = useState({ lat: null, lng: null });
  const [showLocation, setShowLocation] = useState(true); // Track visibility
  const [stateName, setStateName] = useState("Click Here");
  const [lastScrollY, setLastScrollY] = useState(0);
  const [userType, setUserType] = useState("");

  
  
   useEffect(() => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
      if (token) {
        fetchUserType(token);
      }
      fetchUserDistrict();
      fetchUserLocation();
    }, []);
  
    const fetchUserType = async (token) => {
      try {
        const response = await axios.get(`${config.BASE_API_URL}/auth/validate-token`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          setUserType(response.data.userType);
        }
      } catch (error) {
        console.error("Invalid token:", error.response?.data?.message || error.message);
        toast.error('Session Expired. Please login to continue.', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setTimeout(() => {
            navigate("/login");
          }, 4000);    
          }
      
    };

    const fetchUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            setCurrentLocation({ lat: latitude, lng: longitude });
            // fetchStateName(latitude, longitude);
            await updateLocationInDB(latitude, longitude);
          },
          (error) => {
            console.error("Error fetching location:", error.message);
            setStateName("Unable to fetch location");
          }
        );
      } else {
        setStateName("Geolocation not supported");
      }
    };

    const fetchStateName = async (lat, lng) => {
      try {
        console.log(`Fetching state for coordinates: Latitude ${lat}, Longitude ${lng}`);
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json`,
          {
            params: {
              latlng: `${lat},${lng}`,
              key: "AIzaSyAiEvhHmhIdeKSVUF2DqUEVKdWi3LOOjIw", // Replace with a secured key in production
            },
          }
        );
    
        if (response.data.status !== "OK") {
          console.error("API Error:", response.data.status);
          setStateName("Error fetching state");
          return;
        }
    
        const results = response.data.results || [];
        if (results.length === 0) {
          console.warn("No results found for the given coordinates.");
          setStateName("Unknown State");
          return;
        }
    
        const addressComponents = results[0]?.address_components || [];
        console.log("Address Components:", addressComponents);
    
       
        const state = addressComponents.find((component) =>
          component.types.includes("administrative_area_level_3")
        );
    
        if (!state) {
          console.warn("State information not found in address components.");
          setStateName("Unknown State");
        } else {
          setStateName(state.long_name);
          await updateLocationNameInDB(state.long_name);
          console.log(`State Name: ${state.long_name}`);
        }
      } catch (error) {
        console.error("Error fetching state name:", error.message);
        setStateName("Error fetching state");
      }
    };

    const fetchUserDistrict = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("User is not logged in.");
          setStateName("Click Here"); 
          return;
        }
    
        const response = await axios.get(`${config.BASE_API_URL}/users/get-districtname`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          const { district } = response.data;
          setStateName(district || "Unknown District"); // Handle empty or missing district gracefully
          console.log(`User District: ${district}`);
        } else {
          console.error("Failed to fetch user district:", response.status);
        }
      } catch (error) {
        console.error("Error fetching user district:", error.response?.data?.message || error.message);
      }
    };
    
  

  const handleLogoutClick = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    navigate("/"); // Navigate to the login page
  };

  const handlePinLocationClick = () => setIsMapOpen(true);
  const updateLocationNameInDB = async (locationarea) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("User is not logged in.");
        return;
      }
      
      // Send the updated location to the backend API
      const response = await axios.put(
        `${config.BASE_API_URL}/users/update-locationdistrict`,
        {
          locationarea
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.status === 200) {
        console.log("Location District updated successfully.");
      } else {
        console.error("Failed to update location district:", response.data.message);
      }
    } catch (error) {
      console.error("Error updating location district:", error.message);
    }
  };

  const updateLocationInDB = async (lat, lng) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("User is not logged in.");
        return;
      }
      
      // Send the updated location to the backend API
      const response = await axios.put(
        `${config.BASE_API_URL}/users/update-location`,
        {
          lat,
          lng,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.status === 200) {
        console.log("Location updated successfully.");
      } else {
        console.error("Failed to update location:", response.data.message);
      }
    } catch (error) {
      console.error("Error updating location:", error.message);
    }
  };
  const handleMapClick = async (lat, lng) => {
    setCurrentLocation({ lat, lng });
    await fetchStateName(lat, lng);
    await updateLocationInDB(lat, lng);
    setIsMapOpen(false); // Close the modal after updating
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
            center: { lat: currentLocation.lat || 11.026432, lng: currentLocation.lng || 76.988416 },
            zoom: 12,
          });
  
          const marker = new google.maps.Marker({
            position: map.getCenter(),
            map: map,
            draggable: true,
          });
          
          google.maps.event.addListener(marker, "dragend", function () {
            const newLat = marker.getPosition().lat();
            const newLng = marker.getPosition().lng();
            handleMapClick(newLat, newLng); // Update location details
          });
        };
      };

      loadGoogleMaps();
    }
  }, [isMapOpen]);

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY) {
      // User is scrolling down
      setShowLocation(false);
    } else {
      // User is scrolling up
      setShowLocation(true);
    }
    setLastScrollY(currentScrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);


  return (
    <header className="header">
      <button className="menu-btn" onClick={toggleSidebar}>
        ☰
      </button>
      <h1>Construction Equipments Rental</h1>
      <div className="search-profile">
        <img
          className="profile-icon"
          src={logout}
          alt="Logout"
          onClick={handleLogoutClick} // Correct onClick handler
          style={{ cursor: "pointer" }} // Adds pointer cursor on hover
        />
      </div>
      {/* Location Section (Mobile View Only) */}
     {showLocation && (
        <div className="navbar-location-container1">
          <div
            className="navbar-location-mobile1"
            onClick={handlePinLocationClick}
            style={{ cursor: "pointer" }}
          >
            <img
              src={locationIcon}
              alt="Location"
              className="navbar-location-icon"
            />
            <span>{stateName}</span>
          </div>
        </div>
      )}
      {/* Map Modal */}
      {isMapOpen && (
        <div className="map-modal">
          <div className="map-container">
            <button className="close-map" onClick={() => setIsMapOpen(false)}>Close</button>
            <div id="map" style={{ width: "100%", height: "400px" }}></div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
