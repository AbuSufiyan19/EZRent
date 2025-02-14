const mongoose = require("mongoose");

const equipmentSchema = new mongoose.Schema({
  equipmentId: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "EquipmentCategory" }, 
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true }, // Store the image filename
  price: { type: Number, required: true },
  minHours: { type: Number},
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  averageRating: { type: Number},
  address: { type: String, required: true },
  renterid: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Foreign key to User
  rentername: String,
  availabilityStatus: { type: String, enum: ["available", "unavailable", "rented"], default: "available" },
});

const Equipment = mongoose.model("Equipment", equipmentSchema);

module.exports = Equipment;
