const jwt = require('jsonwebtoken');

const COOKIE_NAME = 'visapath_token';

// Generate signed JWT token
const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET must be configured in production.');
    }
    throw new Error('JWT_SECRET is not configured.');
  }
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign({ id: userId }, secret, { expiresIn });
};

// Configure and send HTTP-only authentication cookie
const sendAuthCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === 'production';
  // Allow explicit override if running production-like SSL or plain HTTP
  const secure = process.env.COOKIE_SECURE === 'true' || (isProduction && process.env.COOKIE_SECURE !== 'false');
  const sameSite = secure ? 'none' : 'lax';

  const cookieOptions = {
    httpOnly: true,
    secure: secure,
    sameSite: sameSite, // 'none' is required with secure: true for cross-domain cookies
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    path: '/',
  };

  res.cookie(COOKIE_NAME, token, cookieOptions);
};

// Clear authentication cookie on logout
const clearAuthCookie = (res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const secure = process.env.COOKIE_SECURE === 'true' || (isProduction && process.env.COOKIE_SECURE !== 'false');
  const sameSite = secure ? 'none' : 'lax';

  const options = {
    httpOnly: true,
    secure: secure,
    sameSite: sameSite,
    path: '/',
  };

  res.clearCookie(COOKIE_NAME, options);
  res.cookie(COOKIE_NAME, '', { ...options, expires: new Date(0), maxAge: 0 });
};

module.exports = {
  COOKIE_NAME,
  generateToken,
  sendAuthCookie,
  clearAuthCookie,
};
