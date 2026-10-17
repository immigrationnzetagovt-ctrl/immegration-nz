const express = require('express');
const router = express.Router();
const {
  create,
  getMyApplication,
  getById,
  downloadPdf,
} = require('../controllers/applicationController');
const { protect, optionalProtect } = require('../middleware/authMiddleware');

// Application creation (authenticated or combined registration)
router.post('/', optionalProtect, create);

// Authenticated user's active application
router.get('/my-application', protect, getMyApplication);

// Application details by ID (with ownership check)
router.get('/:id', protect, getById);

// Application PDF download (with ownership check)
router.get('/:id/pdf', protect, downloadPdf);

module.exports = router;
