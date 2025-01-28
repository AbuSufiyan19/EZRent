const express = require("express");
const { addEquipment, fetchEquipments, removeEquipment } = require("../controllers/renterequipmentsController");
const { upload } = require("../multer/equipmentsMulter"); // Correctly import 'upload'

const router = express.Router();

router.post("/add-equipment", upload.single("image"), addEquipment);
router.get("/fetch-equipments", fetchEquipments);
router.delete("/remove-equipment/:id", removeEquipment);

module.exports = router;
