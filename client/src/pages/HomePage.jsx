import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import {
  ShieldCheck,
  FileText,
  Clock,
  Download,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Globe2,
  Lock,
  Layers,
  AlertTriangle,
  BadgeAlert,
  Calendar,
  Compass,
} from 'lucide-react';

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      q: 'Is this an official government immigration website?',
      a: 'No. VisaPath Demo Portal is purely an educational software engineering project. It does not provide real visas, travel authorizations, or governmental processing. Clearly designated "DEMO — NOT AN OFFICIAL IMMIGRATION DOCUMENT" appears across all interfaces and generated files.',
    },
    {
      q: 'What kind of passport number should I enter?',
      a: 'Always use fictional or mock sample passport numbers (e.g., "FA1234567" or "DEMO-99201"). Do not submit real personal government identification documents.',
    },
    {
      q: 'Why does my application status start as "Pending"?',
      a: 'To accurately model production immigration portals, new applications are never automatically approved without administrative adjudication. They enter a "Pending" review state upon server-side creation.',
    },
    {
      q: 'How does the PDF generation work?',
      a: 'When you click "Download Demo PDF", the server dynamically pulls your authenticated MongoDB application record, validates ownership, and streams a structured PDF rendered using PDFKit with standard educational disclaimers.',
    },
    {
      q: 'How is authentication handled?',
      a: 'The system uses JSON Web Tokens (JWT) stored in HTTP-only cookies, combined with bcrypt salt 12 password hashing. Password hashes are never transmitted in API responses.',
    },
  ];

  return (
    <div className="w-full bg-[#f8fafc] min-h-screen">
      {/* New Zealand Immigration Navbar */}
      <Navbar />

      <div className="space-y-16 lg:space-y-24 py-8">
        {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white p-8 sm:p-12 lg:p-16 overflow-hidden shadow-2xl border border-slate-800">
          {/* Subtle geometric background accents (pure SVG/CSS, no external assets) */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            {/* Educational Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/90 border border-slate-700 text-xs font-semibold text-blue-300">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
              <span>Educational Software Architecture Demonstration</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Simulated Immigration Portal & Status Tracking
            </h1>

            <p className="text-slate-300 text-base sm:text-lg lg:text-xl font-normal leading-relaxed max-w-2xl">
              An educational full-stack workflow demonstrating multi-step registration,
              database persistence, JWT cookie security, and server-side PDF document generation.
            </p>

            {/* CTAs */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                to="/login"
                id="check-test-results-btn"
                className="px-6 py-3.5 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
              >
                <span>Check Test Results</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to={user ? '/application' : '/register'}
                className="px-6 py-3.5 rounded-xl text-sm font-semibold bg-slate-800/80 hover:bg-slate-800 text-slate-100 border border-slate-700 transition-colors flex items-center gap-2"
              >
                <span>{user ? 'View Active Application' : 'Start Demo Application'}</span>
              </Link>
            </div>

            {/* Discretion Notice */}
            <div className="pt-6 border-t border-slate-800/80 flex items-center gap-2.5 text-xs text-amber-300/90">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Educational Simulation:</strong> All records are fictional. Do not enter real personal passport data.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Highlights Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Zero-Trust Auth & Cookies
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Protected via HTTP-only JWT cookies, bcrypt salt 12 hashing, rate-limiting, and strict ownership checks.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Local MongoDB Persistence
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Applications and user credentials persist directly to your local MongoDB instance with strict schemas.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0">
              <Download className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Server-Side PDFKit Export
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Generates high-fidelity educational application summaries with watermarks and disclaimers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Information Section: Visa Categories & Rules */}
      <section id="eligibility" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
            Simulation Overview
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Supported Educational Visa Categories
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            The demonstration portal supports common visa classifications with predefined validation parameters.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'Visitor Visa (Default)',
              desc: 'For temporary tourism, visiting friends or family, or attending educational workshops.',
              badge: 'Multiple / Single Entry',
              conditions: 'No commercial employment permitted. Maximum simulated stay 90 days.',
            },
            {
              title: 'Student Visa',
              desc: 'Permits enrollment in certified simulated academic or vocational institutions.',
              badge: 'Study Authorization',
              conditions: 'Requires simulated proof of academic acceptance and financial support.',
            },
            {
              title: 'Business Visa',
              desc: 'Designed for temporary corporate meetings, conferences, or trade discussions.',
              badge: 'Commercial Meetings',
              conditions: 'Direct domestic employment or local market labor is strictly restricted.',
            },
            {
              title: 'Work Visa',
              desc: 'For simulated employer-sponsored skilled talent and specialist contractors.',
              badge: 'Skill Verified',
              conditions: 'Tied to designated sponsor and approved occupation codes.',
            },
            {
              title: 'Transit Visa',
              desc: 'Facilitates passage through simulated international travel hubs within 48 hours.',
              badge: 'Short Duration',
              conditions: 'Valid only for airside connection; departure confirmation mandatory.',
            },
            {
              title: 'Academic Exchange',
              desc: 'Tailored for visiting lecturers, educational researchers, and exchange fellows.',
              badge: 'Educational Protocol',
              conditions: 'Simulation research and academic collaboration only.',
            },
          ].map((cat) => (
            <div
              key={cat.title}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-slate-300 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                  {cat.badge}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">EDUCATIONAL</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{cat.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">{cat.desc}</p>
              <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                <strong className="text-slate-700">Conditions:</strong> {cat.conditions}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-slate-100/70 border-y border-slate-200 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-700 bg-white border border-slate-200 px-3 py-1 rounded-full">
              Application Lifecycle
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-3 tracking-tight">
              How the Demo Workflow Functions
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              From account initialization to official-style PDF retrieval in four secure steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {[
              {
                step: '01',
                title: 'Create Account',
                desc: 'Fill in your name and email with a secure password hashed via bcrypt on the backend.',
              },
              {
                step: '02',
                title: 'Declare Details',
                desc: 'Provide sample travel dates, fictional passport numbers, and visa preferences.',
              },
              {
                step: '03',
                title: 'Server Review',
                desc: 'The server generates a unique reference (VP-2026-XXXX) and saves status as Pending.',
              },
              {
                step: '04',
                title: 'Export PDF',
                desc: 'Download your server-rendered PDF receipt anytime from your authenticated dashboard.',
              },
            ].map((step, idx) => (
              <div key={step.step} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
                <div className="text-3xl font-extrabold text-blue-600 font-mono mb-2">
                  {step.step}
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs uppercase font-bold tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
            Frequently Asked Questions
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Educational Demo FAQs
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={faq.q}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? -1 : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-semibold text-slate-900 text-sm hover:bg-slate-50 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-6 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Box */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-center text-white border border-slate-800 space-y-6">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Ready to explore the educational application flow?
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto">
            Test registration, verify MongoDB records in real time, and download server-generated PDF records.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/register"
              className="px-6 py-3 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md transition-colors"
            >
              Start Step 1 Registration
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 rounded-xl text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              Log In to Existing Demo
            </Link>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
}

