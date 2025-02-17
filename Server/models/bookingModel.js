const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  equipmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Equipment", required: true },
  equipId: { type: String},
  equipimg: { type: String},
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  renterId: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
  fromDateTime: { type: Date, required: true },
  toDateTime: { type: Date, required: true },
  totalHours: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  extraTimehours: { type: Number}, 
  extraPrice: { type: Number},
  ratings: {type: Number},
  reviews: {type: String},
  notifiedSMS: { type: Boolean},
  statusEq: { type: Boolean},
  status: { type: String, enum: ["Pending", "Confirmed", "Cancelled", "Completed"], default: "Pending" },
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
