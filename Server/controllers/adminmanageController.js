const fs = require("fs");
const path = require("path");
const User = require('../models/userModel');
const Equipment = require('../models/equipmentModel');
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
       // Find all equipment where renterid matches the provider ID
       const equipments = await Equipment.find({ renterid: id });

       if (equipments.length > 0) {
           // Update all matched equipment to set availabilityStatus to 'Blocked'
           await Equipment.updateMany({ renterid: id }, { $set: { availabilityStatus: "Blocked" } });
           console.log(`Updated ${equipments.length} equipment items to "Blocked"`);
       }

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

// Approve Provider
const approveProvider = async (req, res) => {
  try {
    const { id } = req.params;

    // Find provider by ID
    const provider = await User.findById(id);
    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    // Update status to "approved"
    provider.status = "approved";
    await provider.save();

    res.status(200).json({ message: "Provider approved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error approving provider", error: error.message });
  }
};

// Reject Provider
const rejectProvider = async (req, res) => {
  try {
    const { id } = req.params;

    // Find provider by ID
    const provider = await User.findById(id);
    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    // Update status to "rejected"
    provider.status = "rejected";
    await provider.save();

    res.status(200).json({ message: "Provider rejected successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error rejecting provider", error: error.message });
  }
};

const reuploadProvider = async (req, res) => {
  try {
    const { id } = req.params;

    // Find provider by ID
    const provider = await User.findById(id);
    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    // Update status to "pending"
    provider.status = "reupload";
    await provider.save();

    res.status(200).json({ message: "Provider reuploaded successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error reuploading provider", error: error.message });
  }
}

const blockProvider = async (req, res) => {
  try {
    const { id } = req.params;

    // Find provider by ID
    const provider = await User.findById(id);
    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    // Update status to "blocked"
    provider.status = "blocked";
    await provider.save();

    res.status(200).json({ message: "Provider blocked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error blocking provider", error: error.message });
  }
}
module.exports = { fetchAllCustomers, fetchAllProviders, removeCustomer, removeProvider, storeContactsupport, fetchAllContactsupport, approveProvider, rejectProvider, reuploadProvider, blockProvider };
