const EquipmentCategory = require("../models/equipmentcategoryModel");

const fetchCategories = async (req, res) => {
  try {
    const category = await EquipmentCategory.find();
    console.log("Equipments fetched:", category);
    res.status(200).json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ message: "Failed to fetch category", error: error.message });
  }
};
 
module.exports = { fetchCategories };
