const express = require("express");
const router = express.Router();
const Booking = require("../models/bookingModel"); // Your Booking model
const Equipment = require("../models/equipmentModel"); // Equipment model
const User = require("../models/userModel"); // User model (contains UPI ID)

// Generate UPI Payment Link
router.post("/generate-upi-link", async (req, res) => {
    try {
        const { renterId, amount, equipmentId } = req.body;

        // Fetch renter details
        const renter = await User.findById(renterId);
        if (!renter || !renter.upiId) {
            return res.status(400).json({ message: "Renter's UPI ID not found" });
        }

        // Generate unique transaction ID
        const transactionId = `TXN${Date.now()}`;
        const upiLink = `upi://pay?pa=${renter.upiId}&pn=${renter.fullName}&tr=${transactionId}&tn=Equipment Rental&am=${amount}&cu=INR`;

        // // Save transaction (optional)
        // const booking = new Booking({
        //     equipmentId,
        //     vendorId,
        //     renterUpiId: renter.upiId,
        //     amount,
        //     transactionId,
        //     paymentStatus: "Pending"
        // });
        // await booking.save();

        res.json({ upiLink, transactionId });
    } catch (error) {
        console.error("UPI Payment Error:", error);
        res.status(500).json({ message: "Error generating UPI link", error });
    }
});

const QRCode = require('qrcode');

router.post("/generate-upi-qr", async (req, res) => {
    try {
        const { upiLink } = req.body;
        const qrCodeUrl = await QRCode.toDataURL(upiLink);
        res.json({ qrCodeUrl });
    } catch (error) {
        res.status(500).json({ message: "Error generating QR Code", error });
    }
});

module.exports = router;
