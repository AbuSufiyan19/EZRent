const express = require('express');
const router = express.Router();
const { registerUser, verifyEmail, login, validateToken, forgotPassword, resetPassword } = require('../controllers/authController');

// Route to register a new user
router.post('/register', registerUser);

// Route to verify the user's email
router.get('/verify-email', verifyEmail);

router.post('/login',login);
router.get("/validate-token", validateToken);

router.post("/forgot-password", forgotPassword);
  
// Route to reset password
router.post("/reset-password/:token", resetPassword);

module.exports = router;
