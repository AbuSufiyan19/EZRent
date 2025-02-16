import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/home.css";
import CustomerNavbar from "../components/customernavbar/customernavbar";
import BackgroundSlider from "../components/backgroundslider/backgroundslider";
import CategoriesCarousel from "../components/categoriescarosal/categoriescarosal";
import EquipmentSearch from "../components/equipmentsearch/equipmentsearch";
import AboutUs from "../components/aboutus/aboutus";
import Footer from "../components/footer/footer";
import config from "../utils/configurl";

const HomeMainPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const wakeUpServer = async () => {
      try {
        await axios.get(`${config.BASE_API_URL}/ping`);
      } catch (error) {
        console.error("Server wake-up failed:", error.message);
      }
    };

    wakeUpServer();
  }, []);


  const handleInteraction = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      // Validate the token by calling the backend
      const response = await axios.get(`${config.BASE_API_URL}/auth/validate-token`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const userType = response.data.userType;
          switch (userType) {
            case "admin":
              navigate("/adminhome");
              break;
            case "provider":
              navigate("/renterhome");
              break;
            default:
              break;
          }
      }
    } catch (error) {
      console.error("Invalid token:", error.response?.data?.message || error.message);
      // Navigate to login if the token is invalid
      navigate("/login");
    }
  };
 
  return (
    <div>
      <CustomerNavbar />
      {/* Home Main Page Section */}
      <section id="home" className="home-main-page">
        <BackgroundSlider />  
        {/* Content Section */}
        <div className="content-section">

          {/* Overlay Image */}
          <h1 className="title">Construction Equipment Rental</h1>

          {/* Description */}
          <p className="description">
            Welcome to EZRent, your ultimate partner in construction equipment rental.
            Join us today and explore a world of possibilities!
          </p>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="categories-section" onClick={handleInteraction}>
        <CategoriesCarousel />
      </section>

      <section id="equipment" className="equipment-section" onClick={handleInteraction}>
        <EquipmentSearch />
      </section>

      <section id="aboutus" className="aboutus-section">
        <AboutUs />
      </section>
      
      <Footer />
    </div>
  );
};

export default HomeMainPage;
