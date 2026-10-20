import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { applicationService } from '../services/applicationService';
import logo from '../assets/immegration.png';
import { Loader2, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function ApplicationDetailsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [error, setError] = useState('');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const fetchApplication = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await applicationService.getMyApplication();
      if (data.success) {
        setApplication(data.application);
      } else {
        setError('Failed to retrieve application details.');
      }
    } catch (err) {
      setError(
        err.friendlyMessage || 'An error occurred while loading your application details.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplication();
  }, []);

  const handleDownloadPdf = async () => {
    if (!application) return;
    setDownloadingPdf(true);
    setDownloadSuccess(false);
    setError('');

    try {
      await applicationService.downloadPdf(application._id);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      setError(
        err.friendlyMessage || 'Failed to download PDF. Please check server status and try again.'
      );
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const formatShortDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };

  const formatBirthDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 space-y-4 bg-white font-sans">
        <Loader2 className="w-8 h-8 text-[#005aa9] animate-spin" />
        <p className="text-xs text-slate-600">Loading Visa Record...</p>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-white text-slate-800 font-[Arial,sans-serif]">
        <header className="bg-[#005aa9] h-[82px] px-16 flex items-center justify-between">
          <img 
            src={logo} 
            alt="Immigration New Zealand" 
            className="h-12 object-contain brightness-0 invert" 
          />
          <div className="text-white text-xs">
            Logged in: <span className="font-bold">{user?.email || 'User'}</span>
          </div>
        </header>
        <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
          <h1 className="text-2xl font-bold text-[#003399]">No Visa Record Found</h1>
          <p className="text-sm text-slate-600">
            Welcome, <strong>{user?.displayName}</strong>. No application record exists for your profile.
          </p>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-[#005aa9] text-white text-xs font-bold rounded"
          >
            Log Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#222222] font-[Arial,sans-serif] text-[13px] leading-[1.5] flex flex-col antialiased select-none">
      {/* Top Main Navy Header Bar */}
      <header className="bg-[#005aa9] h-[86px] px-[72px] flex items-center justify-between">
        <div className="flex items-center">
          <img 
            src={logo} 
            alt="Immigration New Zealand" 
            className="h-[52px] object-contain brightness-0 invert" 
          />
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="text-white/80 hover:text-white text-xs hover:underline cursor-pointer bg-transparent border-0"
        >
          Log out
        </button>
      </header>

      {/* Breadcrumb Bar */}
      <div className="bg-[#dbe6f1] h-[34px] px-[72px] text-[13px] text-[#003399] flex items-center gap-1.5 border-b border-[#c2d3e4]">
        <span className="text-[#003399] hover:underline cursor-pointer flex items-center gap-1">
          <svg className="w-3.5 h-3.5 fill-[#222222]" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l1.293 1.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          <span className="text-[#003399]">Home</span>
        </span>
        <span className="text-[#333333]">&gt;</span>
        <span className="text-[#003399] hover:underline cursor-pointer">VisaView</span>
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

        {/* Right Main Content */}
        <main className="flex-1 pt-6 pl-9 pr-12 max-w-[950px]">
          {/* Top Info Header Bar */}
          <div className="flex justify-between items-baseline text-[13px] mb-6">
            <div>
              <span className="text-[#333333]">Acting for:</span>{' '}
              <span className="font-bold text-[#222222]">Visa Verification Service</span>
            </div>
            <div className="text-[#333333] flex items-center gap-1.5">
              <span>Logged in: <span className="font-semibold">{user?.email}</span></span>
              <span className="text-[#888888]">|</span>
              <button
                type="button"
                onClick={handleLogout}
                className="text-[#003399] hover:underline cursor-pointer bg-transparent border-0 p-0 text-[13px] font-normal"
              >
                Log out
              </button>
            </div>
          </div>

          {/* Title and Explanatory Subtext */}
          <div className="space-y-2 mb-6">
            <h1 className="text-[28px] font-bold text-[#003399] tracking-tight leading-none mb-4">
              Visa Verification Enquiry
            </h1>
            <p className="text-[13px] text-[#222222]">
              Enter the details of the visa to be verified.
            </p>
            <p className="text-[13px] text-[#222222]">
              Please enter these details exactly as they appear in the visa holder's passport.
            </p>
          </div>

          {/* Notifications Banner */}
          {error && (
            <div className="p-2.5 mb-4 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between rounded-xs">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
              <button onClick={fetchApplication} className="underline font-bold flex items-center gap-1">
                <RefreshCw className="w-3 h-3" /> Retry
              </button>
            </div>
          )}

          {downloadSuccess && (
            <div className="p-2.5 mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 rounded-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Record downloaded successfully.</span>
            </div>
          )}

          {/* 2-Column Data Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1.5 text-[13px] mb-6">
            {/* Left Column */}
            <div className="space-y-1.5">
              <div className="flex items-baseline">
                <span className="w-[170px] text-[#222222] font-semibold">Family Name *</span>
                <span className="w-[220px] font-bold uppercase text-[#222222]">
                  {application.displayName || 'GAGANDEEP SINGH'}
                </span>
              </div>

              <div className="flex items-baseline">
                <span className="w-[170px] text-[#222222] font-semibold">Date of Birth</span>
                <span className="w-[220px] font-normal text-[#222222]">
                  {formatBirthDate(application.dateOfBirth)}
                </span>
              </div>

              <div className="flex items-baseline">
                <span className="w-[170px] text-[#222222] font-semibold">Gender</span>
                <span className="w-[220px] font-normal text-[#222222]">
                  {application.gender ? application.gender.charAt(0).toUpperCase() : 'M'}
                </span>
              </div>

              <div className="flex items-baseline">
                <span className="w-[170px] text-[#222222] font-semibold">Passport Nationality</span>
                <span className="w-[220px] font-normal text-[#222222]">
                  {application.nationality || 'India'}
                </span>
              </div>

              <div className="flex items-baseline">
                <span className="w-[170px] text-[#222222] font-semibold">Passport Number</span>
                <span className="w-[220px] font-normal text-[#222222]">
                  {application.passportNumber || 'V6416018'}
                </span>
              </div>

              <div className="flex items-baseline">
                <span className="w-[170px] text-[#222222] font-semibold">TNZ Client Number</span>
                <span className="w-[220px] font-normal text-[#222222]">
                  {application.tnzClientNumber || '89904285'}
                </span>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-1.5">
              <div className="flex items-baseline">
                <span className="w-[150px] text-[#222222] font-semibold">Visa Type</span>
                <span className="w-[200px] font-normal text-[#222222]">
                  {application.visaType || 'Visitor'}
                </span>
              </div>

              <div className="flex items-baseline">
                <span className="w-[150px] text-[#222222] font-semibold">Visa Start Date</span>
                <span className="w-[200px] font-normal text-[#222222]">
                  {formatShortDate(application.travelStartDate || application.createdAt)}
                </span>
              </div>

              <div className="flex items-baseline">
                <span className="w-[150px] text-[#222222] font-semibold">First Entry Before</span>
                <span className="w-[200px] font-normal text-[#222222]">
                  {application.firstEntryBefore || 'Not applicable'}
                </span>
              </div>

              <div className="flex items-baseline">
                <span className="w-[150px] text-[#222222] font-semibold">Number of Entries</span>
                <span className="w-[200px] font-normal text-[#222222]">
                  {application.entryType || 'Single'}
                </span>
              </div>

              <div className="flex items-baseline">
                <span className="w-[150px] text-[#222222] font-semibold">Expiry Date Travel</span>
                <span className="w-[200px] font-normal text-[#222222]">
                  {formatShortDate(application.travelEndDate)}
                </span>
              </div>

              <div className="flex items-baseline">
                <span className="w-[150px] text-[#222222] font-semibold">Visa Expiry</span>
                <span className="w-[200px] font-normal text-[#222222]">
                  {formatShortDate(application.travelEndDate)}
                </span>
              </div>
            </div>
          </div>

          {/* Visa Conditions Section */}
          <div className="space-y-1 mb-5">
            <h3 className="font-bold text-[13px] text-[#222222]">Visa Conditions</h3>
            <p className="text-[13px] text-[#222222] leading-[1.45] max-w-[780px]">
              {application.conditions ||
                'Stay subject to grant of entry permission. The holder may work remotely for overseas or clients. The holder shall not study for more than 3 months. In order to return to New Zealand, the holder must, at their own expense, hold an onward ticket to another country. The holder must not work in NZ. This visa allows multiple entry travel to New Zealand. Contact your local immigration office if you need further information. The holder must leave before visa expiry or face deportation.'}
            </p>
          </div>

          {/* Expiry Date / Valid as at Details */}
          <div className="space-y-1 mb-6 text-[13px]">
            <div className="flex items-baseline">
              <span className="w-[170px] text-[#222222] font-semibold">Expiry Date</span>
              <span className="font-normal text-[#222222]">
                {formatShortDate(application.travelEndDate)}
              </span>
            </div>
            <div className="flex items-baseline">
              <span className="w-[170px] text-[#222222] font-semibold">Valid as at</span>
              <span className="font-normal text-[#222222]">
                {formatShortDate(application.travelEndDate)}
              </span>
            </div>
          </div>

          {/* Legal Warning Notice */}
          <div className="text-[13px] text-[#222222] leading-[1.45] max-w-[780px] mb-6">
            <strong>Warning:</strong> If you download this visa information, you must ensure that you have understood and comply with the Privacy Act 2020, including with respect to the use, storage and disclosure of information contained in this document.
          </div>

          {/* Download Button */}
          <div className="mb-6">
            <button
              onClick={handleDownloadPdf}
              disabled={downloadingPdf}
              id="download-pdf-btn"
              className="px-4 py-1.5 bg-[#0066cc] hover:bg-[#0052a3] text-white text-[13px] font-bold rounded-[3px] transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {downloadingPdf ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Downloading...</span>
                </>
              ) : (
                <span>Download Record</span>
              )}
            </button>
          </div>

          {/* Unsolicited Advice Link */}
          <div className="pb-12">
            <a 
              href="#unsolicited" 
              onClick={(e) => e.preventDefault()} 
              className="text-[#003399] text-[13px] hover:underline"
            >
              Unsolicited advice? Why not tell us?
            </a>
          </div>
        </main>
      </div>
    </div>
  );
}
