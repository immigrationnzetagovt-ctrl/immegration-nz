const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Application must be associated with an authenticated user'],
      index: true,
    },
    applicationRef: {
      type: String,
      required: [true, 'Application reference is required'],
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    displayName: {
      type: String,
      required: [true, 'Applicant name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    nationality: {
      type: String,
      required: [true, 'Nationality is required'],
      default: 'New Zealand',
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Date of birth is required'],
    },
    gender: {
      type: String,
      required: [true, 'Gender is required'],
      enum: {
        values: ['Male', 'Female', 'Other', 'Undisclosed'],
        message: '{VALUE} is not a valid gender option',
      },
      default: 'Male',
    },
    passportNumber: {
      type: String,
      required: [true, 'Fictional passport number is required'],
      trim: true,
      maxlength: [30, 'Passport number cannot exceed 30 characters'],
    },
    visaType: {
      type: String,
      required: [true, 'Visa type is required'],
      enum: {
        values: ['Visitor', 'Student', 'Work', 'Transit', 'Business'],
        message: '{VALUE} is not a supported visa type',
      },
      default: 'Visitor',
    },
    travelStartDate: {
      type: Date,
      required: [true, 'Travel start date is required'],
    },
    travelEndDate: {
      type: Date,
      required: [true, 'Travel end date is required'],
    },
    entryType: {
      type: String,
      required: [true, 'Entry type is required'],
      enum: {
        values: ['Single entry', 'Multiple entry'],
        message: '{VALUE} is not a valid entry type',
      },
      default: 'Multiple entry',
    },
    conditions: {
      type: String,
      default: 'Educational simulation only. No official status granted. Valid for demo demonstration purposes.',
      trim: true,
      maxlength: [500, 'Conditions cannot exceed 500 characters'],
    },
    status: {
      type: String,
      required: [true, 'Application status is required'],
      enum: ['Pending', 'Under Review', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    disclaimer: {
      type: String,
      default: 'DEMO — NOT AN OFFICIAL IMMIGRATION DOCUMENT',
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Virtual field or helper to verify travel date integrity
applicationSchema.pre('validate', function (next) {
  if (this.travelStartDate && this.travelEndDate) {
    if (new Date(this.travelEndDate) < new Date(this.travelStartDate)) {
      this.invalidate('travelEndDate', 'Travel end date must be on or after travel start date');
    }
  }
  next();
});

module.exports = mongoose.model('Application', applicationSchema);
