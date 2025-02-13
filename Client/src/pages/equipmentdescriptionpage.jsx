// File: src/pages/HomeMainPage.jsx
import React,{useEffect} from "react";
import CustomerNavbar from "../components/customernavbar/customernavbar";
import Footer from "../components/footer/footer";
import EquipmentDescription from "../components/equipmentdescription/equipmentdescription"
import { useRequireAuth } from "../utils/sessionutils";
import RecommendationCards from "../components/recommendation/recommendation";


const EquipmentDescriptionPage = () => {
  useRequireAuth();
  
   useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
  
  return (
    <>
      <CustomerNavbar />
      <EquipmentDescription />
      <RecommendationCards />
      <Footer />
      
    </>
  );
};

export default EquipmentDescriptionPage;
