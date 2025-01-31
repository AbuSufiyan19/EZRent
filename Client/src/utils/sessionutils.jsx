import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "./configurl";

export const useRequireAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(`${config.BASE_API_URL}/auth/validate-token`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const userType = response.data.userType;

          // Redirect based on user type
          switch (userType) {
            case "admin":
              navigate("/adminhome");
              break;
            case "provider":
              navigate("/renterhome");
              break;
            case "customer":
              break;
            default:
              break;
          }
        }
      } catch (error) {
        console.error("Invalid token:", error.response?.data?.message || error.message);
        navigate("/login");
      }
    };

    validateToken();
  }, [navigate]);
};
