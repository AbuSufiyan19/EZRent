const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }, 
  password: { type: String, required: true },
  fullName: { type: String, required: true }, 
  mobileNumber: { type: String, required: true }, 
  userType: { type: String, required: true }, 
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  verificationTokenExpires: { type: Date },
  location: {
    lat: { type: Number },
    lng: { type: Number },
  },
  locationDistrict: {
    type: String, 
    default: "Click Here",
  },
  status: { type: String },
  idProof: { type: String },
  upiId: { type: String },

  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
