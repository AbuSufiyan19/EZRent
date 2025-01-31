const express = require("express");
const router = express.Router();
const { fetchCategories, getEquipmentsByCategory, fetchRandomEquipments, fetchEquipments } = require("../controllers/customerController");

router.get("/fetchcategories", fetchCategories);
router.get("/fetchequipments", fetchEquipments);
router.get("/fetchequipments/random", fetchRandomEquipments);
router.get("/equipmentsbycat", getEquipmentsByCategory);


module.exports = router;
