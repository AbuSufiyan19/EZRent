const mongoose = require("mongoose");

const equipmentCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  image: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("EquipmentCategory", equipmentCategorySchema);
