const jwt = require("jsonwebtoken");
const User = require("../models/userModel"); 

// Middleware to verify the token and extract the user ID
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Your JWT secret
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(400).json({ message: "Invalid token" });
  }
};

// Controller to handle location update
const updateLocation = async (req, res) => {
  const { lat, lng } = req.body;

  if (!lat || !lng) {
    return res.status(400).json({ message: "Latitude and Longitude are required" });
  }

  try {
    const user = await User.findById(req.userId); // Find user by ID
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the location if the user is found
    user.location = { lat, lng };
    await user.save();

    res.status(200).json({ message: "Location updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateLocationDistrict = async (req, res) => {
  const { locationarea } = req.body;

  // Check if locationarea is missing
  if (!locationarea) {
    return res.status(400).json({ message: "District is required" });
  }

  try {
    // Find user by ID from the authenticated request
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's location district
    user.locationDistrict = locationarea;
    await user.save();

    res.status(200).json({ message: "Location District updated successfully" });
  } catch (error) {
    console.error("Error updating location district:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserDistrict = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Assuming `locationDistrict` is a field in the User schema
    const district = user.locationDistrict;

    if (!district) {
      return res.status(404).json({ message: "District not set for the user" });
    }

    res.status(200).json({ district });
  } catch (error) {
    console.error("Error fetching user district:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserLocation = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Send user location data
    res.json({ location: user.location });
  } catch (error) {
    console.error("Error fetching user location:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = {
  verifyToken,
  updateLocation,
  updateLocationDistrict,
  getUserDistrict,
  getUserLocation,
};
