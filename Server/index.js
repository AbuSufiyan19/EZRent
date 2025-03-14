const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const userLocation = require('./routes/userLocation');
const adminRoutes = require("./routes/adminRoutes");
const renterRoutes = require("./routes/renterRoutes");
const customerRoutes = require("./routes/customerRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

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
app.use("/multer/idproofuploads", express.static(path.join(__dirname, "multer", "idproofuploads")));

// Middleware
app.use('/auth', authRoutes);
app.use('/users',userLocation);
app.use('/admin',adminRoutes);
app.use('/renter',renterRoutes);
app.use('/customer',customerRoutes);
app.use('/bookings',bookingRoutes);
app.use('/payment', paymentRoutes);


// Routes


// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

  app.get("/ping", (req, res) => {
    // console.log("Server is running"); 
    res.status(200).json({ message: "Server is running" });
  });
  

  const cron = require("node-cron");
  const axios = require("axios");
  
  const RETRAIN_API_URL = process.env.PYURL; 
  
  const callRetrainAPI = async () => {
    try {
      const response = await axios.post(RETRAIN_API_URL);
      console.log("Retrain API Response:", response.data);
    } catch (error) {
      console.error("Error calling retrain API:", error.message);
    }
  };
  
  // Schedule job to run every 7 days at 00:00 (midnight)
  cron.schedule("0 0 */7 * *", () => {
    console.log("Running scheduled retrain API call...");
    callRetrainAPI();
  });
  
  console.log("Cron job scheduled: Retrain API will run every 7 days.");
  

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
