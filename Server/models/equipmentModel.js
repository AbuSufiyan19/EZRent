const mongoose = require("mongoose");

const equipmentSchema = new mongoose.Schema({
  equipmentId: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true }, // Store the image filename
  price: { type: Number, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  address: { type: String, required: true },
  renterid: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Foreign key to User
  rentername: String,
});

const Equipment = mongoose.model("Equipment", equipmentSchema);

module.exports = Equipment;
