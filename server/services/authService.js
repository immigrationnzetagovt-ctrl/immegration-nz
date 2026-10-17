const jwt = require('jsonwebtoken');

const COOKIE_NAME = 'visapath_token';

// Generate signed JWT token
const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || 'visapath_super_secret_jwt_key_2026_educational';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign({ id: userId }, secret, { expiresIn });
};

// Configure and send HTTP-only authentication cookie
const sendAuthCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === 'production';
  // Allow explicit override if running production-like SSL or plain HTTP
  const secure = process.env.COOKIE_SECURE === 'true' || (isProduction && process.env.COOKIE_SECURE !== 'false');

  const cookieOptions = {
    httpOnly: true,
    secure: secure,
    sameSite: 'lax', // Lax works well with local Vite dev proxy and direct calls
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    path: '/',
  };

  res.cookie(COOKIE_NAME, token, cookieOptions);
};

// Clear authentication cookie on logout
const clearAuthCookie = (res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const secure = process.env.COOKIE_SECURE === 'true' || (isProduction && process.env.COOKIE_SECURE !== 'false');

  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: secure,
    sameSite: 'lax',
    path: '/',
  });
};

module.exports = {
  COOKIE_NAME,
  generateToken,
  sendAuthCookie,
  clearAuthCookie,
};
