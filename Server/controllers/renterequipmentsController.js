const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const Equipment = require("../models/equipmentModel");

const addEquipment = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header

  try {
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Token missing" });
    }

    // Decode the token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET); // Decode using JWT secret
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token", error: err.message });
    }

    const { id, username } = decoded;

    // Extract form data
    const { category, name, description, price, lat, lng, address } = req.body;
    const image = req.file?.filename;

    // Validate required fields
    if (!category || !name || !description || !price || !lat || !lng || !address || !image) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the equipment already exists
    const equipmentExists = await Equipment.findOne({ name, category });
    if (equipmentExists) {
      // Delete the uploaded image
      const imagePath = path.join(__dirname, "../multer/equipmentuploads", image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

      return res.status(400).json({ message: "Equipment already exists" });
    }

    // Create and save the new equipment
    const newEquipment = new Equipment({
      category,
      name,
      description,
      image, // Save the filename in the database
      price,
      location: { lat, lng },
      address,
      renterid: id,
      rentername: username,
    });

    await newEquipment.save();

    res.status(200).json({ message: "Equipment added successfully", equipment: newEquipment });
  } catch (error) {
    console.error("Error adding equipment:", error);
    res.status(500).json({ message: "Error adding equipment", error: error.message });
  }
};

// Fetch all equipment
const fetchEquipments = async (req, res) => {
    try {
      const equipments = await Equipment.find(); // Fetch all equipment
      res.status(200).json(equipments);
    } catch (error) {
      console.error("Error fetching equipment:", error);
      res.status(500).json({ message: "Failed to fetch equipment", error: error.message });
    }
  };
  
  // Remove equipment by ID
  const removeEquipment = async (req, res) => {
    const { id } = req.params;
  
    try {
      const equipment = await Equipment.findById(id);
  
      if (!equipment) {
        return res.status(404).json({ message: "Equipment not found" });
      }
  
      // Delete associated image file
      const imagePath = path.join(__dirname, "../multer/equipmentuploads", equipment.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
  
      await Equipment.deleteOne({ _id: id });
      res.status(200).json({ message: "Equipment removed successfully" });
    } catch (error) {
      console.error("Error removing equipment:", error);
      res.status(500).json({ message: "Failed to remove equipment", error: error.message });
    }
  };

module.exports = { addEquipment, fetchEquipments, removeEquipment };
