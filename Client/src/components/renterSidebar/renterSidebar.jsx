import React, { useState } from "react";
import "./renterSidebar.css";
import logo1 from "/loginlogo.png";
import logo2 from "/ezrent.png";

const RenterSidebar = ({ isOpen, toggleSidebar, setActivePage }) => {
  const [dropdownOpen, setDropdownOpen] = useState({
    dashboards: false,
    equipments: false,
    bookings: false,
    feedbacks: false,
  });

  const [activePage, setActive] = useState("dashboard");

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
              onClick={() => handleSetActivePage("dashboard")}
              className={activePage === "dashboard" ? "active" : ""}
            >
              <div className="nav-item">Renter Dashboard</div>
            </li>

            {/* Manage Equipments */}
            <li>
              <div
                onClick={() => toggleDropdown("equipments")}
                className={`nav-item ${
                  dropdownOpen.equipments ? "active" : ""
                }`}
              >
                Manage Equipments
              </div>
              {dropdownOpen.equipments && (
                <ul className="dropdown">
                  <li
                    onClick={() =>
                      handleSetActivePage("add-equipments", "equipments")
                    }
                    className={activePage === "add-equipments" ? "active" : ""}
                  >
                    Add Equipments
                  </li>
                  <li
                    onClick={() =>
                      handleSetActivePage("remove-equipments", "equipments")
                    }
                    className={
                      activePage === "remove-equipments" ? "active" : ""
                    }
                  >
                    Remove Equipments
                  </li>
                </ul>
              )}
            </li>

            {/* Manage Bookings */}
            <li>
              <div
                onClick={() => toggleDropdown("bookings")}
                className={`nav-item ${dropdownOpen.bookings ? "active" : ""}`}
              >
                Manage Bookings
              </div>
              {dropdownOpen.bookings && (
                <ul className="dropdown">
                  <li
                    onClick={() =>
                      handleSetActivePage("bookings", "bookings")
                    }
                    className={activePage === "bookings" ? "active" : ""}
                  >
                    Bookings Overview
                  </li>
                  <li
                    onClick={() =>
                      handleSetActivePage("approve-bookings", "bookings")
                    }
                    className={
                      activePage === "approve-bookings" ? "active" : ""
                    }
                  >
                    Approve Bookings
                  </li>
                </ul>
              )}
            </li>

            {/* Ratings & Feedbacks */}
            <li
              onClick={() => handleSetActivePage("feedbacks")}
              className={activePage === "feedbacks" ? "active" : ""}
            >
              <div className="nav-item">Ratings & Feedbacks</div>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default RenterSidebar;
