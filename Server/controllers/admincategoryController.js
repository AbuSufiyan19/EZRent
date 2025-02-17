const fs = require("fs");
const path = require("path");
const EquipmentCategory = require("../models/equipmentcategoryModel");
const Equipment = require("../models/equipmentModel");
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');


const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Add Equipment Category with image upload
const addEquipmentCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const image = req.file ? req.file.path : null;

    if (!name || !image) {
      return res.status(400).json({ message: "Name and image are required" });
    }

    // Check if the category already exists
    const categoryExists = await EquipmentCategory.findOne({ name });

    if (categoryExists) {
      // Delete the uploaded image from Cloudinary if category exists
      const publicId = req.file.filename.split('.')[0]; // Assuming the public ID is based on the file's original name
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          console.error("Error deleting image from Cloudinary:", error);
        } else {
          console.log("Image deleted from Cloudinary:", result);
        }
      });

      return res.status(400).json({ message: "Category name already exists" });
    }

    // Create and save the new category
    const newCategory = new EquipmentCategory({
      name,
      image,
    });

    await newCategory.save();
    res.status(201).json({ message: "Category added successfully", newCategory });
  } catch (error) {
    console.error("Error during category creation:", error);
    res.status(500).json({ message: error.message });
  }
};


const fetchCategories = async (req, res) => {
    try {
      const categories = await EquipmentCategory.find();
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  };
  
  const removeCategory = async (req, res) => {
    try {
      const { id } = req.params;
      const category = await EquipmentCategory.findById(id);
  
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
  
      const url = category.image; // The Cloudinary URL stored in the 'image' field
      const publicId = decodeURIComponent(url.split("/").slice(-2, -1).concat(url.split("/").pop().split(".")[0]).join("/"));
      // Delete the image from Cloudinary
      const result = await cloudinary.uploader.destroy(publicId);
  
      if (result.result !== 'ok') {
        console.error("Error deleting image from Cloudinary:", result);
        return res.status(500).json({ message: "Failed to delete image from Cloudinary" });
      }
  
      console.log("Image deleted from Cloudinary:", result);
      await Equipment.updateMany(
        { categoryId: id }, // Query for documents with the categoryId
        { availabilityStatus: 'blocked' } // Update availability to "blocked"
      );
  
      // Delete the category from the database
      await EquipmentCategory.findByIdAndDelete(id);
      res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
      console.error("Error during category deletion:", error);
      res.status(500).json({ message: "Failed to delete category" });
    }
  };
        
const getCategoryCount = async (req, res) => {
  try {
    const count = await EquipmentCategory.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    console.error("Error fetching category count:", error);
    res.status(500).json({ message: "Error fetching category count" });
  }
};

const getEquipmentsCount = async (req, res) => {
  try {
    const count = await Equipment.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    console.error("Error fetching equipment count:", error);
    res.status(500).json({ message: "Error fetching equipment count" });
  }
};

const getProviderCount = async (req, res) => {
  try {
    // Count the number of users with userType as "provider"
    const count = await User.countDocuments({ userType: "provider" });

    res.status(200).json({ count });
  } catch (error) {
    console.error("Error fetching provider count:", error);
    res.status(500).json({ message: "Error fetching provider count" });
  }
};

const getCustomerCount = async (req, res) => {
    try {
      // Count the number of users with userType as "provider"
      const count = await User.countDocuments({ userType: "customer" });
  
      res.status(200).json({ count });
    } catch (error) {
      console.error("Error fetching customer count:", error);
      res.status(500).json({ message: "Error fetching customer count" });
    }
  };
  
  const getBookingCount = async (req, res) => {
    try {
      // Count the number of users with userType as "provider"
      const count = await Booking.countDocuments();
  
      res.status(200).json({ count });
    } catch (error) {
      console.error("Error fetching booking count:", error);
      res.status(500).json({ message: "Error fetching booking count" });
    }
  };

// Fetch all equipment
const fetchAllEquipments = async (req, res) => {
  try {
    const equipments = await Equipment.find(); // Fetch all equipment
    res.status(200).json(equipments);
  } catch (error) {
    console.error("Error fetching equipment:", error);
    res.status(500).json({ message: "Failed to fetch equipment", error: error.message });
  }
};

module.exports = { addEquipmentCategory, fetchCategories, removeCategory, getCategoryCount, getEquipmentsCount, getBookingCount, getProviderCount, getCustomerCount, fetchAllEquipments };
