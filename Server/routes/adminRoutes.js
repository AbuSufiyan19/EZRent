const express = require("express");
const { addEquipmentCategory, fetchCategories, removeCategory, getCategoryCount, getEquipmentsCount, getCustomerCount, getProviderCount } = require("../controllers/admincategoryController");
const { upload } = require("../multer/categoryMulter"); // Correctly import 'upload'

const router = express.Router();

// Route for adding equipment category
router.post("/addequipment-category", upload.single("image"), addEquipmentCategory);
router.get("/fetch-categories", fetchCategories); 
router.delete("/remove-category/:id", removeCategory); 
  
// Route to get category count
router.get("/category-count", getCategoryCount);
router.get("/equipment-count", getEquipmentsCount);
router.get("/customer-count", getCustomerCount);
router.get("/provider-count", getProviderCount);


module.exports = router;
