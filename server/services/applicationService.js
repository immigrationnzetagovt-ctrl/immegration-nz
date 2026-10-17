const crypto = require('crypto');
const Application = require('../models/Application');

// Generate unique, server-controlled application reference
const generateApplicationRef = async () => {
  let isUnique = false;
  let applicationRef = '';

  while (!isUnique) {
    const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase(); // 6 hex chars
    applicationRef = `VP-2026-${randomHex}`;
    const existing = await Application.findOne({ applicationRef });
    if (!existing) {
      isUnique = true;
    }
  }

  return applicationRef;
};

// Create a new demo application
const createApplication = async (userId, data) => {
  const applicationRef = await generateApplicationRef();

  // Enforce server-side security: ignore any user-supplied status or applicationRef
  const application = new Application({
    user: userId,
    applicationRef,
    displayName: data.displayName,
    nationality: data.nationality || 'New Zealand',
    dateOfBirth: data.dateOfBirth,
    gender: data.gender || 'Male',
    passportNumber: data.passportNumber,
    visaType: data.visaType || 'Visitor',
    travelStartDate: data.travelStartDate,
    travelEndDate: data.travelEndDate,
    entryType: data.entryType || 'Multiple entry',
    conditions: data.conditions || 'Educational simulation only. No official status granted. Valid for demo demonstration purposes.',
    status: 'Pending', // Strictly enforce initial status as Pending
    disclaimer: 'DEMO — NOT AN OFFICIAL IMMIGRATION DOCUMENT',
  });

  await application.save();
  return application;
};

// Get the latest application for the given user
const getLatestApplicationByUserId = async (userId) => {
  return Application.findOne({ user: userId }).sort({ createdAt: -1 });
};

// Get specific application by ID and verify ownership
const getApplicationByIdAndVerifyOwner = async (appId, userId) => {
  const application = await Application.findById(appId);
  if (!application) {
    return { application: null, isOwner: false };
  }

  const isOwner = application.user.toString() === userId.toString();
  return { application, isOwner };
};

module.exports = {
  generateApplicationRef,
  createApplication,
  getLatestApplicationByUserId,
  getApplicationByIdAndVerifyOwner,
};
