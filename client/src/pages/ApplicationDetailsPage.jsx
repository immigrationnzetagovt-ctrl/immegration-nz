import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { applicationService } from '../services/applicationService';
import {
  FileText,
  Download,
  LogOut,
  Calendar,
  User,
  Globe2,
  Clock,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Plane,
  RefreshCw,
  FileQuestion,
  ExternalLink,
} from 'lucide-react';

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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 space-y-4">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <div className="text-center">
          <h2 className="text-base font-bold text-slate-800">
            Fetching application record...
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Querying local MongoDB for your authenticated profile
          </p>
        </div>
      </div>
    );
  }

  // Empty State: User is logged in but hasn't created an application yet
  if (!application) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-100">
          <FileQuestion className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            No Application on File
          </h1>
          <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            Welcome, <strong>{user?.displayName}</strong>. You have logged into the educational portal, but have not yet submitted a demo visa application.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            to="/register/step-2"
            className="px-6 py-3 rounded-xl text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-md transition-colors"
          >
            Complete Demo Application Form
          </Link>
          <button
            onClick={handleLogout}
            className="px-6 py-3 rounded-xl text-sm font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 transition-colors"
          >
            Log Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Prominent Educational Notice */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200/90 text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-bold tracking-wide uppercase text-amber-800">
              DEMO — NOT AN OFFICIAL IMMIGRATION DOCUMENT
            </h2>
            <p className="text-xs text-amber-700 mt-0.5">
              This simulated record exists for architectural demonstration only. All passport identifiers are fictional sample values.
            </p>
          </div>
        </div>
        <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-md bg-amber-200/70 text-amber-900 border border-amber-300 shrink-0">
          Simulated Record
        </span>
      </div>

      {/* Global Notifications */}
      {error && (
        <div
          role="alert"
          className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-center justify-between gap-3 animate-fadeIn"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchApplication}
            className="text-xs font-semibold text-red-700 hover:text-red-900 underline flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
      )}

      {downloadSuccess && (
        <div
          role="status"
          className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2.5 animate-fadeIn"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Demo PDF generated and downloaded successfully.</span>
        </div>
      )}

      {/* Application Overview Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Official Application Reference
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-mono tracking-tight mt-1 flex items-center gap-3">
              {application.applicationRef}
            </h1>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Created on {formatDate(application.createdAt)}</span>
            </p>
          </div>

          {/* Status Badge */}
          <div className="flex flex-col items-start sm:items-end gap-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Adjudication Status
            </span>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>{application.status}</span>
            </div>
            <span className="text-[10px] text-slate-400">
              Initial status strictly enforced as Pending
            </span>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Authenticated as <strong>{user?.email}</strong></span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleDownloadPdf}
              disabled={downloadingPdf}
              id="download-pdf-btn"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {downloadingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating PDFKit Document...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Demo PDF</span>
                </>
              )}
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 transition-colors"
            >
              <LogOut className="w-4 h-4 text-slate-500" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Applicant & Travel Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 1: Applicant Details */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <User className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">
              Applicant Personal Profile
            </h2>
          </div>

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-xs sm:text-sm">
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Full Display Name
              </dt>
              <dd className="font-bold text-slate-900 mt-0.5">
                {application.displayName}
              </dd>
            </div>

            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Declared Nationality
              </dt>
              <dd className="font-bold text-slate-900 mt-0.5">
                {application.nationality}
              </dd>
            </div>

            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Date of Birth
              </dt>
              <dd className="font-bold text-slate-900 mt-0.5">
                {formatDate(application.dateOfBirth)}
              </dd>
            </div>

            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Gender
              </dt>
              <dd className="font-bold text-slate-900 mt-0.5">
                {application.gender}
              </dd>
            </div>

            <div className="sm:col-span-2 pt-2 border-t border-slate-100">
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Fictional Passport Identifier
              </dt>
              <dd className="font-mono font-bold text-slate-900 mt-0.5 text-base flex items-center gap-2">
                <span>{application.passportNumber}</span>
                <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  Educational Sample
                </span>
              </dd>
            </div>
          </dl>
        </div>

        {/* Section 2: Visa & Travel Parameters */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <Plane className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">
              Visa & Travel Parameters
            </h2>
          </div>

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-xs sm:text-sm">
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Visa Category
              </dt>
              <dd className="font-bold text-blue-700 mt-0.5">
                {application.visaType}
              </dd>
            </div>

            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Entry Classification
              </dt>
              <dd className="font-bold text-slate-900 mt-0.5">
                {application.entryType}
              </dd>
            </div>

            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Travel Start Date
              </dt>
              <dd className="font-bold text-slate-900 mt-0.5">
                {formatDate(application.travelStartDate)}
              </dd>
            </div>

            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Travel End Date
              </dt>
              <dd className="font-bold text-slate-900 mt-0.5">
                {formatDate(application.travelEndDate)}
              </dd>
            </div>

            <div className="sm:col-span-2 pt-2 border-t border-slate-100">
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Conditions of Stay
              </dt>
              <dd className="text-slate-700 mt-0.5 leading-relaxed text-xs">
                {application.conditions || 'None specified.'}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Security & Ownership Technical Audit */}
      <div className="p-6 rounded-3xl bg-slate-100 border border-slate-200 text-xs text-slate-600 space-y-2">
        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Technical & Security Verification
        </h3>
        <p className="leading-relaxed">
          This page retrieves data dynamically via authenticated HTTP-only session cookies from MongoDB.
          Cross-user application tampering is prevented: requests for application records belonging to another
          user return HTTP 403 Forbidden.
        </p>
      </div>
    </div>
  );
}
