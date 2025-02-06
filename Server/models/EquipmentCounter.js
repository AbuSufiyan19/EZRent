const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const equipmentCounterSchema = new Schema({
  year: { type: Number, required: true, unique: true },
  counter: { type: Number, required: true, default: 11 },
});

const EquipmentCounter = mongoose.model('EquipmentCounter', equipmentCounterSchema);

module.exports = EquipmentCounter;