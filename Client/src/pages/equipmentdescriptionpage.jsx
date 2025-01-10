// File: src/pages/HomeMainPage.jsx
import React,{useEffect} from "react";
import CustomerNavbar from "../components/customernavbar/customernavbar";
import Footer from "../components/footer/footer";
import EquipmentDescription from "../components/equipmentdescription/equipmentdescription"
import { useRequireAuth } from "../utils/sessionutils";


const EquipmentDescriptionPage = () => {
  useRequireAuth();
  
   useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
  
  return (
    <>
      <CustomerNavbar />
      <EquipmentDescription />
      <Footer />
      
    </>
  );
};

export default EquipmentDescriptionPage;
