import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./eqrecommendation.css";
import config from "../../utils/configurl";

const RecommendationCards = () => {
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const [equipments, setEquipments] = useState([]);
  
  const token = localStorage.getItem("token");

  useEffect(() => {
    const validateTokenAndFetch = async () => {
      try {
        const response = await axios.get(`${config.BASE_API_URL}/auth/validate-token`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const userId = response.data.userId;
          fetchAndStoreRecommendations(userId);
        }
      } catch (error) {
        console.error("Error validating token:", error);
      }
    };

    if (token) {
      validateTokenAndFetch();
    }
  }, [token]);

  const fetchAndStoreRecommendations = async (userId) => {
    try {
      const response = await axios.get(`${config.PY_API_URL}/recommend/${userId}`);
      const equipmentIds = response.data.recommended_equipment || [];

      if (equipmentIds.length === 0) {
        setEquipments([]);
        return;
      }

      const detailsResponse = await axios.post(`${config.BASE_API_URL}/customer/fetchrecommendequipments`, {
        equipmentIds,
      });

      setEquipments(detailsResponse.data || []);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  };

  // 🛑 Remove the automatic scrolling effect

  // ✅ Enable Drag Scrolling (Click & Drag)
  useEffect(() => {
    const slider = scrollRef.current;
    let isDown = false;
    let startX;
    let scrollLeft;

    const startDragging = (e) => {
      isDown = true;
      slider.classList.add("active");
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    };

    const stopDragging = () => {
      isDown = false;
      slider.classList.remove("active");
    };

    const onDrag = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 2; // Adjust speed here
      slider.scrollLeft = scrollLeft - walk;
    };

    if (slider) {
      slider.addEventListener("mousedown", startDragging);
      slider.addEventListener("mouseleave", stopDragging);
      slider.addEventListener("mouseup", stopDragging);
      slider.addEventListener("mousemove", onDrag);
    }

    return () => {
      if (slider) {
        slider.removeEventListener("mousedown", startDragging);
        slider.removeEventListener("mouseleave", stopDragging);
        slider.removeEventListener("mouseup", stopDragging);
        slider.removeEventListener("mousemove", onDrag);
      }
    };
  }, []);

  const handleViewDetails = (equipment) => {
    navigate("/equipdesc", { state: { equipment } });
    window.scrollTo(0, 0);
  };


  return (
    <>
      <h2 className="recommend-title">You Might Also Like</h2>
      <div className="scrolling-container" ref={scrollRef}>
        <div className="scrolling-content">
          {equipments.length > 0 ? (
            equipments.map((equipment) => (
              <div key={equipment._id} className="recommend-card">
                <img
                  src={`${equipment.image}`}
                  alt={equipment.name}
                  className="recommend-img"
                />
                <div className="recommend-overlay">
                  <h3 className="recommend-eqtitle">{equipment.name}</h3>
                  <button className="recommend-btn" onClick={() => handleViewDetails(equipment)}>
                    View Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>Loading recommendations...</p>
          )}
        </div>
      </div>
    </>
  );
};

export default RecommendationCards;
