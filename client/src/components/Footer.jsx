import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../assets/immegration.png';

export default function Footer() {
  return (
    <footer className="w-full bg-[#1c222d] text-slate-300 font-['Open_Sans',-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,sans-serif] text-sm border-t border-[#2d3442] mt-0">
      <div className="max-w-[1240px] mx-auto px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-700/60">
          {/* Logo & Educational Identity */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="New Zealand Immigration"
                className="h-[46px] w-auto object-contain brightness-0 invert opacity-90"
              />
            </div>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-md">
              Full-stack educational demonstration portal illustrating visa workflows,
              database persistence, and server-side PDF document generation.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-amber-950/40 border border-amber-600/40 text-xs text-amber-300 font-medium">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
              <span>DEMO — NOT AN OFFICIAL IMMIGRATION DOCUMENT</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Explore Portal
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link to="/register/step-2" className="hover:text-white transition-colors">
                  Apply for Demo Visa
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Login to Portal
                </Link>
              </li>
              <li>
                <Link to="/application" className="hover:text-white transition-colors">
                  My Application Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* About this site */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              About This Site
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400">
              <li>
                <a href="/#news" className="hover:text-white transition-colors">
                  News centre
                </a>
              </li>
              <li>
                <a href="/#how-we-work" className="hover:text-white transition-colors">
                  How we work
                </a>
              </li>
              <li>
                <a href="/#glossary" className="hover:text-white transition-colors">
                  Glossary
                </a>
              </li>
              <li>
                <a href="/#policy-law" className="hover:text-white transition-colors">
                  Immigration policy and law
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright notice */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © 2026 Educational Demonstration Project. All sample passport numbers and records are fictional.
          </p>
          <span className="px-2.5 py-1 rounded bg-[#272f3d] text-slate-400 text-[11px] font-mono border border-slate-700">
            DEMO — NOT AN OFFICIAL IMMIGRATION DOCUMENT
          </span>
        </div>
      </div>
    </footer>
  );
}
