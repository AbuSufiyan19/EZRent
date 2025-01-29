import React, { useState } from "react";
import "./adminSidebar.css";
import logo1 from "/loginlogo.png";
import logo2 from "/ezrent.png";

const AdminSidebar = ({ isOpen, toggleSidebar, setActivePage }) => {
  const [dropdownOpen, setDropdownOpen] = useState({
    dashboards: false,
    equipments: false,
    bookings: false,
    feedbacks: false,
  });

  const [activePage, setActive] = useState("admin-dashboard");

  const toggleDropdown = (key) => {
    setDropdownOpen((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const handleSetActivePage = (page, dropdownKey = null) => {
    setActive(page);
    setActivePage(page); // Update the parent component

    // Close the dropdown if dropdownKey is provided
    if (dropdownKey) {
      setDropdownOpen((prevState) => ({
        ...prevState,
        [dropdownKey]: false,
      }));
    }
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-content">
        <div className="image-container">
          <div className="image-box">
            <img src={logo1} height={60} alt="Logo 1" />
          </div>
          <div className="image-box">
            <img src={logo2} height={20} alt="Logo 2" />
          </div>
        </div>
        <nav>
          <ul>
            {/* Dashboards */}
            <li
              onClick={() => handleSetActivePage("admin-dashboard")}
              className={activePage === "admin-dashboard" ? "active" : ""}
            >
              <div className="nav-item">Admin Dashboard</div>
            </li>

            {/* Manage Equipment Category */}
            <li>
              <div
                onClick={() => toggleDropdown("equipments")}
                className={`nav-item ${
                  dropdownOpen.equipments ? "active" : ""
                }`}
              >
                Manage Equipment Category
              </div>
              {dropdownOpen.equipments && (
                <ul className="dropdown">
                  <li
                    onClick={() =>
                      handleSetActivePage(
                        "add-equipmentscategory",
                        "equipments"
                      )
                    }
                    className={
                      activePage === "add-equipmentscategory" ? "active" : ""
                    }
                  >
                    Add Equipment Category
                  </li>
                  <li
                    onClick={() =>
                      handleSetActivePage(
                        "remove-equipmentscategory",
                        "equipments"
                      )
                    }
                    className={
                      activePage === "remove-equipmentscategory" ? "active" : ""
                    }
                  >
                    Remove Equipment Category
                  </li>
                </ul>
              )}
            </li>

            {/* All Equipments */}
            <li
              onClick={() => handleSetActivePage("all-equipments")}
              className={activePage === "all-equipments" ? "active" : ""}
            >
              <div className="nav-item">Equipments List</div>
            </li>

            {/* Manage Providers */}
            <li
              onClick={() => handleSetActivePage("manage-providers")}
              className={activePage === "manage-providers" ? "active" : ""}
            >
              <div className="nav-item">Manage Providers</div>
            </li>

            {/* Manage Customers */}
            <li
              onClick={() => handleSetActivePage("manage-customers")}
              className={activePage === "manage-customers" ? "active" : ""}
            >
              <div className="nav-item">Manage Customers</div>
            </li>

            {/* Manage Customers */}
            <li
              onClick={() => handleSetActivePage("admin-allcontacts")}
              className={activePage === "admin-allcontacts" ? "active" : ""}
            >
              <div className="nav-item">View Contact Support</div>
            </li>
            
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default AdminSidebar;
