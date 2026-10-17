const express = require('express');
const router = express.Router();
const {
  register,
  validateStepOne,
  login,
  logout,
  getCurrentUser,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimiter');

// Rate-limited auth routes
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);

// Validation helper (non rate-limited to avoid UX blocks during normal typing/wizards)
router.post('/validate-step-one', validateStepOne);

// Logout
router.post('/logout', logout);

// Authenticated current user profile
router.get('/me', protect, getCurrentUser);

module.exports = router;
