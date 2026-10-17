const User = require('../models/User');
const { validateRegistration, validateLogin } = require('../validators/authValidator');
const { generateToken, sendAuthCookie, clearAuthCookie } = require('../services/authService');

// @desc    Register a new user (Step 1)
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { isValid, errors, sanitized } = validateRegistration(req.body);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }

    const { displayName, email, password } = sanitized;

    // Check for duplicate email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists. Please log in instead.',
        errors: { email: 'Email is already registered' },
      });
    }

    // Create user (password is automatically hashed via pre-save hook)
    const user = new User({
      displayName,
      email,
      password,
    });
    await user.save();

    // Generate JWT and set HTTP-only cookie
    const token = generateToken(user._id);
    sendAuthCookie(res, token);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: user._id,
        displayName: user.displayName,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Validate Step 1 without immediately saving to DB (optional helper for wizards)
// @route   POST /api/auth/validate-step-one
// @access  Public
const validateStepOne = async (req, res, next) => {
  try {
    const { isValid, errors, sanitized } = validateRegistration(req.body);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }

    const existingUser = await User.findOne({ email: sanitized.email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.',
        errors: { email: 'Email is already registered' },
      });
    }

    res.status(200).json({
      success: true,
      message: 'Step 1 validation successful',
      data: {
        displayName: sanitized.displayName,
        email: sanitized.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Log in an existing user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { isValid, errors, sanitized } = validateLogin(req.body);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
        errors,
      });
    }

    const { email, password } = sanitized;

    // Explicitly select password field to compare
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password combination.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password combination.',
      });
    }

    // Generate JWT and set HTTP-only cookie
    const token = generateToken(user._id);
    sendAuthCookie(res, token);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      user: {
        id: user._id,
        displayName: user.displayName,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Log out the current user
// @route   POST /api/auth/logout
// @access  Public / Protected
const logout = async (req, res, next) => {
  try {
    clearAuthCookie(res);
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get currently logged in user profile
// @route   GET /api/auth/me
// @access  Protected
const getCurrentUser = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        displayName: req.user.displayName,
        email: req.user.email,
        createdAt: req.user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  validateStepOne,
  login,
  logout,
  getCurrentUser,
};
