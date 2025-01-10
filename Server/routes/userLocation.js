const express = require("express");
const router = express.Router();
const { verifyToken, updateLocation } = require("../controllers/locationController"); // Adjust the path

// Route to update location
router.put("/update-location", verifyToken, updateLocation);

module.exports = router;
