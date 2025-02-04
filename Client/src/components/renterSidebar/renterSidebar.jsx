import React, { useState } from "react";
import { ChevronDown, ChevronUp, LayoutDashboard, Package, CalendarCheck, Star, ClipboardList } from "lucide-react";
import "./renterSidebar.css";
import logo1 from "/loginlogo.png";
import logo2 from "/ezrent.png";

const RenterSidebar = ({ isOpen, toggleSidebar, setActivePage }) => {
  const [dropdownOpen, setDropdownOpen] = useState({
    equipments: false,
    bookings: false,
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
    setActivePage(page);

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
            {/* Renter Dashboard */}
            <li onClick={() => handleSetActivePage("dashboard")} className={activePage === "dashboard" ? "active" : ""}>
              <div className="nav-item">
                <LayoutDashboard size={18} className="icon" />
                <span>Renter Dashboard</span>
              </div>
            </li>

            {/* Manage Equipments */}
            <li>
              <div onClick={() => toggleDropdown("equipments")} className={`nav-item ${dropdownOpen.equipments ? "active" : ""}`}>
                <Package size={18} className="icon" />
                <span>Manage Equipments</span>
                {dropdownOpen.equipments ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
              {dropdownOpen.equipments && (
                <ul className="dropdown">
                  <li onClick={() => handleSetActivePage("add-equipments", "equipments")} className={activePage === "add-equipments" ? "active" : ""}>
                    Add Equipments
                  </li>
                  <li onClick={() => handleSetActivePage("remove-equipments", "equipments")} className={activePage === "remove-equipments" ? "active" : ""}>
                    Remove Equipments
                  </li>
                </ul>
              )}
            </li>

            {/* Manage Bookings */}
            <li>
              <div onClick={() => toggleDropdown("bookings")} className={`nav-item ${dropdownOpen.bookings ? "active" : ""}`}>
                <CalendarCheck size={18} className="icon" />
                <span>Manage Bookings</span>
                {dropdownOpen.bookings ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
              {dropdownOpen.bookings && (
                <ul className="dropdown">
                  <li onClick={() => handleSetActivePage("bookings", "bookings")} className={activePage === "bookings" ? "active" : ""}>
                    Bookings Overview
                  </li>
                  <li onClick={() => handleSetActivePage("approve-bookings", "bookings")} className={activePage === "approve-bookings" ? "active" : ""}>
                    Approve Bookings
                  </li>
                </ul>
              )}
            </li>

            {/* Ratings & Feedbacks */}
            <li onClick={() => handleSetActivePage("feedbacks")} className={activePage === "feedbacks" ? "active" : ""}>
              <div className="nav-item">
                <Star size={18} className="icon" />
                <span>Ratings & Feedbacks</span>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default RenterSidebar;
