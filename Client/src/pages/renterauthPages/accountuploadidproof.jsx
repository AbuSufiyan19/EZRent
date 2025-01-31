import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../../utils/configurl"; // Update the path as needed
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS
import "./accountuploadidproof.css";
import logo from "/loginlogo.png";
import ezrent from "/ezrent.png";

const IDProofUpload = () => {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      // Check file type
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(selectedFile.type)) {
        toast.error("Only JPG, JPEG, and PNG images are allowed!", { autoClose: 3000 });
        return;
      }

      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.warn("Please select a file before uploading.", { autoClose: 3000 });
      return;
    }

    const token = localStorage.getItem("token"); // Get the token from local storage
    if (!token) {
      toast.error("User is not logged in.", { autoClose: 3000 });
      return;
    }

    const formData = new FormData();
    formData.append("idProof", file);

    try {
      // Send the token in the Authorization header
      await axios.post(`${config.BASE_API_URL}/renter/upload-idproof`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("ID Proof uploaded successfully!", { autoClose: 3000 });
      setTimeout(() => navigate("/renterhome"), 3000);
    } catch (error) {
      toast.error("Failed to upload ID Proof. Try again.", { autoClose: 3000 });
    }
  };

  const handleLogoClick = () => {
    navigate("/"); // Navigate to the homepage
  };

  return (
    <div className="upload-container">
      <ToastContainer />
      <img src={logo} alt="logo" className="logo" onClick={handleLogoClick} />
      <img src={ezrent} alt="ezrent" className="ezrent" onClick={handleLogoClick} />
      <p>Please upload a valid government-issued ID proof for verification. Accepted formats include PDF, JPG, and PNG, with a maximum file size of 5MB. This step is essential to securely process and verify your identity, ensuring a smooth rental experience for the construction equipment.</p>
      <h2>Upload Your ID Proof</h2>
      <label className="upload-box">
        <input type="file" accept="image/*" onChange={handleFileChange} hidden />
        <img
          src={file ? URL.createObjectURL(file) : "/placeholder-idproof.svg"}
          alt="Upload ID Proof"
          className="upload-image"
        />
      </label>
      <button className="upload-btn" onClick={handleUpload}>Upload ID Proof</button>
    </div>
  );
};

export default IDProofUpload;
