const express = require('express');
const router = express.Router();
const { registerUser, verifyEmail, login, validateToken } = require('../controllers/authController');

// Route to register a new user
router.post('/register', registerUser);

// Route to verify the user's email
router.get('/verify-email', verifyEmail);

router.post('/login',login);
router.get("/validate-token", validateToken);


module.exports = router;
