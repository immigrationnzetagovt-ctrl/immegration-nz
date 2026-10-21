import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { applicationService } from '../services/applicationService';
import logo from '../assets/immegration.png';
import { Loader2, AlertCircle, Home } from 'lucide-react';

export default function RegisterStepTwoPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Try recovering step1 from location.state OR sessionStorage
  const savedStepOne = (() => {
    try {
      const stored = sessionStorage.getItem('visapath_step1');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  })();

  const stepOneData = (location.state && Object.keys(location.state).length > 0)
    ? location.state
    : savedStepOne;

  const hasToken = Boolean(localStorage.getItem('visapath_token'));
  const isAuth = Boolean(user || hasToken);

  // Form State containing ALL previous input fields and defaults
  const [formData, setFormData] = useState({
    displayName: stepOneData.displayName || user?.displayName || '',
    nationality: 'New Zealand',
    dateOfBirth: '1993-11-02',
    gender: 'Male',
    passportNumber: 'V6416018',
    documentNumber: 'NZ9482710',
    visaType: 'Visitor',
    travelStartDate: '2026-03-27',
    travelEndDate: '2026-04-27',
    entryType: 'Single entry',
    consented: true,
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
      errors.displayName = 'Family Name is required (min 2 characters)';
    }

    if (!formData.nationality.trim()) {
      errors.nationality = 'Nationality is required';
    }

    if (!formData.dateOfBirth) {
      errors.dateOfBirth = 'Date of Birth is required';
    }

    if (!formData.passportNumber.trim()) {
      errors.passportNumber = 'Passport Number is required';
    }

    if (!formData.documentNumber.trim()) {
      errors.documentNumber = 'Document Number is required';
    }

    if (!formData.travelStartDate) {
      errors.travelStartDate = 'Visa Start Date is required';
    }

    if (!formData.travelEndDate) {
      errors.travelEndDate = 'Travel End Date is required';
    }

    if (formData.travelStartDate && formData.travelEndDate) {
      const start = new Date(formData.travelStartDate);
      const end = new Date(formData.travelEndDate);
      if (end < start) {
        errors.travelEndDate = 'Travel end date must be on or after travel start date';
      }
    }

    if (!formData.consented) {
      errors.consented = 'You must confirm that the visa holder has consented to this check.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const currentToken = localStorage.getItem('visapath_token');
    const userLoggedIn = Boolean(user || currentToken);
    const hasInlineAccount = Boolean(stepOneData.email && stepOneData.password);

    if (!userLoggedIn && !hasInlineAccount) {
      setServerError(
        'Step 1 account registration is required before submitting. Please complete Step 1 first or log in.'
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);
    setServerError('');

    try {
      const payload = {
        ...formData,
        ...(hasInlineAccount
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

      // Clean up temporary step 1 cache
      sessionStorage.removeItem('visapath_step1');

      // Redirect directly to application dashboard
      navigate('/application', { replace: true });
    } catch (err) {
      setServerError(
        err.friendlyMessage || 'Failed to submit application. Please check the fields and try again.'
      );
      if (err.errors) {
        setFormErrors(err.errors);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // ignore
    }
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white text-[#222222] font-[Arial,sans-serif] text-[13px] leading-normal flex flex-col antialiased select-none">
      {/* Top Header Bar matching VisaView */}
      <header className="bg-[#005aa9] h-[86px] px-[72px] flex items-center justify-between">
        <div className="flex items-center">
          <img
            src={logo}
            alt="Immigration New Zealand"
            className="h-[52px] object-contain brightness-0 invert"
          />
        </div>
        <div className="text-white text-[12px] flex items-center gap-2">
          <span>Logged in:</span>
          <span className="font-semibold">{user?.email || stepOneData.email || 'User'}</span>
          <span>|</span>
          <button onClick={handleLogout} className="underline hover:text-slate-200">
            Log out
          </button>
        </div>
      </header>

      {/* Breadcrumb Bar */}
      <div className="bg-[#dbe6f1] h-[34px] px-[72px] text-[13px] text-[#003399] flex items-center gap-1.5 border-b border-[#c2d3e4]">
        <Link to="/" className="flex items-center gap-1 hover:underline text-[#003399]">
          <Home className="w-3.5 h-3.5 text-[#222222]" />
          <span>Home</span>
        </Link>
        <span className="text-[#333333]">&gt;</span>
        <span className="hover:underline cursor-pointer">VisaView</span>
        <span className="text-[#333333]">&gt;</span>
        <span className="text-[#222222] font-bold">Visa Verification Enquiry</span>
      </div>

      {/* Main Container */}
      <div className="flex flex-1 pl-[72px]">
        {/* Left Navigation Sidebar */}
        <aside className="w-[215px] bg-[#eef4f9] border-r border-[#cad8e6] pt-6 pr-4 pl-0 shrink-0 min-h-[calc(100vh-120px)]">
          <h2 className="text-[17px] font-bold text-[#003399] mb-3 pl-4">VisaView</h2>
          <ul className="space-y-2 text-[13px] text-[#003399]">
            <li className="flex items-start gap-1.5 cursor-pointer hover:underline pl-4">
              <span className="text-[9px] mt-[3px] text-[#003399]">►</span>
              <span>Register Organisation</span>
            </li>
            <li className="flex items-start gap-1.5 cursor-pointer hover:underline pl-4">
              <span className="text-[9px] mt-[3px] text-[#003399]">►</span>
              <span>Verify Visa Record</span>
            </li>
            <li className="flex items-start gap-1.5 font-bold cursor-pointer hover:underline pl-4">
              <span className="text-[9px] mt-[3px] text-[#003399]">►</span>
              <span>My Visa Verification Service Account</span>
            </li>
          </ul>
        </aside>

        {/* Right Content Form Area */}
        <main className="flex-1 pt-6 pl-9 pr-12 max-w-[950px] pb-16">
          {/* Top Info Header Bar */}
          <div className="flex justify-between items-baseline text-[13px] mb-6 border-b border-slate-200 pb-3">
            <div>
              <span className="text-[#333333]">Acting for:</span>{' '}
              <span className="font-bold text-[#222222]">Visa Verification Service</span>
            </div>
            {!isAuth && (
              <div className="text-xs text-amber-700 font-semibold">
                Note: Creating demo record for new account.
              </div>
            )}
          </div>

          {/* Title and Instructions */}
          <div className="space-y-1 mb-6">
            <h1 className="text-[28px] font-normal text-[#003399] tracking-tight leading-none mb-3">
              Visa Verification Enquiry
            </h1>
            <p className="text-[13px] text-[#222222]">
              Enter the details of the visa to be verified.
            </p>
            <p className="text-[13px] text-[#222222]">
              Please enter these details exactly as they appear in the visa holder's passport.
            </p>
          </div>

          {/* Error Banner */}
          {serverError && (
            <div role="alert" className="p-3 mb-4 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between rounded-xs">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{serverError}</span>
              </div>
              <button onClick={() => setServerError('')} className="underline font-bold">
                Dismiss
              </button>
            </div>
          )}

          {/* Form matching official VisaView portal layout with all parameters */}
          <form onSubmit={handleSubmit} className="space-y-4 max-w-[650px]" noValidate>
            {/* Family Name */}
            <div className="grid grid-cols-[180px_1fr] items-center gap-4">
              <label htmlFor="displayName" className="text-[13px] text-[#222222]">
                Family Name *
              </label>
              <div>
                <input
                  id="displayName"
                  name="displayName"
                  type="text"
                  value={formData.displayName}
                  onChange={handleChange}
                  placeholder="GAGANDEEP SINGH"
                  className={`w-full h-[32px] px-2.5 bg-white border ${
                    formErrors.displayName ? 'border-red-500' : 'border-[#7f9db9]'
                  } text-[13px] text-[#222222] outline-none rounded-[2px] focus:border-[#003399]`}
                />
                {formErrors.displayName && (
                  <span className="text-[11px] text-red-600 mt-0.5 block">{formErrors.displayName}</span>
                )}
              </div>
            </div>

            {/* Passport Number */}
            <div className="grid grid-cols-[180px_1fr] items-center gap-4">
              <label htmlFor="passportNumber" className="text-[13px] text-[#222222]">
                Passport Number *
              </label>
              <div>
                <input
                  id="passportNumber"
                  name="passportNumber"
                  type="text"
                  value={formData.passportNumber}
                  onChange={handleChange}
                  className={`w-full h-[32px] px-2.5 bg-white border ${
                    formErrors.passportNumber ? 'border-red-500' : 'border-[#7f9db9]'
                  } text-[13px] text-[#222222] outline-none rounded-[2px] uppercase`}
                />
                {formErrors.passportNumber && (
                  <span className="text-[11px] text-red-600 mt-0.5 block">{formErrors.passportNumber}</span>
                )}
              </div>
            </div>

            {/* Document Number */}
            <div className="grid grid-cols-[180px_1fr] items-center gap-4">
              <label htmlFor="documentNumber" className="text-[13px] text-[#222222]">
                Document Number *
              </label>
              <div>
                <input
                  id="documentNumber"
                  name="documentNumber"
                  type="text"
                  value={formData.documentNumber}
                  onChange={handleChange}
                  className={`w-full h-[32px] px-2.5 bg-white border ${
                    formErrors.documentNumber ? 'border-red-500' : 'border-[#7f9db9]'
                  } text-[13px] text-[#222222] outline-none rounded-[2px]`}
                />
                {formErrors.documentNumber && (
                  <span className="text-[11px] text-red-600 mt-0.5 block">{formErrors.documentNumber}</span>
                )}
              </div>
            </div>

            {/* Date of Birth */}
            <div className="grid grid-cols-[180px_1fr] items-center gap-4">
              <label htmlFor="dateOfBirth" className="text-[13px] text-[#222222]">
                Date of Birth *
              </label>
              <div>
                <input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className={`w-full h-[32px] px-2.5 bg-white border ${
                    formErrors.dateOfBirth ? 'border-red-500' : 'border-[#7f9db9]'
                  } text-[13px] text-[#222222] outline-none rounded-[2px]`}
                />
                {formErrors.dateOfBirth && (
                  <span className="text-[11px] text-red-600 mt-0.5 block">{formErrors.dateOfBirth}</span>
                )}
              </div>
            </div>

            {/* Gender */}
            <div className="grid grid-cols-[180px_1fr] items-center gap-4">
              <label htmlFor="gender" className="text-[13px] text-[#222222]">
                Gender *
              </label>
              <div>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full h-[32px] px-2 bg-white border border-[#7f9db9] text-[13px] text-[#222222] outline-none rounded-[2px]"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Nationality */}
            <div className="grid grid-cols-[180px_1fr] items-center gap-4">
              <label htmlFor="nationality" className="text-[13px] text-[#222222]">
                Passport Nationality *
              </label>
              <div>
                <select
                  id="nationality"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  className="w-full h-[32px] px-2 bg-white border border-[#7f9db9] text-[13px] text-[#222222] outline-none rounded-[2px]"
                >
                  <option value="New Zealand">New Zealand</option>
                  <option value="India">India</option>
                  <option value="Australia">Australia</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                </select>
              </div>
            </div>

            {/* Visa Category / Type */}
            <div className="grid grid-cols-[180px_1fr] items-center gap-4">
              <label htmlFor="visaType" className="text-[13px] text-[#222222]">
                Visa Category *
              </label>
              <div>
                <select
                  id="visaType"
                  name="visaType"
                  value={formData.visaType}
                  onChange={handleChange}
                  className="w-full h-[32px] px-2 bg-white border border-[#7f9db9] text-[13px] text-[#222222] outline-none rounded-[2px]"
                >
                  <option value="Visitor">Visitor</option>
                  <option value="Student">Student</option>
                  <option value="Work">Work</option>
                  <option value="Business">Business</option>
                  <option value="Transit">Transit</option>
                </select>
              </div>
            </div>

            {/* Visa Start Date */}
            <div className="grid grid-cols-[180px_1fr] items-center gap-4">
              <label htmlFor="travelStartDate" className="text-[13px] text-[#222222]">
                Visa Start Date (dd/mm/yyyy) *
              </label>
              <div>
                <input
                  id="travelStartDate"
                  name="travelStartDate"
                  type="date"
                  value={formData.travelStartDate}
                  onChange={handleChange}
                  className={`w-full h-[32px] px-2.5 bg-white border ${
                    formErrors.travelStartDate ? 'border-red-500' : 'border-[#7f9db9]'
                  } text-[13px] text-[#222222] outline-none rounded-[2px]`}
                />
                {formErrors.travelStartDate && (
                  <span className="text-[11px] text-red-600 mt-0.5 block">{formErrors.travelStartDate}</span>
                )}
              </div>
            </div>

            {/* Visa End Date */}
            <div className="grid grid-cols-[180px_1fr] items-center gap-4">
              <label htmlFor="travelEndDate" className="text-[13px] text-[#222222]">
                Visa Expiry Date *
              </label>
              <div>
                <input
                  id="travelEndDate"
                  name="travelEndDate"
                  type="date"
                  value={formData.travelEndDate}
                  onChange={handleChange}
                  className={`w-full h-[32px] px-2.5 bg-white border ${
                    formErrors.travelEndDate ? 'border-red-500' : 'border-[#7f9db9]'
                  } text-[13px] text-[#222222] outline-none rounded-[2px]`}
                />
                {formErrors.travelEndDate && (
                  <span className="text-[11px] text-red-600 mt-0.5 block">{formErrors.travelEndDate}</span>
                )}
              </div>
            </div>

            {/* Entry Type */}
            <div className="grid grid-cols-[180px_1fr] items-center gap-4">
              <label htmlFor="entryType" className="text-[13px] text-[#222222]">
                Number of Entries *
              </label>
              <div>
                <select
                  id="entryType"
                  name="entryType"
                  value={formData.entryType}
                  onChange={handleChange}
                  className="w-full h-[32px] px-2 bg-white border border-[#7f9db9] text-[13px] text-[#222222] outline-none rounded-[2px]"
                >
                  <option value="Single entry">Single entry</option>
                  <option value="Multiple entry">Multiple entry</option>
                </select>
              </div>
            </div>

            {/* Conditions / Notes */}
            <div className="grid grid-cols-[180px_1fr] items-start gap-4 pt-1">
              <label htmlFor="conditions" className="text-[13px] text-[#222222] pt-1">
                Visa Conditions
              </label>
              <div>
                <textarea
                  id="conditions"
                  name="conditions"
                  rows={3}
                  value={formData.conditions}
                  onChange={handleChange}
                  className="w-full p-2 bg-white border border-[#7f9db9] text-[13px] text-[#222222] outline-none rounded-[2px]"
                />
              </div>
            </div>

            {/* Checkbox Consent */}
            <div className="pt-2 pl-[180px]">
              <label className="flex items-start gap-2.5 cursor-pointer text-[13px] text-[#222222]">
                <input
                  type="checkbox"
                  name="consented"
                  checked={formData.consented}
                  onChange={handleChange}
                  className="mt-0.5 rounded-[2px] border-[#7f9db9] text-[#005ba9] focus:ring-0 w-4 h-4"
                />
                <span>The visa holder has consented to this check.</span>
              </label>
              {formErrors.consented && (
                <span className="text-[11px] text-red-600 mt-1 block">{formErrors.consented}</span>
              )}
            </div>

            {/* Submit Button matching reference style */}
            <div className="pt-4 pl-[180px]">
              <button
                type="submit"
                disabled={loading}
                id="check-visa-btn"
                className="px-5 py-2 bg-[#005ba4] hover:bg-[#004a87] text-white text-[13px] font-bold rounded-[2px] transition-colors disabled:opacity-50 flex items-center gap-2 shadow-xs cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Verifying Record...</span>
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
