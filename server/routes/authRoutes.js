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

// Limit validation requests too, since each request checks the database.
router.post('/validate-step-one', authLimiter, validateStepOne);

// Logout
router.post('/logout', logout);
router.get('/logout', logout);

// Authenticated current user profile
router.get('/me', protect, getCurrentUser);

module.exports = router;
