const rateLimit = require('express-rate-limit');

// Rate limiter for authentication endpoints (prevent brute force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 requests per windowMs
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  message: {
    success: false,
    message: 'Too many authentication attempts from this IP, please try again after 15 minutes.',
  },
  skip: (req) => process.env.NODE_ENV === 'test', // Skip in automated test runs
});

module.exports = { authLimiter };
