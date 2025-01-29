import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../../utils/configurl"; // Update with the correct path to your config file
import AdminSidebar from "../../components/adminSidebar/adminSidebar";
import Header from "../../components/renterHeader/renterHeader";
import AdminDashboard from "../../components/adminDashboard/adminDashboard";
import AddEquipmentscategory from "../../components/adminAddCategory/adminAddcategory";
import RemoveEquipmentscategory from "../../components/adminRemovecategory/adminRemovecategory";
import AllEquipments from "../../components/adminAllEquipments/adminAllEquipments";
import ManageProviders from "../../components/adminManageProviders/adminManageProviders";
import ManageCustomers from "../../components/adminManageCustomers/adminManageCustomers"; 
import AdminAllContacts from "../../components/adminAllContacts/adminAllContacts";
import "./homeadmin.css";

const homeadmin = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  const [activePage, setActivePage] = useState("admin-dashboard"); // Track the active page
  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = async () => {
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
              // Stay on the admin dashboard
              break;
            case "provider":
              navigate("/renterhome");
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
        // Navigate to login if the token is invalid
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
      case "admin-dashboard":
        return <AdminDashboard />;
      case "add-equipmentscategory":
        return <AddEquipmentscategory />;
      case "remove-equipmentscategory":
        return <RemoveEquipmentscategory />;
      case "all-equipments":
        return <AllEquipments />;
      case "manage-providers":
        return <ManageProviders />;
      case "manage-customers":
        return <ManageCustomers />;
      case "admin-allcontacts":
        return <AdminAllContacts />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="renter-app">
      {/* Sidebar Component */}
      <AdminSidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        setActivePage={setActivePage}
      />
      <div className={`renter-main ${isSidebarOpen ? "sidebar-open" : ""}`}>
        {/* Header Component */}
        <Header toggleSidebar={toggleSidebar} />
        <main>{renderPage()}</main>
      </div>
    </div>
  );
};

export default homeadmin;
