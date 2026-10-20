const Application = require('../models/Application');
const User = require('../models/User');
const { validateApplication } = require('../validators/applicationValidator');
const { validateRegistration } = require('../validators/authValidator');
const {
  createApplication,
  getLatestApplicationByUserId,
  getApplicationByIdAndVerifyOwner,
} = require('../services/applicationService');
const { generateToken, sendAuthCookie } = require('../services/authService');
const { generateApplicationPdf } = require('../services/pdfService');

// @desc    Create a new application for the authenticated user
// @route   POST /api/applications
// @access  Protected (or combined with registration if unauthenticated)
const create = async (req, res, next) => {
  try {
    const body = req.body && typeof req.body === 'object' && !Array.isArray(req.body)
      ? req.body
      : {};
    let currentUser = req.user;

    // If request includes user credentials and user is not authenticated yet, create account first
    if (!currentUser && body.account) {
      const { isValid: isUserValid, errors: userErrors, sanitized: sanitizedUser } = validateRegistration(body.account);
      if (!isUserValid) {
        return res.status(400).json({
          success: false,
          message: 'Account validation failed',
          errors: userErrors,
        });
      }

      const existing = await User.findOne({ email: sanitizedUser.email });
      if (existing) {
        return res.status(409).json({
          success: false,
          message: 'An account with this email address already exists. Please log in first.',
          errors: { email: 'Email already registered' },
        });
      }

      currentUser = new User({
        displayName: sanitizedUser.displayName,
        email: sanitizedUser.email,
        password: sanitizedUser.password,
      });
      await currentUser.save();

      // Issue cookie
      const token = generateToken(currentUser._id);
      sendAuthCookie(res, token);
    }

    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required to submit an application.',
      });
    }

    // Validate application data
    const { isValid, errors, sanitized } = validateApplication({
      ...body,
      displayName: body.displayName || currentUser.displayName,
    });

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Application form validation failed',
        errors,
      });
    }

    // Create application strictly through service (forces Pending status and server applicationRef)
    const application = await createApplication(currentUser._id, sanitized);

    res.status(201).json({
      success: true,
      message: 'Demo application submitted successfully',
      application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get the authenticated user's current application
// @route   GET /api/applications/my-application
// @access  Protected
const getMyApplication = async (req, res, next) => {
  try {
    const application = await getLatestApplicationByUserId(req.user._id);

    res.status(200).json({
      success: true,
      application: application || null,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get application details by ID with strict ownership authorization
// @route   GET /api/applications/:id
// @access  Protected
const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { application, isOwner } = await getApplicationByIdAndVerifyOwner(id, req.user._id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to access another user’s application.',
      });
    }

    res.status(200).json({
      success: true,
      application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Download demo application PDF
// @route   GET /api/applications/:id/pdf
// @access  Protected
const downloadPdf = async (req, res, next) => {
  try {
    const { id } = req.params;
    let application = null;

    if (id === 'latest' || id === 'current') {
      application = await getLatestApplicationByUserId(req.user._id);
    } else {
      const result = await getApplicationByIdAndVerifyOwner(id, req.user._id);
      if (!result.application) {
        return res.status(404).json({
          success: false,
          message: 'Application not found',
        });
      }
      if (!result.isOwner) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: You are not authorized to download this application PDF.',
        });
      }
      application = result.application;
    }

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'No application record found to generate PDF',
      });
    }

    const filename = `INZ_eVisa_${application.applicationRef}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

    generateApplicationPdf(application, res);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  getMyApplication,
  getById,
  downloadPdf,
};
