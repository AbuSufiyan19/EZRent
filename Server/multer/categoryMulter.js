const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Directory to store uploaded images
const UPLOAD_DIR = path.join(__dirname, "categoryuploads");

// Ensure the upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: UPLOAD_DIR, // Set upload directory
  filename: (req, file, cb) => {
    // Use the original file name directly
    cb(null, file.originalname);
  },
});

// File filter to allow only image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error("Only image files are allowed!"), false); // Reject non-image files
  }
};

// Multer upload configuration
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5 MB
});

module.exports = { upload };
