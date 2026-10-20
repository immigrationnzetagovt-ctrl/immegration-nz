const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token = null;

  // 1. Check HTTP-only cookie first
  if (req.cookies && req.cookies.visapath_token) {
    token = req.cookies.visapath_token;
  }
  // 2. Fallback to Authorization header Bearer token (useful for automated testing or API clients)
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Please log in to continue.',
    });
  }

  let decoded;
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not configured.');
    }
    decoded = jwt.verify(token, secret);
  } catch (error) {
    console.error('[Auth Error] JWT verification failed:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Session has expired or is invalid. Please log in again.',
    });
  }

  try {
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The account associated with this session no longer exists.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

// Optional protect middleware: sets req.user if valid token present, otherwise continues
const optionalProtect = async (req, res, next) => {
  let token = null;

  if (req.cookies && req.cookies.visapath_token) {
    token = req.cookies.visapath_token;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next();
  }

  let decoded;
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not configured.');
    }
    decoded = jwt.verify(token, secret);
  } catch (error) {
    if (error.name !== 'JsonWebTokenError' && error.name !== 'TokenExpiredError' &&
      error.name !== 'NotBeforeError') {
      return next(error);
    }
    return next();
  }

  try {
    const user = await User.findById(decoded.id).select('-password');
    if (user) req.user = user;
  } catch (error) {
    return next(error);
  }
  next();
};

module.exports = { protect, optionalProtect };
