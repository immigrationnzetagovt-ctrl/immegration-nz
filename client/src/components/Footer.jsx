import React from 'react';
import { Compass, ShieldAlert, BookOpen, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 pb-12 border-b border-slate-800">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                VisaPath <span className="text-blue-400 font-normal">Demo Portal</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              A full-stack educational demonstration portal designed to illustrate full-lifecycle
              application workflows, authentication architecture, data isolation, and server-side PDF document generation.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs text-amber-300 font-medium">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Strictly an educational simulation. Not a government agency.</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Demo Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Portal Overview
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Check Test Results / Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition-colors">
                  Start Step 1 Registration
                </Link>
              </li>
              <li>
                <Link to="/application" className="hover:text-white transition-colors">
                  Application Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Technical Specs */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Architecture & Security
            </h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Node.js Express + MongoDB Persistence</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Secure HTTP-Only Cookie JWTs</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Bcrypt Salt 12 Password Hashing</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Server-Side PDFKit Generation</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Rate-Limited Auth Endpoints</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Bottom Banner */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © 2026 VisaPath Educational Portal. Built for software engineering demonstration.
            All passport numbers and names shown or generated are fictional.
          </p>
          <div className="flex items-center gap-4">
            <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-400 font-mono text-[11px] border border-slate-700">
              DEMO — NOT AN OFFICIAL IMMIGRATION DOCUMENT
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
