import React, { useEffect, useState } from "react";
import CustomerNavbar from "../components/customernavbar/customernavbar";
import Footer from "../components/footer/footer";
import EquipmentDescription from "../components/equipmentdescription/equipmentdescription";
import { useRequireAuth } from "../utils/sessionutils";
import RecommendationCards from "../components/recommendation/recommendation";

const EquipmentDescriptionPage = () => {
  useRequireAuth();
  const [equipmentId, setEquipmentId] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <CustomerNavbar />
      <EquipmentDescription setEquipmentId={setEquipmentId} />
      
      {/* ✅ Render RecommendationCards only when equipmentId is set */}
      {equipmentId && <RecommendationCards equipmentId={equipmentId} />}

      <Footer />
    </>
  );
};

export default EquipmentDescriptionPage;
