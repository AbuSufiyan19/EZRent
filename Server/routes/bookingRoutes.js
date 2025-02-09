const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken"); // Missing import
const Booking = require("../models/bookingModel");
const Equipment = require("../models/equipmentModel");
const User = require("../models/userModel");
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
    // Update equipment availability
    const updatedEquipment = await Equipment.findByIdAndUpdate(
      equipmentId, // Ensure this is the correct ID
      { availabilityStatus: "rented" }, // Set status as rented
      { new: true } // Return updated document
  );

  if (!updatedEquipment) {
      return res.status(404).json({ message: "Equipment not found" });
  }
    res.status(201).json({ message: "Booking successful!", booking: newBooking, equipment: updatedEquipment });

  } catch (error) {
    console.error("Error booking equipment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Send booking confirmation email
const nodemailer = require("nodemailer");

router.post("/send-booking-email", async (req, res) => {
    try {
        const { bookingId } = req.body;

        // Fetch booking details
        const booking = await Booking.findById(bookingId).populate("equipmentId renterId");

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        const { equipmentId, renterId, userId, fromDateTime, toDateTime, totalHours, totalPrice } = booking;
        const equipment = await Equipment.findById(equipmentId);
        const renter = await User.findById(renterId);
        const user = await User.findById(userId);

        if (!equipment || !renter || !user) {
            return res.status(404).json({ message: "Equipment, renter, or user not found" });
        }

        // Set up email transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Email content
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: [user.email, renter.email], // Send to both user & renter
            subject: "Booking Confirmation - Equipment Rental",
            html: `
                <h2>Booking Confirmation</h2>
                <p>Dear ${user.fullName},</p>
                <p>You have successfully booked the equipment: <strong>${equipment.name}</strong>.</p>
                <p><strong>Booking Details:</strong></p>
                <ul>
                    <li><b>Equipment Name:</b> ${equipment.name}</li>
                    <li><b>Renter Name:</b> ${renter.fullName}</li>
                    <li><b>Renter Mobile Number:</b> ${renter.mobileNumber}</li>
                    <li><b>From:</b> ${new Date(fromDateTime).toLocaleString()}</li>
                    <li><b>To:</b> ${new Date(toDateTime).toLocaleString()}</li>
                    <li><b>Total Hours:</b> ${totalHours} hours</li>
                    <li><b>Total Price:</b> ₹${totalPrice}</li>
                </ul>
                <p><strong>${equipment.name}</strong></p>
                  <img src="${encodeURI(process.env.BACKEND_URL + '/multer/equipmentuploads/' + equipment.image)}"
                      alt="${equipment.name}"
                      style="width: 200px; height: auto; border-radius: 10px; box-shadow: 2px 2px 10px rgba(0,0,0,0.1);"/>

                <p>Thank you for using our service!</p>
            `
        };

        // Send email
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "Booking confirmation email sent successfully!" });

    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ message: "Error sending email", error: error.message });
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
        // Find the booking to get the equipmentId
        const booking = await Booking.findByIdAndUpdate(
            id,
            { status: 'Cancelled' }, // Change status to 'Cancelled'
            { new: true } // Return the updated document
        );

        if (!booking) {
            return res.status(404).json({ message: "Booking not found." });
        }

        // Extract equipmentId from the booking
        const { equipmentId } = booking;

        // Update equipment availability
        const updatedEquipment = await Equipment.findByIdAndUpdate(
            equipmentId, // Use equipmentId to update the correct equipment
            { availabilityStatus: "available" }, // Set status to 'available'
            { new: true }
        );

        if (!updatedEquipment) {
            return res.status(404).json({ message: "Equipment not found." });
        }

        res.status(200).json({ 
            message: "Booking cancelled successfully. Equipment is now available.", 
            booking, 
            equipment: updatedEquipment 
        });

    } catch (error) {
        console.error("Error rejecting booking:", error);
        res.status(500).json({ message: "Failed to reject booking.", error: error.message });
    }
});
router.put("/update-status/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
      // Find the booking
      const booking = await Booking.findById(id);
      if (!booking) {
          return res.status(404).json({ message: "Booking not found" });
      }

      // Update booking status
      booking.status = status;
      await booking.save();

      let updatedEquipment = null;

      // If booking is cancelled or completed, update equipment availability
      if (status === "Cancelled" || status === "Completed") {
          updatedEquipment = await Equipment.findByIdAndUpdate(
              booking.equipmentId,
              { availabilityStatus: "available" },
              { new: true }
          );

          if (!updatedEquipment) {
              return res.status(404).json({ message: "Equipment not found" });
          }
      }

      res.status(200).json({ 
          message: `Booking marked as ${status}`, 
          booking, 
          equipment: updatedEquipment 
      });
  } catch (error) {
      console.error("Error updating booking status:", error);
      res.status(500).json({ message: "Error updating booking status", error: error.message });
  }
});

module.exports = router;
