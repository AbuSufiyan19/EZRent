const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const Equipment = require("../models/equipmentModel");
const EquipmentCounter = require("../models/EquipmentCounter");


const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

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
    const { category, categoryId, name, description, price, lat, lng, address, categoryName, minHours } = req.body;
    const image = req.file?.path;

    if (!category || !categoryId || !name || !description || !price || !lat || !lng || !address || !image) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Generate a custom equipment ID (EQYYYYEZN)
    const currentYear = new Date().getFullYear();

    // Retrieve or initialize the counter for the current year
    const counter = await EquipmentCounter.findOneAndUpdate(
      { year: currentYear }, // Find the counter for the current year
      { $inc: { counter: 1 } }, // Increment the counter by 1
      { new: true, upsert: true } // Create the counter if it doesn't exist
    );

    // Generate the equipment ID using the incremented counter
    const equipmentId = `EQ${currentYear}EZ${counter.counter}`;

    // Check if the equipment already exists
    // const equipmentExists = await Equipment.findOne({ name, category });
    // if (equipmentExists) {
    //   const publicId = req.file.filename.split('.')[0]; // Assuming the public ID is based on the file's original name
    //   cloudinary.uploader.destroy(publicId, (error, result) => {
    //     if (error) {
    //       console.error("Error deleting image from Cloudinary:", error);
    //     } else {
    //       console.log("Image deleted from Cloudinary:", result);
    //     }
    //   });

    //   return res.status(400).json({ message: "Equipment already exists" });
    // }

    // Create and save the new equipment
    const newEquipment = new Equipment({
      equipmentId, // Store custom ID
      category,
      categoryId,
      name,
      minHours,
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
  
      const url = equipment.image; 
      const publicId = decodeURIComponent(url.split("/").slice(-2, -1).concat(url.split("/").pop().split(".")[0]).join("/"));
      // Delete the image from Cloudinary
      const result = await cloudinary.uploader.destroy(publicId);
  
      if (result.result !== 'ok') {
        console.error("Error deleting image from Cloudinary:", result);
        return res.status(500).json({ message: "Failed to delete image from Cloudinary" });
      }
  
      console.log("Image deleted from Cloudinary:", result);
  
      await Equipment.deleteOne({ _id: id });
      res.status(200).json({ message: "Equipment removed successfully" });
    } catch (error) {
      console.error("Error removing equipment:", error);
      res.status(500).json({ message: "Failed to remove equipment", error: error.message });
    }
  };

  const updateAvailability = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // Expecting { status: 'available' | 'unavailable' }
  
    try {
      const equipment = await Equipment.findByIdAndUpdate(
        id,
        { availabilityStatus: status }, // Update the availability status
        { new: true } // Return the updated document
      );
  
      if (!equipment) {
        return res.status(404).json({ message: "Equipment not found." });
      }
  
      res.status(200).json({ message: "Availability status updated successfully.", equipment });
    } catch (error) {
      console.error("Error updating availability:", error);
      res.status(500).json({ message: "Failed to update availability." });
    }
  };

module.exports = { addEquipment, fetchEquipments, removeEquipment, updateAvailability };
