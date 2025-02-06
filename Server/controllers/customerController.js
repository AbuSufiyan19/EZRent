const EquipmentCategory = require("../models/equipmentcategoryModel");
const Equipment = require("../models/equipmentModel");
const mongoose = require('mongoose');

const fetchCategories = async (req, res) => {
  try {
    const category = await EquipmentCategory.find();
    res.status(200).json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ message: "Failed to fetch category", error: error.message });
  }
};

const fetchEquipments = async (req, res) => {
  try {
    const equipments = await Equipment.find({ availabilityStatus: "available" });
    res.status(200).json(equipments);
  } catch (error) {
    console.error("Error fetching equipments:", error);
    res.status(500).json({ message: "Failed to fetch equipments", error: error.message });
  }
};

const fetchRandomEquipments = async (req, res) => {
    try {
      const equipments = await Equipment.aggregate([
        { $match: { availabilityStatus: "available" } }, // Ensure only available ones
        { $sample: { size: 8 } }
      ]);
        res.status(200).json(equipments);
    } catch (error) {
        console.error("Error fetching random equipments:", error);
        res.status(500).json({ message: "Failed to fetch random equipments", error: error.message });
    }
    }

    const getEquipmentsByCategory = async (req, res) => {
        try {
          const { categoryId } = req.query;

          if (!categoryId) {
            return res.status(400).json({ message: "Category ID is required" });
          }
      
          if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            return res.status(400).json({ message: "Invalid Category ID" });
          }
      
          const equipments = await Equipment.find({ 
            categoryId: new mongoose.Types.ObjectId(categoryId), 
            availabilityStatus: "available" 
          });
          res.status(200).json(equipments);
        } catch (error) {
          console.error("Error fetching equipment:", error);
          res.status(500).json({ message: "Error fetching equipment", error });
        }
      };
module.exports = { fetchCategories, fetchEquipments, fetchRandomEquipments, getEquipmentsByCategory };
