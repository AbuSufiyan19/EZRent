const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/userModel');
require('dotenv').config(); 
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

// Replace with your own secret key (store it in .env for security)
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate a verification token
function generateVerificationToken() {
  return crypto.randomBytes(20).toString('hex');
}

// Send verification email
async function sendVerificationEmail(userEmail, token) {
  const verificationLink = `${process.env.BACKEND_URL}/auth/verify-email?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: 'Email Verification - EZRent',
    text: `Please verify your email by clicking the following link: ${verificationLink}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

// Register user
async function registerUser(req, res) {
  const { email, password, fullName, mobileNumber, userType } = req.body;

  console.log("Registering user");

  // Step 1: Check if the email already exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    // Step 2: Check if the user is verified
    if (existingUser.isVerified) {
      return res.status(400).send('This email is already associated with an account that is verified.');
    }

    // Step 3: If the user exists but is not verified, update the user's details
    const token = generateVerificationToken();
    const verificationExpiry = Date.now() + 24 * 60 * 60 * 1000; // 1 day expiration

    const hashedPassword = await bcrypt.hash(password, 10);

    existingUser.password = hashedPassword;
    existingUser.verificationToken = token;
    existingUser.verificationTokenExpires = verificationExpiry;
    existingUser.fullName = fullName; // Update full name
    existingUser.mobileNumber = mobileNumber; // Update mobile number
    existingUser.userType = userType; // Update user type

    await existingUser.save(); // Save the updated user

    // Send verification email again
    await sendVerificationEmail(email, token);

    return res.status(200).send('Your account exists but is not verified. A new verification email has been sent.');
  }

  // Step 4: If the email does not exist, create a new user
  const token = generateVerificationToken();
  const verificationExpiry = Date.now() + 24 * 60 * 60 * 1000; // 1 day expiration

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    email,
    password: hashedPassword,
    fullName, 
    mobileNumber, 
    userType,
    verificationToken: token,
    verificationTokenExpires: verificationExpiry,
    isVerified: false, // Set the account as not verified
    status: "registered",
  });

  await newUser.save();
  await sendVerificationEmail(email, token); // Send the verification email

  res.status(200).send('Registration successful! Please check your email to verify.');
}

// Verify email
async function verifyEmail(req, res) {
  const { token } = req.query;

  const user = await User.findOne({
    verificationToken: token,
    verificationTokenExpires: { $gt: Date.now() }, // Ensure the token is not expired
  });

  if (!user) {
    return res.redirect(`${process.env.FRONTEND_URL}/email-verification-failure`);
  }

  user.isVerified = true;
  user.verificationToken = "verified";
  user.verificationTokenExpires = null;
  await user.save();


  return res.redirect(`${process.env.FRONTEND_URL}/email-verification-success`);
}



async function login(req, res) {
  const { email, password } = req.body;

  try {
    // Validate email and password
    if (!email || !password) {
      return res.status(400).json({ message: "Email and Password are required" });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    
    // Check if the user's email is verified (optional)
    if (!user.isVerified) {
      return res.status(403).json({ message: "Please verify your email before logging in" });
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }


    // Generate a JWT token
    const token = jwt.sign(
      {
        id: user._id,
        username: user.fullName,
        email: user.email,
        userType: user.userType,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Send the response
    res.status(200).json({
      message: "Login successful",
      token,
      userType: user.userType,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Something went wrong. Please try again later." });
  }
};


const validateToken = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the user exists in the database
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Invalid token or user not found" });
    }

    return res.status(200).json({ message: "Token is valid", userType: user.userType, userId: user._id });
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

const renterStatus = async (req, res) => {
  try {
    const provider = await User.findById(req.params.userId);
    if (!provider) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ status: provider.status });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

const fs = require("fs");
const path = require("path");

const uploadIdProof = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Get the token from Authorization header

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Token missing" });
  }

  try {
    // Verify the token and extract the user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id; // The user ID from the decoded token

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const newFilePath = req.file.filename; // New uploaded file name

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user already has an ID proof uploaded
    if (user.idProof) {
      const oldFilePath = path.join(__dirname, "../multer/idproofuploads", user.idProof);
      // Remove the old file if it exists
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    // Update user with the new file path and set status to 'uploaded'
    user.idProof = newFilePath;
    user.status = "uploaded";

    await user.save(); // Save the changes to the database

    return res.status(200).json({ message: "ID Proof uploaded successfully!" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


const forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(400).json({ message: "Invalid Email" });
      }
  
      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetTokenExpiry = Date.now() + 3600000; // Token valid for 1 hour
  
      // Save token & expiry to user
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = resetTokenExpiry;
      await user.save();
  
      // Send reset link via email
      const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Password Reset Request - EZRent",
        text: `You requested a password reset. Click the link below to reset your password:\n\n${resetLink}\n\nIf you did not request this, please ignore this email.`,
      };
  
      await transporter.sendMail(mailOptions);
  
      res.json({ message: "Password reset link has been sent to your email." });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error." });
    }
  };

  const resetPassword = async (req, res) => {
      try {
        const { token } = req.params;
        const { newPassword } = req.body;
        
        const user = await User.findOne({ 
          resetPasswordToken: token,
          resetPasswordExpires: { $gt: Date.now() }, // Check if token is still valid
        });
    
        if (!user) {
          return res.status(400).json({ message: "Invalid or expired token." });
        }
    
        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        
        // Clear the reset token fields
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        
        await user.save();
        
        res.json({ message: "Password has been reset successfully." });
    
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
      }
    };
    
  
module.exports = { registerUser, verifyEmail, login, validateToken, renterStatus, uploadIdProof, forgotPassword, resetPassword};
