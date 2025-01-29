const express = require("express");
const { addEquipmentCategory, fetchCategories, removeCategory, getCategoryCount, getEquipmentsCount, getCustomerCount, getProviderCount, fetchAllEquipments } = require("../controllers/admincategoryController");
const { fetchAllCustomers, fetchAllProviders, removeCustomer, removeProvider, storeContactsupport, fetchAllContactsupport } = require("../controllers/adminmanageController");
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

router.get("/fetchall-equipments", fetchAllEquipments);
router.get("/fetchall-customers", fetchAllCustomers);
router.get("/fetchall-providers", fetchAllProviders);
router.delete("/remove-customer/:id", removeCustomer);
router.delete("/remove-provider/:id", removeProvider);

router.post("/contactsupport", storeContactsupport);
router.get("/fetchall-contactsupport", fetchAllContactsupport);


module.exports = router;
