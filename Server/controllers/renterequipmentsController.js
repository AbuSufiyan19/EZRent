const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const Equipment = require("../models/equipmentModel");
const addEquipment = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  try {
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Token missing" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token", error: err.message });
    }

    const { id, username } = decoded;
    const { category, name, description, price, lat, lng, address } = req.body;
    const image = req.file?.filename;

    if (!category || !name || !description || !price || !lat || !lng || !address || !image) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Generate a custom equipment ID (EQYYYYEZN)
    const currentYear = new Date().getFullYear();

    // Find the latest equipment ID for this year
    const latestEquipment = await Equipment.findOne({ equipmentId: new RegExp(`^EQ${currentYear}EZ`) })
      .sort({ equipmentId: -1 }) // Sort in descending order to get the latest entry
      .exec();

    let nextNumber = 1; // Default to 1 if no equipment exists for the year
    if (latestEquipment) {
      const lastId = latestEquipment.equipmentId;
      const lastNumberMatch = lastId.match(/EZ(\d+)$/); // Extract the numeric part after "EZ"

      if (lastNumberMatch) {
        nextNumber = parseInt(lastNumberMatch[1], 10) + 1; // Increment the extracted number
      }
    }

    const equipmentId = `EQ${currentYear}EZ${nextNumber}`;

    // Check if the equipment already exists
    const equipmentExists = await Equipment.findOne({ name, category });
    if (equipmentExists) {
      const imagePath = path.join(__dirname, "../multer/equipmentuploads", image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

      return res.status(400).json({ message: "Equipment already exists" });
    }

    // Create and save the new equipment
    const newEquipment = new Equipment({
      equipmentId, // Store custom ID
      category,
      name,
      description,
      image,
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
  const token = req.headers["authorization"]?.split(" ")[1]; // Extract token from headers
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    // Decode JWT and get userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const renterid = decoded.id; // Ensure this matches how you store it in the token

    // Fetch equipment belonging to the logged-in user
    const equipments = await Equipment.find({ renterid });

    if (!equipments || equipments.length === 0) {
      return res.status(404).json({ message: "No equipment found" });
    }

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
