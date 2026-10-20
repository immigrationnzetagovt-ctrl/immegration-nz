import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Home, Calendar, AlertCircle, Loader2 } from 'lucide-react';
import logo from '../assets/immegration.png';

export default function RegisterStepOnePage() {
  const { register, user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [serverError, setServerError] = useState('');

  // Password complexity helpers
  const hasMinLength = formData.password.length >= 8;
  const hasUpper = /[A-Z]/.test(formData.password);
  const hasLower = /[a-z]/.test(formData.password);
  const hasNumber = /\d/.test(formData.password);
  const isStrongPassword = hasMinLength && hasUpper && hasLower && hasNumber;

  const validate = () => {
    const errors = {};

    if (!formData.displayName.trim() || formData.displayName.trim().length < 2) {
      errors.displayName = 'Family Name is required (min 2 characters)';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (!isStrongPassword) {
      errors.password = 'Password must meet all complexity requirements';
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
      await register({
        displayName: formData.displayName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      navigate('/register/step-2', {
        state: {
          displayName: formData.displayName.trim(),
          email: formData.email.trim().toLowerCase(),
        },
      });
    } catch (err) {
      setServerError(
        err.friendlyMessage || 'Registration failed. Please check your details and try again.'
      );
      if (err.errors) {
        setFormErrors(err.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white font-sans text-[#19232d] antialiased select-none">
      
      {/* 1. Official Blue Header Layer */}
      <header className="w-full bg-[#0066a1] text-white py-6 px-6 sm:px-12 border-b border-[#005282]">
        <div className="max-w-[1240px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={logo}
              alt="Immigration New Zealand"
              className="h-14 sm:h-16 w-auto object-contain brightness-0 invert"
            />
          </div>
        </div>
      </header>

      {/* 2. Breadcrumb Navigation Bar */}
      <div className="w-full bg-[#eef4f8] border-b border-[#c8d6e3] py-2.5 px-6 sm:px-12 text-[14px]">
        <div className="max-w-[1240px] mx-auto flex items-center gap-2 text-[#0066a1] font-medium">
          <Link to="/" className="flex items-center gap-1 hover:underline">
            <Home className="w-4 h-4 fill-[#0066a1] stroke-none" />
            <span>Home</span>
          </Link>
          <span className="text-[#556070] font-bold">&gt;</span>
          <span className="hover:underline cursor-pointer">VisaView</span>
          <span className="text-[#556070] font-bold">&gt;</span>
          <span className="text-[#232833] font-bold">Visa Verification Enquiry</span>
        </div>
      </div>

      {/* 3. Main Portal Body (Left Sidebar & Right Enquiry Form) */}
      <div className="max-w-[1240px] mx-auto flex flex-col md:flex-row min-h-[600px] border-b border-[#c8d6e3]">
        
        {/* Left Sidebar Menu */}
        <aside className="w-full md:w-[280px] bg-[#eef4f8] border-r border-[#c8d6e3] p-6 shrink-0">
          <h2 className="text-[20px] font-bold text-[#0066a1] mb-4">
            VisaView
          </h2>
          <ul className="space-y-3 text-[14px] text-[#0066a1]">
            <li className="flex items-center gap-2 hover:underline cursor-pointer">
              <span className="text-[10px]">▶</span> Register Organisation
            </li>
            <li className="flex items-center gap-2 font-bold text-[#003c66] hover:underline cursor-pointer">
              <span className="text-[10px]">▶</span> Verify Visa Record
            </li>
            <li className="flex items-center gap-2 hover:underline cursor-pointer">
              <span className="text-[10px]">▶</span> My Visa Verification Service Account
            </li>
          </ul>
        </aside>

        {/* Right Form Content Area */}
        <main className="flex-1 p-6 sm:p-10 bg-white">
          
          {/* Header Info Row */}
          <div className="flex items-center justify-between text-[14px] mb-6 border-b border-transparent">
            <div>
              <span className="text-[#19232d]">Acting for: </span>
              <strong className="text-[#19232d] font-bold">Visa Verification Service</strong>
            </div>
            <div>
              <span className="text-[#19232d]">Logged in: </span>
            </div>
          </div>

          {/* Form Main Title */}
          <h1 className="text-[32px] sm:text-[36px] font-normal text-[#0066a1] tracking-tight mb-6">
            Visa Verification Enquiry
          </h1>

          <p className="text-[15px] text-[#19232d] mb-2 font-normal">
            Enter the details of the visa to be verified.
          </p>

          <p className="text-[15px] text-[#19232d] mb-8 font-normal">
            Please enter these details exactly as they appear in the visa holder's passport.
          </p>

          {/* Server Error Alert */}
          {serverError && (
            <div
              role="alert"
              className="mb-6 p-3.5 rounded-[3px] bg-red-50 border border-red-300 text-red-800 text-sm flex items-center gap-2.5"
            >
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          {/* Main Form Fields */}
          <form onSubmit={handleSubmit} className="space-y-5 max-w-[560px]" noValidate>
            
            {/* Family Name / Display Name */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label htmlFor="displayName" className="text-[15px] font-bold text-[#19232d] sm:w-[220px]">
                Family Name *
              </label>
              <div className="flex-1">
                <input
                  id="displayName"
                  name="displayName"
                  type="text"
                  value={formData.displayName}
                  onChange={handleChange}
                  className={`w-full px-3 py-1.5 text-[15px] rounded-[3px] border ${
                    formErrors.displayName ? 'border-red-500' : 'border-[#7f9db9]'
                  } focus:outline-none focus:border-[#0066a1] shadow-inner`}
                />
                {formErrors.displayName && (
                  <p className="text-xs text-red-600 mt-1">{formErrors.displayName}</p>
                )}
              </div>
            </div>

            {/* Email Address */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label htmlFor="email" className="text-[15px] font-bold text-[#19232d] sm:w-[220px]">
                Email Address *
              </label>
              <div className="flex-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-1.5 text-[15px] rounded-[3px] border ${
                    formErrors.email ? 'border-red-500' : 'border-[#7f9db9]'
                  } focus:outline-none focus:border-[#0066a1] shadow-inner`}
                />
                {formErrors.email && (
                  <p className="text-xs text-red-600 mt-1">{formErrors.email}</p>
                )}
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label htmlFor="password" className="text-[15px] font-bold text-[#19232d] sm:w-[220px]">
                Password *
              </label>
              <div className="flex-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-3 py-1.5 text-[15px] rounded-[3px] border ${
                    formErrors.password ? 'border-red-500' : 'border-[#7f9db9]'
                  } focus:outline-none focus:border-[#0066a1] shadow-inner`}
                />
                {formErrors.password && (
                  <p className="text-xs text-red-600 mt-1">{formErrors.password}</p>
                )}
              </div>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label htmlFor="confirmPassword" className="text-[15px] font-bold text-[#19232d] sm:w-[220px]">
                Confirm Password *
              </label>
              <div className="flex-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-3 py-1.5 text-[15px] rounded-[3px] border ${
                    formErrors.confirmPassword ? 'border-red-500' : 'border-[#7f9db9]'
                  } focus:outline-none focus:border-[#0066a1] shadow-inner`}
                />
                {formErrors.confirmPassword && (
                  <p className="text-xs text-red-600 mt-1">{formErrors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Checkbox Consent Notice */}
            <div className="pt-4 flex items-start gap-3">
              <input
                id="consent"
                type="checkbox"
                defaultChecked
                className="mt-1 w-4 h-4 border-[#7f9db9] rounded-[2px]"
              />
              <label htmlFor="consent" className="text-[15px] text-[#19232d] font-normal cursor-pointer">
                The visa holder has consented to this check.
              </label>
            </div>

            {/* Submit Action Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-[#007ac9] hover:bg-[#0062a3] text-white font-bold text-[15px] rounded-[3px] transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <span>Check Visa</span>
                )}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
