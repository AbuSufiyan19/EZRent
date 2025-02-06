const express = require("express");
const { addEquipmentCategory, fetchCategories, removeCategory, getCategoryCount, getEquipmentsCount, getCustomerCount, getProviderCount, getBookingCount, fetchAllEquipments } = require("../controllers/admincategoryController");
const { fetchAllCustomers, fetchAllProviders, removeCustomer, removeProvider, storeContactsupport, fetchAllContactsupport, approveProvider, rejectProvider, reuploadProvider, blockProvider } = require("../controllers/adminmanageController");
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
router.get("/booking-count", getBookingCount);

router.get("/fetchall-equipments", fetchAllEquipments);
router.get("/fetchall-customers", fetchAllCustomers);
router.get("/fetchall-providers", fetchAllProviders);
router.delete("/remove-customer/:id", removeCustomer);
router.delete("/remove-provider/:id", removeProvider);

router.post("/contactsupport", storeContactsupport);
router.get("/fetchall-contactsupport", fetchAllContactsupport);

router.put("/approve-provider/:id", approveProvider);
router.put("/reject-provider/:id", rejectProvider);
router.put("/reupload-provider/:id", reuploadProvider);
router.put("/block-provider/:id", blockProvider);

module.exports = router;
