const express = require("express");
const router = express.Router();
const { fetchCategories, getEquipmentsByCategory, fetchRandomEquipments, fetchEquipments, getrecommendDetails} = require("../controllers/customerController");

router.get("/fetchcategories", fetchCategories);
router.get("/fetchequipments", fetchEquipments);
router.get("/fetchequipments/random", fetchRandomEquipments);
router.get("/equipmentsbycat", getEquipmentsByCategory);

router.post("/fetchrecommendequipments", getrecommendDetails);
module.exports = router;
