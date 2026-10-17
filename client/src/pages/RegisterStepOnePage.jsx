import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Loader2,
  Compass,
} from 'lucide-react';

export default function RegisterStepOnePage() {
  const { register, user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [serverError, setServerError] = useState('');

  // Password requirements calculation
  const hasMinLength = formData.password.length >= 8;
  const hasUpper = /[A-Z]/.test(formData.password);
  const hasLower = /[a-z]/.test(formData.password);
  const hasNumber = /\d/.test(formData.password);
  const isStrongPassword = hasMinLength && hasUpper && hasLower && hasNumber;

  const validate = () => {
    const errors = {};

    if (!formData.displayName.trim() || formData.displayName.trim().length < 2) {
      errors.displayName = 'Family name / display name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please provide a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (!isStrongPassword) {
      errors.password = 'Password must meet all complexity requirements below';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
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
      // Step 1: Register user account on server, setting HTTP-only cookie and hashing password with bcrypt
      const result = await register({
        displayName: formData.displayName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      // Navigate to Step 2 with user data passed in state
      navigate('/register/step-2', {
        state: {
          displayName: formData.displayName.trim(),
          email: formData.email.trim().toLowerCase(),
        },
      });
    } catch (err) {
      setServerError(
        err.friendlyMessage || 'Registration failed. Please check your details.'
      );
      if (err.errors) {
        setFormErrors(err.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-xl w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
        {/* Wizard Step Indicator */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span className="text-blue-600 font-extrabold flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px]">
                1
              </span>
              Account Credentials
            </span>
            <span className="text-slate-400 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[11px]">
                2
              </span>
              Application Details
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full w-1/2 transition-all duration-300 rounded-full" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Register Demo Account (Step 1 of 2)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Create your educational login credentials to initiate a simulated visa application
          </p>
        </div>

        {/* Server Error Banner */}
        {serverError && (
          <div
            role="alert"
            className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-start gap-2.5 animate-fadeIn"
          >
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Family / Display Name */}
          <div>
            <label
              htmlFor="displayName"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
            >
              Family Name / Display Name
            </label>
            <div className="relative rounded-xl shadow-xs">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                id="displayName"
                name="displayName"
                type="text"
                value={formData.displayName}
                onChange={handleChange}
                placeholder="e.g., Sarah Jenkins"
                className={`block w-full pl-10 pr-3 py-2.5 sm:text-sm rounded-xl bg-white border ${
                  formErrors.displayName
                    ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
                    : 'border-slate-300 focus:ring-blue-600 focus:border-blue-600'
                } placeholder-slate-400 focus:outline-none focus:ring-2`}
              />
            </div>
            {formErrors.displayName && (
              <p className="mt-1 text-xs text-red-600 font-medium">{formErrors.displayName}</p>
            )}
          </div>

          {/* Email Address */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
            >
              Email Address
            </label>
            <div className="relative rounded-xl shadow-xs">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="sarah.jenkins@example.com"
                className={`block w-full pl-10 pr-3 py-2.5 sm:text-sm rounded-xl bg-white border ${
                  formErrors.email
                    ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
                    : 'border-slate-300 focus:ring-blue-600 focus:border-blue-600'
                } placeholder-slate-400 focus:outline-none focus:ring-2`}
              />
            </div>
            {formErrors.email && (
              <p className="mt-1 text-xs text-red-600 font-medium">{formErrors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
            >
              Password
            </label>
            <div className="relative rounded-xl shadow-xs">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 8 characters"
                className={`block w-full pl-10 pr-10 py-2.5 sm:text-sm rounded-xl bg-white border ${
                  formErrors.password
                    ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
                    : 'border-slate-300 focus:ring-blue-600 focus:border-blue-600'
                } placeholder-slate-400 focus:outline-none focus:ring-2`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password strength indicators */}
            <div className="mt-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <p className="text-[11px] font-semibold text-slate-600">Password requirements:</p>
              <div className="grid grid-cols-2 gap-1 text-[11px]">
                <div
                  className={`flex items-center gap-1.5 ${
                    hasMinLength ? 'text-emerald-700 font-medium' : 'text-slate-400'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>8+ characters</span>
                </div>
                <div
                  className={`flex items-center gap-1.5 ${
                    hasUpper ? 'text-emerald-700 font-medium' : 'text-slate-400'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Uppercase letter</span>
                </div>
                <div
                  className={`flex items-center gap-1.5 ${
                    hasLower ? 'text-emerald-700 font-medium' : 'text-slate-400'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Lowercase letter</span>
                </div>
                <div
                  className={`flex items-center gap-1.5 ${
                    hasNumber ? 'text-emerald-700 font-medium' : 'text-slate-400'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Number (0-9)</span>
                </div>
              </div>
            </div>
            {formErrors.password && (
              <p className="mt-1 text-xs text-red-600 font-medium">{formErrors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
            >
              Confirm Password
            </label>
            <div className="relative rounded-xl shadow-xs">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                className={`block w-full pl-10 pr-10 py-2.5 sm:text-sm rounded-xl bg-white border ${
                  formErrors.confirmPassword
                    ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
                    : 'border-slate-300 focus:ring-blue-600 focus:border-blue-600'
                } placeholder-slate-400 focus:outline-none focus:ring-2`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {formErrors.confirmPassword && (
              <p className="mt-1 text-xs text-red-600 font-medium">{formErrors.confirmPassword}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Validating & Creating Account...</span>
              </>
            ) : (
              <>
                <span>Continue to Step 2</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Existing account link */}
        <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-600">
          <span>Already have an educational account? </span>
          <Link
            to="/login"
            className="font-bold text-blue-600 hover:text-blue-700 underline focus:outline-none"
          >
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
}
