// File: src/pages/HomeMainPage.jsx
import React from "react";
import CustomerNavbar from "../components/customernavbar";
import Footer from "../components/footer";
import EquipmentCategories from "../components/categories/categories"


const EquipmentCategoriesPage = () => {
  return (
    <>
      <CustomerNavbar />
      <EquipmentCategories />
      <Footer />
      
    </>
  );
};

export default EquipmentCategoriesPage;
