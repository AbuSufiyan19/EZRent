import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../../utils/configurl"; // Update the path to your config file
import Sidebar from "../../components/renterSidebar/renterSidebar";
import Header from "../../components/renterHeader/renterHeader";
import Dashboard from "../../components/renterDashboard/renterDashboard";
import AddEquipments from "../../components/renterAddEquipments/renterAddEquipments";
import RemoveEquipments from "../../components/renterRemoveEquipments/renterRemoveEquipments";
import ApproveBookings from "../../components/renterApproveBookings/renterApproveBookings";
import ViewAllBookings from "../../components/renterViewAllBookings/renterViewAllBookings";
import "./homerenter.css";

const HomeRent = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  const [activePage, setActivePage] = useState("dashboard"); // Track the active page
  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        // Step 1: Validate the token
        const response = await axios.get(`${config.BASE_API_URL}/auth/validate-token`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          const userType = response.data.userType;

          switch (userType) {
            case "admin":
              navigate("/adminhome");
              break;
            case "provider":
              // Step 2: Check the provider's status
              checkProviderStatus(response.data.userId); // Call status check function
              break;
            case "customer":
              navigate("/");
              break;
            default:
              navigate("/login");
              break;
          }
        }
      } catch (error) {
        console.error("Invalid token:", error.response?.data?.message || error.message);
        navigate("/login");
      }
    };

    // Step 3: Check provider's status
    const checkProviderStatus = async (userId) => {
      try {
        const statusResponse = await axios.get(`${config.BASE_API_URL}/renter/status/${userId}`);

        if (statusResponse.status === 200) {
          const status = statusResponse.data.status;

          switch (status) {
            case "approved":
              break; // Stay on the same page
            case "registered":
              navigate("/account-uploadIdproof"); // Redirect to pending verification page
              break;
            case "uploaded":
              navigate("/account-pendingverification"); 
              break;
            case "reupload":
              navigate("/account-reuploadIdproof"); 
              break;
            case "blocked":
              navigate("/account-blocked");
              break;
            case "rejected":
              navigate("/account-rejected"); // Redirect to rejection page
              break;
            default:
              navigate("/login"); // Fallback case
              break;
          }
        }
      } catch (error) {
        console.error("Error checking provider status:", error.response?.data?.message || error.message);
        navigate("/login");
      }
    };

    validateToken();

    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [navigate]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard />;
      case "add-equipments":
        return <AddEquipments />;
      case "remove-equipments":
        return <RemoveEquipments />;
      case "approve-bookings":
        return <ApproveBookings />;
      case "viewall-bookings":
        return <ViewAllBookings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="renter-app">
      {/* Sidebar Component */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} setActivePage={setActivePage} />
      <div className={`renter-main ${isSidebarOpen ? "sidebar-open" : ""}`}>
        {/* Header Component */}
        <Header toggleSidebar={toggleSidebar} />
        <main>{renderPage()}</main>
      </div>
    </div>
  );
};

export default HomeRent;
