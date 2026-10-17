const validator = require('validator');

// Sanitize string to prevent injection
const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str.trim();
};

const validateRegistration = (data) => {
  const errors = {};
  const displayName = sanitizeString(data.displayName);
  const email = sanitizeString(data.email);
  const password = typeof data.password === 'string' ? data.password : '';
  const confirmPassword = typeof data.confirmPassword === 'string' ? data.confirmPassword : '';

  if (!displayName || displayName.length < 2) {
    errors.displayName = 'Family name / display name must be at least 2 characters';
  }

  if (!email || !validator.isEmail(email)) {
    errors.email = 'Please provide a valid email address';
  }

  if (!password || password.length < 8) {
    errors.password = 'Password must be at least 8 characters long';
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    errors.password = 'Password must include uppercase, lowercase, and a number';
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitized: {
      displayName,
      email: email.toLowerCase(),
      password,
    },
  };
};

const validateLogin = (data) => {
  const errors = {};
  const email = sanitizeString(data.email);
  const password = typeof data.password === 'string' ? data.password : '';

  if (!email || !validator.isEmail(email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!password) {
    errors.password = 'Password is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitized: {
      email: email.toLowerCase(),
      password,
    },
  };
};

module.exports = {
  validateRegistration,
  validateLogin,
  sanitizeString,
};
