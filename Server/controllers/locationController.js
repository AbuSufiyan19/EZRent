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

module.exports = {
  verifyToken,
  updateLocation,
};
