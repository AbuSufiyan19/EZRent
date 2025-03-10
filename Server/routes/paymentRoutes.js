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

const Razorpay = require("razorpay");
const crypto = require("crypto");
require("dotenv").config();


const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 📌 API to create an order
router.post("/create-order", async (req, res) => {
    try {
        const { amount, currency } = req.body;

        const options = {
            amount: amount * 100, // Convert to paise
            currency: currency || "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: "Error creating order", error });
    }
});

// 📌 API to verify payment signature
router.post("/verify-payment", (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const secret = process.env.RAZORPAY_KEY_SECRET;
        const hash = crypto.createHmac("sha256", secret)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        if (hash === razorpay_signature) {
            res.json({ message: "Payment verified successfully", status: "success" });
        } else {
            res.status(400).json({ message: "Invalid payment signature", status: "failure" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error verifying payment", error });
    }
});

module.exports = router;
