const fs = require("fs");
const path = require("path");
const EquipmentCategory = require("../models/equipmentcategoryModel");
const Equipment = require("../models/equipmentModel");
const User = require('../models/userModel');


const addEquipmentCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!name || !image) {
      return res.status(400).json({ message: "Name and image are required" });
    }

    // Check if the category already exists
    const categoryExists = await EquipmentCategory.findOne({ name });
    if (categoryExists) {
      // Delete the uploaded image
      const imagePath = path.join(__dirname, "../multer/categoryuploads", image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

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
      
          // Delete the image file from the uploads folder
          const imagePath = path.join(__dirname, "../multer/categoryuploads", category.image);
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
      
          // Delete the category from the database
          await EquipmentCategory.findByIdAndDelete(id);
          res.status(200).json({ message: "Category deleted successfully" });
        } catch (error) {
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

module.exports = { addEquipmentCategory, fetchCategories, removeCategory, getCategoryCount, getEquipmentsCount, getProviderCount, getCustomerCount };
