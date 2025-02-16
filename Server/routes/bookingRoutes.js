const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken"); // Missing import
const Booking = require("../models/bookingModel");
const Equipment = require("../models/equipmentModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");

const fs = require("fs");
const path = require("path");
const csvParser = require("csv-parser")
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

// Define the CSV file path (ensure this file exists)
const csvFilePath = path.join(__dirname, "../Recommendation/recommendation_dataset.csv");

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
      status: { $ne: "Cancelled" }, // Exclude cancelled bookings
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
      notifiedSMS: false,
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

router.post('/check-extra-availability', async (req, res) => {
  try {
      const { bookingId, extraHours } = req.body;
      console.log(bookingId, extraHours);

      if (!bookingId || !extraHours) {  
          return res.status(400).json({ message: 'Booking ID and extra time are required.' });
      }

      if (extraHours < 1 || extraHours > 3) {
          return res.status(400).json({ message: 'Extra time must be between 1 and 3 hours.' });
      }

      const booking = await Booking.findById(bookingId);
      if (!booking) {
          return res.status(404).json({ message: 'Booking not found.' });
      }

      const newEndTime = new Date(booking.toDateTime);
      newEndTime.setHours(newEndTime.getHours() + extraHours);
      const isBooked = await Booking.findOne({
          equipId: booking.equipId,
          fromDateTime: { $lt: newEndTime },
          toDateTime: { $gt: booking.toDateTime }
      });

      if (isBooked) {
          return res.status(400).json({ message: 'Requested extra time is not available.' });
      }

      res.json({ available: true, message: 'Extra time is available.' });

  } catch (error) {
      console.error('Error checking availability:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/extend-booking', async (req, res) => {
  try {
      const { bookingId, extraHours } = req.body;

      if (!bookingId || !extraHours) {
          return res.status(400).json({ message: 'Booking ID and extra time are required.' });
      }

      const booking = await Booking.findById(bookingId);
      if (!booking) {
          return res.status(404).json({ message: 'Booking not found.' });
      }

      const newEndTime = new Date(booking.toDateTime);
      newEndTime.setHours(newEndTime.getHours() + extraHours);

      // Check again before updating
      const isBooked = await Booking.findOne({
          equipId: booking.equipId,
          fromDateTime: { $lt: newEndTime },
          toDateTime: { $gt: booking.toDateTime }
      });

      if (isBooked) {
          return res.status(400).json({ message: 'Extra time is no longer available.' });
      }

      booking.toDateTime = newEndTime;
      booking.extraTimehours =  extraHours;
      booking.extraPrice = extraHours * (booking.totalPrice / booking.totalHours); 

      await booking.save();
      res.json({ message: 'Booking extended successfully.', updatedBooking: booking });

  } catch (error) {
      console.error('Error extending booking:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});

const cron = require("node-cron");const twilio = require('twilio');
const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);


// Run this job every minute to check for expired bookings
cron.schedule("* * * * *", async () => {
  try {
    console.log("Checking for expired bookings to send SMS...");

    const now = new Date();
    const expiredBookings = await Booking.find({
      toDateTime: { $lt: now }, // Booking end time has passed
      status: "Confirmed", // Only confirmed bookings
      notifiedSMS: { $ne: true } // Ensure user hasn't been notified yet
    });

    console.log(`Found ${expiredBookings.length} expired bookings`);

    for (const booking of expiredBookings) {
      // console.log("Processing booking:", booking);

      const user = await User.findById(new mongoose.Types.ObjectId(booking.userId));
      // console.log("Fetched user:", user);

      const equipment = await Equipment.findById(new mongoose.Types.ObjectId(booking.equipmentId));
      // console.log("Fetched equipment:", equipment);

      if (user && user.mobileNumber) {
        // console.log(`User ${user.fullName} has a valid mobile number: ${user.mobileNumber}`);

        // Commented out SMS sending process
        
        // await client.messages.create({
        //   body: `Hello ${user.fullName}, your booking for equipment ${booking.equipId} (${equipment.name}) has ended. Please return the equipment. Thank you!`,
        //   from: process.env.TWILIO_PHONE,
        //   to: `+91${user.mobileNumber}` // Assuming India numbers
        // });

        // console.log(`SMS sent to ${user.mobileNumber}`);
        

        // Mark the booking as notified
        booking.notifiedSMS = true;
        booking.status = "Completed";
        await booking.save();

        let updatedEquipment = null;
        updatedEquipment = await Equipment.findByIdAndUpdate(
          booking.equipmentId,
          { availabilityStatus: "available" },
          { new: true }
        );
        
        console.log(`Booking marked as notified: ${booking._id}`);
      } else {
        console.log(`User ${user ? user.fullName : "Unknown"} has no valid mobile number`);
      }
    }
  } catch (error) {
    console.error("Error checking expired bookings:", error);
  }
});


router.post("/submit-review", async (req, res) => {
  try {
    const { bookingId, equipId, rating, review } = req.body;

    // Find booking and update with review
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Ensure the booking is completed before allowing a review
    if (booking.status !== "Completed") {
      return res.status(400).json({ message: "Only completed bookings can be reviewed" });
    }

    // Update booking with rating & review
    booking.ratings = rating;
    booking.reviews = review;
    await booking.save();

      updateCsvRating(bookingId, rating);


    // Update Equipment Average Rating
    const equipment = await Equipment.findById(equipId);
    if (!equipment) return res.status(404).json({ message: "Equipment not found" });

    const eqrating = equipment.averageRating || 0; // Default to 0 if null/undefined
    equipment.averageRating = (rating + eqrating) / (eqrating ? 2 : 1); // Avoid division by 2 if first rating
    await equipment.save();

    res.json({ message: "Review submitted successfully!" });
  } catch (error) {
    console.error("Error submitting review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}); 

const updateCsvRating = (bookingId, newRating) => {
  const tempFilePath = path.join(__dirname, "../Recommendation/temp_bookings.csv");

  // Read and update CSV
  const rows = [];
  fs.createReadStream(csvFilePath)
    .pipe(csvParser())
    .on("data", (row) => {
      if (row.bookingId === bookingId) {
        row.rating = newRating; // Update rating
      }
      rows.push(row);
    })
    .on("end", () => {
      // Write updated data to a temporary file
      const csvWriter = createCsvWriter({
        path: tempFilePath,
        header: [
          { id: "bookingId", title: "bookingId" },
          { id: "userId", title: "userId" },
          { id: "equipmentId", title: "equipmentId" },
          { id: "categoryId", title: "categoryId" },
          { id: "rating", title: "rating" }
        ]
      });

      csvWriter.writeRecords(rows).then(() => {
        // Replace original CSV with updated file
        fs.renameSync(tempFilePath, csvFilePath);
        // console.log(`✅ CSV updated for booking ID: ${bookingId}`);
      });
    });
};



router.get("/equipment/:equipmentId", async (req, res) => {
    try {
        const { equipmentId } = req.params;
        const bookings = await Booking.find({
          equipmentId: new mongoose.Types.ObjectId(equipmentId),
          status: { $ne: "Cancelled" }  // Exclude cancelled bookings
      });
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



// CSV Writer Setup
const csvWriter = createCsvWriter({
  path: csvFilePath,
  header: [
    { id: "bookingId", title: "bookingId" },
    { id: "userId", title: "userId" },
    { id: "equipmentId", title: "equipmentId" },
    { id: "categoryId", title: "categoryId" },
    { id: "rating", title: "rating" },
  ],
  append: true // Ensures new data is added without overwriting existing data
});

// API Endpoint to Save Data in CSV
router.post("/save-datacsv", async (req, res) => {
  try {
    const { bookingId, equipmentId } = req.body;

    if (!bookingId || !equipmentId) {
      return res.status(400).json({ message: "Both bookingId and equipmentId are required" });
    }

    // Fetch booking details
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Fetch equipment details
    const equipment = await Equipment.findById(equipmentId);
    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found" });
    }

    // Prepare data for CSV
    const csvData = [{
      bookingId: booking._id,
      userId: booking.userId,
      equipmentId: booking.equipmentId,
      categoryId: equipment.categoryId,
      rating: booking.ratings || 0, 
    }];

    // Append data to CSV
    await csvWriter.writeRecords(csvData);

    // console.log("✅ Data successfully saved to CSV:", csvData);

    res.status(200).json({ message: "Data successfully saved to CSV", data: csvData });

  } catch (error) {
    console.error("❌ Error saving to CSV:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


module.exports = router;
