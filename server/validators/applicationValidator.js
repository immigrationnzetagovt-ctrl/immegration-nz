const validator = require('validator');
const { sanitizeString } = require('./authValidator');

// Escape HTML special characters to prevent XSS
const escapeHtml = (unsafe) => {
  if (typeof unsafe !== 'string') return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

const validateApplication = (data) => {
  const errors = {};

  const displayName = sanitizeString(data.displayName);
  const nationality = sanitizeString(data.nationality) || 'New Zealand';
  const gender = sanitizeString(data.gender) || 'Male';
  const passportNumber = sanitizeString(data.passportNumber);
  const visaType = sanitizeString(data.visaType) || 'Visitor';
  const entryType = sanitizeString(data.entryType) || 'Multiple entry';
  const conditions = sanitizeString(data.conditions) || 'Educational simulation only. No official status granted. Valid for demo demonstration purposes.';

  if (!displayName || displayName.length < 2) {
    errors.displayName = 'Applicant name must be at least 2 characters';
  }

  if (!nationality) {
    errors.nationality = 'Nationality is required';
  }

  // Date of Birth validation
  if (!data.dateOfBirth) {
    errors.dateOfBirth = 'Date of birth is required';
  } else {
    const dob = new Date(data.dateOfBirth);
    if (isNaN(dob.getTime())) {
      errors.dateOfBirth = 'Invalid date of birth';
    } else if (dob > new Date()) {
      errors.dateOfBirth = 'Date of birth cannot be in the future';
    }
  }

  // Gender validation
  const validGenders = ['Male', 'Female', 'Other', 'Undisclosed'];
  if (!validGenders.includes(gender)) {
    errors.gender = `Gender must be one of: ${validGenders.join(', ')}`;
  }

  // Passport number validation (fictional dummy passport)
  if (!passportNumber) {
    errors.passportNumber = 'Fictional passport number is required';
  } else if (!/^[A-Za-z0-9\- ]{5,25}$/.test(passportNumber)) {
    errors.passportNumber = 'Passport number must be 5-25 alphanumeric characters';
  }

  // Visa Type validation
  const validVisaTypes = ['Visitor', 'Student', 'Work', 'Transit', 'Business'];
  if (!validVisaTypes.includes(visaType)) {
    errors.visaType = `Visa type must be one of: ${validVisaTypes.join(', ')}`;
  }

  // Travel Dates validation
  if (!data.travelStartDate) {
    errors.travelStartDate = 'Travel start date is required';
  }
  if (!data.travelEndDate) {
    errors.travelEndDate = 'Travel end date is required';
  }

  let startDate = null;
  let endDate = null;
  if (data.travelStartDate && data.travelEndDate) {
    startDate = new Date(data.travelStartDate);
    endDate = new Date(data.travelEndDate);

    if (isNaN(startDate.getTime())) {
      errors.travelStartDate = 'Invalid travel start date';
    }
    if (isNaN(endDate.getTime())) {
      errors.travelEndDate = 'Invalid travel end date';
    }
    if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
      if (endDate < startDate) {
        errors.travelEndDate = 'Travel end date must be on or after travel start date';
      }
    }
  }

  // Entry Type validation
  const validEntryTypes = ['Single entry', 'Multiple entry'];
  if (!validEntryTypes.includes(entryType)) {
    errors.entryType = `Entry type must be one of: ${validEntryTypes.join(', ')}`;
  }

  if (conditions.length > 500) {
    errors.conditions = 'Conditions text cannot exceed 500 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitized: {
      displayName: escapeHtml(displayName),
      nationality: escapeHtml(nationality),
      dateOfBirth: data.dateOfBirth,
      gender,
      passportNumber: passportNumber.toUpperCase(),
      visaType,
      travelStartDate: data.travelStartDate,
      travelEndDate: data.travelEndDate,
      entryType,
      conditions: escapeHtml(conditions),
    },
  };
};

module.exports = {
  validateApplication,
  escapeHtml,
};
