const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer storage using Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "idproofuploads", // Cloudinary folder name (same as your local one)
    format: async (req, file) => "png", // Convert all uploads to PNG
    public_id: (req, file) => `${Date.now()}-${file.originalname.split(".")[0]}`, // Custom file name (removing the comma)
  },
});

// Multer upload configuration
const uploadid = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit to 5 MB
}).single("idProof"); // Ensure this matches the field name in your form


module.exports = { uploadid };
