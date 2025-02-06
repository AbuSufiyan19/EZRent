const express = require("express");
const { addEquipment, fetchEquipments, removeEquipment, updateAvailability } = require("../controllers/renterequipmentsController");
const { upload } = require("../multer/equipmentsMulter"); // Correctly import 'upload'
const { renterStatus, uploadIdProof } = require("../controllers/authController");
const { uploadid } = require("../multer/idproofMulter"); // Correctly import 'upload'

const router = express.Router();

router.post("/add-equipment", upload.single("image"), addEquipment);
router.get("/fetch-equipments", fetchEquipments);
router.delete("/remove-equipment/:id", removeEquipment);

router.get("/status/:userId", renterStatus);

router.post("/upload-idproof", uploadid, uploadIdProof);

router.patch('/update-availability/:id', updateAvailability);


module.exports = router;
