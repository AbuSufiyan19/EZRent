const express = require("express");
const router = express.Router();
const { verifyToken, updateLocation, updateLocationDistrict, getUserDistrict, getUserLocation } = require("../controllers/locationController"); // Adjust the path

// Route to update location
router.put("/update-location", verifyToken, updateLocation);

router.put("/update-locationdistrict", verifyToken, updateLocationDistrict);

router.get("/get-districtname", verifyToken, getUserDistrict);

router.get("/location", verifyToken, getUserLocation);

module.exports = router;
