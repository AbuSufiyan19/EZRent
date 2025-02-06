const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken"); // Missing import
const Booking = require("../models/bookingModel");
const mongoose = require("mongoose");

// Store a new booking
router.post("/book", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
  try {
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Token missing" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token", error: err.message });
    }

    const { id, username } = decoded;
    const { equipmentId, fromDateTime, toDateTime, totalHours, totalPrice, equipId, equipimg, renterId} = req.body;

    // Ensure all required fields are provided
    if (!equipmentId || !fromDateTime || !toDateTime || !totalHours || !totalPrice || !equipId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Convert date strings to Date objects
    const fromDate = new Date(fromDateTime);
    const toDate = new Date(toDateTime);

    // Check for overlapping bookings
    const existingBookings = await Booking.find({
      equipmentId,
      $or: [
        { fromDateTime: { $lt: toDate, $gte: fromDate } },
        { toDateTime: { $gt: fromDate, $lte: toDate } },
        { fromDateTime: { $lte: fromDate }, toDateTime: { $gte: toDate } }
      ]
    });

    if (existingBookings.length > 0) {
      return res.status(400).json({ message: "This time slot is already booked!" });
    }

    // Store booking in DB
    const newBooking = new Booking({
      equipmentId,
      equipId,
      equipimg,
      userId: id,
      renterId,
      fromDateTime: fromDate,
      toDateTime: toDate,
      totalHours,
      totalPrice,
    });

    await newBooking.save();
    res.status(201).json({ message: "Booking successful!", booking: newBooking });

  } catch (error) {
    console.error("Error booking equipment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/equipment/:equipmentId", async (req, res) => {
    try {
        const { equipmentId } = req.params;
        const bookings = await Booking.find({ equipmentId: new mongoose.Types.ObjectId(equipmentId) });
        res.status(200).json(bookings);
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).json({ message: "Error fetching bookings" });
    }
});


router.get('/fetchmybookings', async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];  // Get the token from the Authorization header
    
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Token missing" });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Verify the token with the secret key
      
      const { id } = decoded;  // Extract user id from the decoded token
      
      // Fetch the bookings for the user from the database
      const bookings = await Booking.find({ userId: new mongoose.Types.ObjectId(id) })
      .sort({ fromDateTime: -1 });  // -1 sorts in descending order
        res.status(200).json(bookings);  // Send the bookings data as response
      
    } catch (err) {
      // Handle error when token is invalid or expired
      return res.status(401).json({ message: "Invalid or expired token", error: err.message });
    }
  });

  router.get('/fetchall-bookings', async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];  // Get the token from the Authorization header
    
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Token missing" });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Verify the token with the secret key
      
      const { id } = decoded;  // Extract user id from the decoded token
      
      // Fetch the bookings for the user from the database
      const bookings = await Booking.find({ 
        renterId: new mongoose.Types.ObjectId(id), 
        status: { $ne: "Pending" }  // Exclude Pending status
      }).sort({ fromDateTime: -1 });
        res.status(200).json(bookings);  // Send the bookings data as response
      
    } catch (err) {
      // Handle error when token is invalid or expired
      return res.status(401).json({ message: "Invalid or expired token", error: err.message });
    }
  });


  router.get('/fetchbookingapproval', async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];  // Get the token from the Authorization header
    
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Token missing" });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Verify the token with the secret key
      
      const { id } = decoded;  // Extract user id from the decoded token
      
   // Fetch the bookings for the user from the database
      const bookings = await Booking.find({
        renterId: new mongoose.Types.ObjectId(id),
        status: 'Pending'  // Filter for bookings with status 'pending'
      })
      .sort({ fromDateTime: -1 });  // -1 sorts in descending order

      res.status(200).json(bookings);  // Send the bookings data as response
    } catch (err) {
      // Handle error when token is invalid or expired
      return res.status(401).json({ message: "Invalid or expired token", error: err.message });
    }
  });


  router.patch('/approvebooking/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const booking = await Booking.findByIdAndUpdate(
        id,
        { status: 'Confirmed' }, // Change status to 'booked'
        { new: true } // Return the updated document
      );
  
      if (!booking) {
        return res.status(404).json({ message: "Booking not found." });
      }
  
      res.status(200).json({ message: "Booking confirmed successfully.", booking });
    } catch (error) {
      console.error("Error approving booking:", error);
      res.status(500).json({ message: "Failed to approve booking." });
    }
  });
  
  // Reject a booking
  router.patch('/rejectbooking/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const booking = await Booking.findByIdAndUpdate(
        id,
        { status: 'Cancelled' }, // Change status to 'rejected'
        { new: true } // Return the updated document
      );
  
      if (!booking) {
        return res.status(404).json({ message: "Booking not found." });
      }
  
      res.status(200).json({ message: "Booking cancelled successfully.", booking });
    } catch (error) {
      console.error("Error rejecting booking:", error);
      res.status(500).json({ message: "Failed to reject booking." });
    }
  });

  router.put("/update-status/:id", async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
  
    try {
      const booking = await Booking.findById(id);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
  
      booking.status = status;
      await booking.save();
  
      res.status(200).json({ message: `Booking marked as ${status}` });
    } catch (error) {
      res.status(500).json({ message: "Error updating booking status" });
    }
  });

module.exports = router;
