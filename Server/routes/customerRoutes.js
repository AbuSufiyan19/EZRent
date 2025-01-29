const express = require("express");
const router = express.Router();
const { fetchCategories } = require("../controllers/customerController");

router.get("/fetchcategories", fetchCategories);

module.exports = router;
