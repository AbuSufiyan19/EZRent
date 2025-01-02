// File: src/pages/HomeMainPage.jsx
import React from "react";
import CustomerNavbar from "../components/customernavbar/customernavbar";
import Footer from "../components/footer/footer";
import EquipmentDescription from "../components/equipmentdescription/equipmentdescription"


const EquipmentDescriptionPage = () => {
  return (
    <>
      <CustomerNavbar />
      <EquipmentDescription />
      <Footer />
      
    </>
  );
};

export default EquipmentDescriptionPage;
