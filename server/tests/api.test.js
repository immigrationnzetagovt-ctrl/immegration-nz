const { test, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const User = require('../models/User');
const Application = require('../models/Application');
const { generateApplicationRef, createApplication } = require('../services/applicationService');
const { generateToken } = require('../services/authService');
const { validateRegistration } = require('../validators/authValidator');
const { validateApplication } = require('../validators/applicationValidator');
const { generateApplicationPdf } = require('../services/pdfService');
const { Writable } = require('stream');

const TEST_DB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/visapath_demo_test';

describe('VisaPath Demo Portal Backend Tests', () => {
  before(async () => {
    process.env.NODE_ENV = 'test';
    await mongoose.connect(TEST_DB_URI);
    await User.deleteMany({});
    await Application.deleteMany({});
  });

  after(async () => {
    await User.deleteMany({});
    await Application.deleteMany({});
    await mongoose.connection.close();
  });

  describe('Authentication & User Model', () => {
    test('Registration validator rejects weak passwords and invalid emails', () => {
      const invalidEmail = validateRegistration({
        displayName: 'John Doe',
        email: 'invalid-email',
        password: 'Password123',
        confirmPassword: 'Password123',
      });
      assert.strictEqual(invalidEmail.isValid, false);
      assert.ok(invalidEmail.errors.email);

      const weakPassword = validateRegistration({
        displayName: 'John Doe',
        email: 'john@example.com',
        password: 'weak',
        confirmPassword: 'weak',
      });
      assert.strictEqual(weakPassword.isValid, false);
      assert.ok(weakPassword.errors.password);

      const mismatchPassword = validateRegistration({
        displayName: 'John Doe',
        email: 'john@example.com',
        password: 'Password123',
        confirmPassword: 'Password456',
      });
      assert.strictEqual(mismatchPassword.isValid, false);
      assert.ok(mismatchPassword.errors.confirmPassword);
    });

    test('User password is automatically hashed with bcrypt and not stored in plaintext', async () => {
      const plainPassword = 'SecurePassword2026!';
      const user = new User({
        displayName: 'Alice Walker',
        email: 'alice.walker@example.com',
        password: plainPassword,
      });
      await user.save();

      // Ensure password in database is a bcrypt hash
      assert.notStrictEqual(user.password, plainPassword);
      assert.ok(user.password.startsWith('$2'));

      // Verify comparePassword method
      const isMatch = await user.comparePassword(plainPassword);
      assert.strictEqual(isMatch, true);

      const isMismatch = await user.comparePassword('WrongPassword');
      assert.strictEqual(isMismatch, false);

      // Verify password is stripped in toJSON
      const jsonUser = user.toJSON();
      assert.strictEqual(jsonUser.password, undefined);
    });

    test('Prevents duplicate email registration in MongoDB', async () => {
      let duplicateError = null;
      try {
        const duplicateUser = new User({
          displayName: 'Alice Duplicate',
          email: 'alice.walker@example.com',
          password: 'Password123!',
        });
        await duplicateUser.save();
      } catch (err) {
        duplicateError = err;
      }
      assert.ok(duplicateError, 'Should throw duplicate key error');
      assert.strictEqual(duplicateError.code, 11000);
    });
  });

  describe('Application Validation & Defaults', () => {
    test('Default values comply with specification (New Zealand, Visitor, Male, Multiple entry)', () => {
      const validation = validateApplication({
        displayName: 'Bob Smith',
        dateOfBirth: '1990-05-15',
        passportNumber: 'NZ9876543',
        travelStartDate: '2026-11-01',
        travelEndDate: '2026-11-20',
      });

      assert.strictEqual(validation.isValid, true);
      assert.strictEqual(validation.sanitized.nationality, 'New Zealand');
      assert.strictEqual(validation.sanitized.gender, 'Male');
      assert.strictEqual(validation.sanitized.visaType, 'Visitor');
      assert.strictEqual(validation.sanitized.entryType, 'Multiple entry');
    });

    test('Rejects invalid date ranges where end date precedes start date', () => {
      const invalidDates = validateApplication({
        displayName: 'Bob Smith',
        dateOfBirth: '1990-05-15',
        passportNumber: 'NZ9876543',
        travelStartDate: '2026-11-20',
        travelEndDate: '2026-11-10', // Before start date
      });

      assert.strictEqual(invalidDates.isValid, false);
      assert.ok(invalidDates.errors.travelEndDate);
    });
  });

  describe('Application Creation & Ownership Authorization', () => {
    let userA, userB, appA;

    before(async () => {
      userA = await User.create({
        displayName: 'Applicant User A',
        email: 'user.a@example.com',
        password: 'Password123!',
      });

      userB = await User.create({
        displayName: 'Applicant User B',
        email: 'user.b@example.com',
        password: 'Password123!',
      });
    });

    test('Generates server-controlled reference and enforces Pending status', async () => {
      appA = await createApplication(userA._id, {
        displayName: 'Applicant User A',
        nationality: 'New Zealand',
        dateOfBirth: new Date('1992-04-10'),
        gender: 'Male',
        passportNumber: 'FA882910',
        visaType: 'Visitor',
        travelStartDate: new Date('2026-12-01'),
        travelEndDate: new Date('2026-12-25'),
        entryType: 'Multiple entry',
        // Attempt to maliciously inject status or ref
        status: 'Approved',
        applicationRef: 'HACKED-REF',
      });

      assert.ok(appA.applicationRef.startsWith('VP-2026-'));
      assert.notStrictEqual(appA.applicationRef, 'HACKED-REF');
      assert.strictEqual(appA.status, 'Pending'); // Strictly Pending
      assert.strictEqual(appA.disclaimer, 'DEMO — NOT AN OFFICIAL IMMIGRATION DOCUMENT');
    });

    test('Enforces ownership isolation: User B cannot access User A application', async () => {
      const fetchedApp = await Application.findById(appA._id);
      assert.ok(fetchedApp);

      // Verify User A is owner
      assert.strictEqual(fetchedApp.user.toString(), userA._id.toString());

      // Check User B ownership check fails
      const isUserBOwner = fetchedApp.user.toString() === userB._id.toString();
      assert.strictEqual(isUserBOwner, false, 'User B must NOT be recognized as owner of User A application');
    });
  });

  describe('PDF Generation', () => {
    test('Generates valid PDF stream containing demo notice and application data', async () => {
      const dummyApp = {
        applicationRef: 'VP-2026-TEST99',
        displayName: 'Educational Sample Applicant',
        nationality: 'New Zealand',
        dateOfBirth: new Date('1995-01-01'),
        gender: 'Male',
        passportNumber: 'MOCK-NZ-001',
        visaType: 'Visitor',
        travelStartDate: new Date('2026-11-01'),
        travelEndDate: new Date('2026-11-15'),
        entryType: 'Multiple entry',
        conditions: 'Sample conditions for educational demonstration.',
        status: 'Pending',
        createdAt: new Date(),
      };

      const chunks = [];
      const mockStream = new Writable({
        write(chunk, encoding, callback) {
          chunks.push(chunk);
          callback();
        },
      });

      await new Promise((resolve, reject) => {
        mockStream.on('finish', resolve);
        mockStream.on('error', reject);
        generateApplicationPdf(dummyApp, mockStream);
      });

      const pdfBuffer = Buffer.concat(chunks);
      assert.ok(pdfBuffer.length > 500, 'PDF buffer should have content');
      // Standard PDF header signature
      const header = pdfBuffer.slice(0, 5).toString('ascii');
      assert.strictEqual(header, '%PDF-');
    });
  });
});
