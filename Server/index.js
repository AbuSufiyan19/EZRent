const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const userLocation = require('./routes/userLocation');
const adminRoutes = require("./routes/adminRoutes");
const renterRoutes = require("./routes/renterRoutes");

const path = require("path");
const app = express();


// Load environment variables
require("dotenv").config();

const cors = require("cors");
app.use(cors());  // Enable CORS for all requests
app.use(express.json());
app.use(bodyParser.json());

app.use("/multer/categoryuploads",   express.static(path.join(__dirname, "multer", "categoryuploads")));
app.use("/multer/equipmentuploads", express.static(path.join(__dirname, "multer", "equipmentuploads")));

// Middleware
app.use('/auth', authRoutes);
app.use('/users',userLocation);
app.use('/admin',adminRoutes);
app.use('/renter',renterRoutes);

// Routes


// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
