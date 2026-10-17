import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { applicationService } from '../services/applicationService';
import {
  FileText,
  User,
  Globe2,
  Calendar,
  CreditCard,
  Plane,
  AlertCircle,
  Loader2,
  ArrowRight,
  ShieldAlert,
  Info,
  Check,
} from 'lucide-react';

export default function RegisterStepTwoPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const stepOneData = location.state || {};

  // Form State with required defaults
  const [formData, setFormData] = useState({
    displayName: stepOneData.displayName || user?.displayName || '',
    nationality: 'New Zealand', // Default specified
    dateOfBirth: '1994-06-15',
    gender: 'Male', // Default specified
    passportNumber: 'NZ9482710', // Fictional sample default
    visaType: 'Visitor', // Default specified
    travelStartDate: '2026-11-15',
    travelEndDate: '2026-12-05',
    entryType: 'Multiple entry', // Default specified
    conditions:
      'Educational simulation only. No official status granted. Valid for demo demonstration purposes.',
  });

  const [formErrors, setFormErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  // Sync display name if user loads after mount
  useEffect(() => {
    if (user?.displayName && !formData.displayName) {
      setFormData((prev) => ({ ...prev, displayName: user.displayName }));
    }
  }, [user]);

  const validate = () => {
    const errors = {};

    if (!formData.displayName.trim() || formData.displayName.trim().length < 2) {
      errors.displayName = 'Applicant name is required (min 2 characters)';
    }

    if (!formData.nationality.trim()) {
      errors.nationality = 'Nationality is required';
    }

    if (!formData.dateOfBirth) {
      errors.dateOfBirth = 'Date of birth is required';
    } else {
      const dob = new Date(formData.dateOfBirth);
      if (dob > new Date()) {
        errors.dateOfBirth = 'Date of birth cannot be in the future';
      }
    }

    if (!formData.passportNumber.trim()) {
      errors.passportNumber = 'Fictional passport number is required';
    } else if (!/^[A-Za-z0-9\- ]{5,25}$/.test(formData.passportNumber.trim())) {
      errors.passportNumber = 'Passport number must be 5-25 alphanumeric characters';
    }

    if (!formData.travelStartDate) {
      errors.travelStartDate = 'Travel start date is required';
    }
    if (!formData.travelEndDate) {
      errors.travelEndDate = 'Travel end date is required';
    }

    if (formData.travelStartDate && formData.travelEndDate) {
      const start = new Date(formData.travelStartDate);
      const end = new Date(formData.travelEndDate);
      if (end < start) {
        errors.travelEndDate = 'Travel end date must be on or after travel start date';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setServerError('');

    try {
      // Build submission payload
      const payload = {
        ...formData,
        // Include account creation details if user is not already logged in
        ...(stepOneData.email && stepOneData.password
          ? {
              account: {
                displayName: formData.displayName,
                email: stepOneData.email,
                password: stepOneData.password,
                confirmPassword: stepOneData.password,
              },
            }
          : {}),
      };

      await applicationService.createApplication(payload);

      // Redirect directly to application dashboard
      navigate('/application', { replace: true });
    } catch (err) {
      setServerError(
        err.friendlyMessage || 'Failed to submit application. Please check the fields and try again.'
      );
      if (err.errors) {
        setFormErrors(err.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Wizard Progress */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
          <Link
            to="/register"
            className="text-emerald-700 font-extrabold flex items-center gap-1.5 hover:underline"
          >
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px]">
              ✓
            </span>
            Account Step 1 Completed
          </Link>
          <span className="text-blue-600 font-extrabold flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px]">
              2
            </span>
            Application Details
          </span>
        </div>
        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
          <div className="bg-blue-600 h-full w-full transition-all duration-300 rounded-full" />
        </div>
      </div>

      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider">
          <ShieldAlert className="w-4 h-4 text-amber-600" />
          <span>Fictional Demonstration • Not an Official Immigration Document</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Application Details (Step 2 of 2)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Enter your simulated personal and travel parameters. Default educational values are pre-selected.
        </p>
      </div>

      {/* Server Error Banner */}
      {serverError && (
        <div
          role="alert"
          className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-start gap-2.5 animate-fadeIn"
        >
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold">Submission Error:</strong> {serverError}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8" noValidate>
        {/* Section 1: Personal Information */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                1. Personal Information
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Primary identity declarations for the demo application
              </p>
            </div>
            <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">
              Simulated Identity
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Display Name */}
            <div>
              <label
                htmlFor="displayName"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Applicant Full Name *
              </label>
              <input
                id="displayName"
                name="displayName"
                type="text"
                value={formData.displayName}
                onChange={handleChange}
                placeholder="e.g. Johnathan Smith"
                className={`block w-full px-3.5 py-2.5 sm:text-sm rounded-xl bg-white border ${
                  formErrors.displayName
                    ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
                    : 'border-slate-300 focus:ring-blue-600 focus:border-blue-600'
                } placeholder-slate-400 focus:outline-none focus:ring-2`}
              />
              {formErrors.displayName && (
                <p className="mt-1 text-xs text-red-600 font-medium">{formErrors.displayName}</p>
              )}
            </div>

            {/* Nationality */}
            <div>
              <label
                htmlFor="nationality"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Declared Nationality *
              </label>
              <select
                id="nationality"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                className="block w-full px-3.5 py-2.5 sm:text-sm rounded-xl bg-white border border-slate-300 focus:ring-blue-600 focus:border-blue-600 focus:outline-none focus:ring-2"
              >
                <option value="New Zealand">New Zealand (Default Demo)</option>
                <option value="Australia">Australia</option>
                <option value="Canada">Canada</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="United States">United States</option>
                <option value="Singapore">Singapore</option>
                <option value="Japan">Japan</option>
                <option value="Germany">Germany</option>
              </select>
              {formErrors.nationality && (
                <p className="mt-1 text-xs text-red-600 font-medium">{formErrors.nationality}</p>
              )}
            </div>

            {/* Date of Birth */}
            <div>
              <label
                htmlFor="dateOfBirth"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Date of Birth *
              </label>
              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]}
                className={`block w-full px-3.5 py-2.5 sm:text-sm rounded-xl bg-white border ${
                  formErrors.dateOfBirth
                    ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
                    : 'border-slate-300 focus:ring-blue-600 focus:border-blue-600'
                } focus:outline-none focus:ring-2`}
              />
              {formErrors.dateOfBirth && (
                <p className="mt-1 text-xs text-red-600 font-medium">{formErrors.dateOfBirth}</p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label
                htmlFor="gender"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Gender *
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="block w-full px-3.5 py-2.5 sm:text-sm rounded-xl bg-white border border-slate-300 focus:ring-blue-600 focus:border-blue-600 focus:outline-none focus:ring-2"
              >
                <option value="Male">Male (Default)</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Undisclosed">Undisclosed</option>
              </select>
              {formErrors.gender && (
                <p className="mt-1 text-xs text-red-600 font-medium">{formErrors.gender}</p>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Travel & Sample Application Information */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Plane className="w-5 h-5 text-blue-600" />
                2. Travel & Sample Application Information
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Simulated travel dates, passport reference, and visa category
              </p>
            </div>
            <span className="text-[11px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-full">
              Travel Simulation
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Fictional Passport Number */}
            <div>
              <label
                htmlFor="passportNumber"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Fictional Passport Number *
              </label>
              <input
                id="passportNumber"
                name="passportNumber"
                type="text"
                value={formData.passportNumber}
                onChange={handleChange}
                placeholder="e.g. NZ9482710"
                className={`block w-full px-3.5 py-2.5 sm:text-sm rounded-xl bg-white border ${
                  formErrors.passportNumber
                    ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
                    : 'border-slate-300 focus:ring-blue-600 focus:border-blue-600'
                } placeholder-slate-400 focus:outline-none focus:ring-2 uppercase`}
              />
              <p className="mt-1 text-[11px] text-slate-400">
                Notice: For educational safety, use fictional sample data only.
              </p>
              {formErrors.passportNumber && (
                <p className="mt-1 text-xs text-red-600 font-medium">{formErrors.passportNumber}</p>
              )}
            </div>

            {/* Visa Type */}
            <div>
              <label
                htmlFor="visaType"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Visa Category *
              </label>
              <select
                id="visaType"
                name="visaType"
                value={formData.visaType}
                onChange={handleChange}
                className="block w-full px-3.5 py-2.5 sm:text-sm rounded-xl bg-white border border-slate-300 focus:ring-blue-600 focus:border-blue-600 focus:outline-none focus:ring-2"
              >
                <option value="Visitor">Visitor (Default)</option>
                <option value="Student">Student</option>
                <option value="Work">Work</option>
                <option value="Transit">Transit</option>
                <option value="Business">Business</option>
              </select>
              {formErrors.visaType && (
                <p className="mt-1 text-xs text-red-600 font-medium">{formErrors.visaType}</p>
              )}
            </div>

            {/* Travel Start Date */}
            <div>
              <label
                htmlFor="travelStartDate"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Travel Start Date *
              </label>
              <input
                id="travelStartDate"
                name="travelStartDate"
                type="date"
                value={formData.travelStartDate}
                onChange={handleChange}
                className={`block w-full px-3.5 py-2.5 sm:text-sm rounded-xl bg-white border ${
                  formErrors.travelStartDate
                    ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
                    : 'border-slate-300 focus:ring-blue-600 focus:border-blue-600'
                } focus:outline-none focus:ring-2`}
              />
              {formErrors.travelStartDate && (
                <p className="mt-1 text-xs text-red-600 font-medium">{formErrors.travelStartDate}</p>
              )}
            </div>

            {/* Travel End Date */}
            <div>
              <label
                htmlFor="travelEndDate"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Travel End Date *
              </label>
              <input
                id="travelEndDate"
                name="travelEndDate"
                type="date"
                value={formData.travelEndDate}
                onChange={handleChange}
                min={formData.travelStartDate}
                className={`block w-full px-3.5 py-2.5 sm:text-sm rounded-xl bg-white border ${
                  formErrors.travelEndDate
                    ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
                    : 'border-slate-300 focus:ring-blue-600 focus:border-blue-600'
                } focus:outline-none focus:ring-2`}
              />
              {formErrors.travelEndDate && (
                <p className="mt-1 text-xs text-red-600 font-medium">{formErrors.travelEndDate}</p>
              )}
            </div>

            {/* Entry Type */}
            <div className="sm:col-span-2">
              <label
                htmlFor="entryType"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Entry Type *
              </label>
              <select
                id="entryType"
                name="entryType"
                value={formData.entryType}
                onChange={handleChange}
                className="block w-full px-3.5 py-2.5 sm:text-sm rounded-xl bg-white border border-slate-300 focus:ring-blue-600 focus:border-blue-600 focus:outline-none focus:ring-2"
              >
                <option value="Multiple entry">Multiple entry (Default)</option>
                <option value="Single entry">Single entry</option>
              </select>
              {formErrors.entryType && (
                <p className="mt-1 text-xs text-red-600 font-medium">{formErrors.entryType}</p>
              )}
            </div>

            {/* Conditions */}
            <div className="sm:col-span-2">
              <label
                htmlFor="conditions"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Conditions & Notes
              </label>
              <textarea
                id="conditions"
                name="conditions"
                rows={3}
                value={formData.conditions}
                onChange={handleChange}
                className="block w-full px-3.5 py-2.5 sm:text-sm rounded-xl bg-white border border-slate-300 focus:ring-blue-600 focus:border-blue-600 focus:outline-none focus:ring-2 placeholder-slate-400"
              />
              <p className="mt-1 text-[11px] text-slate-400">
                Simulated conditions to be printed onto the generated PDF document.
              </p>
            </div>
          </div>
        </div>

        {/* Server Policy Notice */}
        <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-800">Server Verification Policy:</strong> The server will
            generate a unique tracking reference (e.g. <code>VP-2026-XXXXXX</code>) and enforce an initial
            status of <strong>Pending</strong>. Client-supplied reference numbers or statuses are ignored.
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <Link
            to="/register"
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            ← Back to Step 1 (Account Credentials)
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Submitting Demo Application...</span>
              </>
            ) : (
              <>
                <span>Submit Demo Application</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
