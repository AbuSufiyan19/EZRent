import React, { useState } from "react";
import { ChevronDown, ChevronUp, LayoutDashboard, Package, Users, UserCheck, ClipboardList, MessageCircle } from "lucide-react";
import "./adminSidebar.css";
import logo1 from "/loginlogo.png";
import logo2 from "/ezrent.png";

const AdminSidebar = ({ isOpen, toggleSidebar, setActivePage }) => {
  const [dropdownOpen, setDropdownOpen] = useState({
    equipments: false,
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
            {/* Dashboards */}
            <li onClick={() => handleSetActivePage("admin-dashboard")} className={activePage === "admin-dashboard" ? "active" : ""}>
              <div className="nav-item">
                <LayoutDashboard size={18} className="icon" />
                <span>Admin Dashboard</span>
              </div>
            </li>

            {/* Manage Equipment Category */}
            <li>
              <div onClick={() => toggleDropdown("equipments")} className={`nav-item ${dropdownOpen.equipments ? "active" : ""}`}>
                <Package size={18} className="icon" />
                <span>Manage Equipment Category</span>
                {dropdownOpen.equipments ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
              {dropdownOpen.equipments && (
                <ul className="dropdown">
                  <li onClick={() => handleSetActivePage("add-equipmentscategory", "equipments")} className={activePage === "add-equipmentscategory" ? "active" : ""}>
                    Add Equipment Category
                  </li>
                  <li onClick={() => handleSetActivePage("remove-equipmentscategory", "equipments")} className={activePage === "remove-equipmentscategory" ? "active" : ""}>
                    Remove Equipment Category
                  </li>
                </ul>
              )}
            </li>

            {/* All Equipments */}
            <li onClick={() => handleSetActivePage("all-equipments")} className={activePage === "all-equipments" ? "active" : ""}>
              <div className="nav-item">
                <ClipboardList size={18} className="icon" />
                <span>Equipments List</span>
              </div>
            </li>

            {/* Manage Providers */}
            <li onClick={() => handleSetActivePage("manage-providers")} className={activePage === "manage-providers" ? "active" : ""}>
              <div className="nav-item">
                <UserCheck size={18} className="icon" />
                <span>Manage Providers</span>
              </div>
            </li>

            {/* Manage Customers */}
            <li onClick={() => handleSetActivePage("manage-customers")} className={activePage === "manage-customers" ? "active" : ""}>
              <div className="nav-item">
                <Users size={18} className="icon" />
                <span>Manage Customers</span>
              </div>
            </li>

            {/* View Contact Support */}
            <li onClick={() => handleSetActivePage("admin-allcontacts")} className={activePage === "admin-allcontacts" ? "active" : ""}>
              <div className="nav-item">
                <MessageCircle size={18} className="icon" />
                <span>View Contact Support</span>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default AdminSidebar;
