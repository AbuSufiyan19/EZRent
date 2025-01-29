const fs = require("fs");
const path = require("path");
const User = require('../models/userModel');
const ContactSupport = require("../models/contactsupportModel");

// Fetch all customers
const fetchAllCustomers = async (req, res) => {
    try {
      const Customers = await User.find({ userType: "customer" }); 
      res.status(200).json(Customers);
    } catch (error) {
      console.error("Error fetching customers:", error);
      res.status(500).json({ message: "Failed to fetch customers", error: error.message });
    }
  };

  const removeCustomer = async (req, res) => {
    const { id } = req.params;
  
    try {
      const Customer = await User.findById(id);
  
      if (!Customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
  
    //   // Delete associated image file
    //   const imagePath = path.join(__dirname, "../multer/equipmentuploads", Customer.image);
    //   if (fs.existsSync(imagePath)) {
    //     fs.unlinkSync(imagePath);
    //   }
  
      await Customer.deleteOne({ _id: id });
      res.status(200).json({ message: "Customer removed successfully" });
    } catch (error) {
      console.error("Error removing Customer:", error);
      res.status(500).json({ message: "Failed to remove Customer", error: error.message });
    }
  };


// Fetch all providers
const fetchAllProviders = async (req, res) => {
    try {
      const Providers = await User.find({ userType: "provider" });
      res.status(200).json(Providers);
    } catch (error) {
      console.error("Error fetching providers:", error);
      res.status(500).json({ message: "Failed to fetch providers", error: error.message });
    }
  };

  const removeProvider = async (req, res) => {
    const { id } = req.params;
  
    try {
      const Provider = await User.findById(id);
  
      if (!Provider) {
        return res.status(404).json({ message: "Provider not found" });
      }
  
    //   // Delete associated image file
    //   const imagePath = path.join(__dirname, "../multer/equipmentuploads", Provider.image);
    //   if (fs.existsSync(imagePath)) {
    //     fs.unlinkSync(imagePath);
    //   }
  
      await Provider.deleteOne({ _id: id });
      res.status(200).json({ message: "Provider removed successfully" });
    } catch (error) {
      console.error("Error removing Provider:", error);
      res.status(500).json({ message: "Failed to remove Provider", error: error.message });
    }
  };

  const storeContactsupport = async (req, res) => {
    try {
      const { name, email, mobile, message } = req.body;
  
      if (!name || !email || !mobile || !message) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      const newContact = new ContactSupport({ name, email, mobile, message });
      await newContact.save();
  
      res.status(201).json({ message: "Your message submitted successfully!" });
    } catch (error) {
      res.status(500).json({ message: "Failed to submit your message" });
    }
  };

  const fetchAllContactsupport = async (req, res) => {
    try {
      const Contact = await ContactSupport.find({});
      res.status(200).json(Contact);
    } catch (error) {
      console.error("Error fetching ContactMsg:", error);
      res.status(500).json({ message: "Failed to fetch ContactMsg", error: error.message });
    }
  };
module.exports = { fetchAllCustomers, fetchAllProviders, removeCustomer, removeProvider, storeContactsupport, fetchAllContactsupport };
