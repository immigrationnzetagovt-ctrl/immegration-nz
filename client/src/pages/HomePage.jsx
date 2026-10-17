import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import {
  ArrowRight,
  ChevronDown,
  ShieldAlert,
  FileCheck2,
  FileText,
  Compass,
} from 'lucide-react';

import heroPattern from '../assets/hero.png';
import visitImg from '../assets/visit.jpg';
import studyImg from '../assets/study.jpg';
import workImg from '../assets/work.jpg';
import liveImg from '../assets/live.jpg';

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // "Find a visa" interactive dropdown state
  const [selectedIntent, setSelectedIntent] = useState('select');
  const [intentDropdownOpen, setIntentDropdownOpen] = useState(false);

  const visaCategories = [
    { label: 'visit as a tourist or holiday', value: 'visit', href: '/register/step-2' },
    { label: 'study at an approved school or university', value: 'study', href: '/register/step-2' },
    { label: 'work for an accredited employer', value: 'work', href: '/register/step-2' },
    { label: 'live permanently with family or residence', value: 'live', href: '/register/step-2' },
    { label: 'transit through Auckland airport', value: 'transit', href: '/register/step-2' },
  ];

  const handleSelectIntent = (category) => {
    setSelectedIntent(category.label);
    setIntentDropdownOpen(false);
    navigate(category.href);
  };

  return (
    <div className="w-full bg-[#f8fafc] font-['Open_Sans',-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,sans-serif] text-[#232833] antialiased">
      {/* 1. Official New Zealand Immigration Navbar */}
      <Navbar />

      {/* 2. Hero Section (Screenshot 1 Match) */}
      <section className="relative w-full bg-[#002844] overflow-hidden text-white">
        {/* Background Māori Kowhaiwhai Pattern from hero.png on the right */}
        <div className="absolute right-0 top-0 bottom-0 w-full sm:w-1/2 lg:w-[48%] pointer-events-none opacity-45 mix-blend-screen flex items-center justify-end overflow-hidden">
          <img
            src={heroPattern}
            alt="Māori Pattern Accent"
            className="h-full w-auto max-w-none object-contain object-right"
          />
        </div>

        <div className="max-w-[1240px] mx-auto px-6 lg:px-8 py-16 sm:py-24 relative z-10">
          <div className="max-w-[640px] space-y-4">
            <p className="text-[16px] sm:text-[17px] font-semibold text-white/95 tracking-wide">
              Immigration New Zealand
            </p>
            <h1 className="text-[36px] sm:text-[46px] lg:text-[48px] font-bold text-white leading-[1.12] tracking-tight">
              Apply now to visit, study, work or live in New Zealand
            </h1>
          </div>
        </div>
      </section>

      {/* 3. Latest Announcements Section (Screenshot 1 & 2 Match) */}
      <section className="w-full bg-[#f4f6f8] border-b border-[#e1e4e8] py-14 sm:py-16">
        <div className="max-w-[1240px] mx-auto px-6 lg:px-8">
          {/* Header Row */}
          <div className="flex items-center justify-between gap-4 mb-8">
            <h2 className="text-[28px] sm:text-[34px] font-bold text-[#19232d] tracking-tight">
              Latest announcements
            </h2>
            <a
              href="#announcements"
              className="px-6 py-2.5 bg-[#007ac9] hover:bg-[#006cb3] text-white font-bold text-[15px] rounded-[3px] transition-colors shadow-xs shrink-0"
            >
              All announcements
            </a>
          </div>

          {/* Announcements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Announcement Card 1 */}
            <div className="bg-white rounded-[4px] border border-[#e1e4e8] p-7 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <span className="text-[13px] text-[#556070] block mb-2 font-normal">
                  15 Oct 2026
                </span>
                <h3 className="text-[18px] font-bold text-[#19232d] leading-snug mb-3 hover:text-[#007ac9] transition-colors cursor-pointer">
                  Planning summer travel? Submit your investment documents early
                </h3>
                <p className="text-[14px] text-[#42495a] leading-relaxed mb-6">
                  If you have received approval in principle for an Active Investor Plus or Parent Retirement
                  Resident Visa and plan to travel to New Zealand over the Christmas or summer holiday period, we encourage yo...
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="bg-[#e6f4fb] text-[#00609c] text-[13px] font-semibold px-3 py-1 rounded-[3px]">
                  Announcement
                </span>
                <span className="bg-[#e6f4fb] text-[#00609c] text-[13px] font-semibold px-3 py-1 rounded-[3px]">
                  Invest or start a business
                </span>
              </div>
            </div>

            {/* Announcement Card 2 */}
            <div className="bg-white rounded-[4px] border border-[#e1e4e8] p-7 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <span className="text-[13px] text-[#556070] block mb-2 font-normal">
                  13 Oct 2026
                </span>
                <h3 className="text-[18px] font-bold text-[#19232d] leading-snug mb-3 hover:text-[#007ac9] transition-colors cursor-pointer">
                  Simpler accommodation standards coming for RSE employers
                </h3>
                <p className="text-[14px] text-[#42495a] leading-relaxed mb-6">
                  Recognised Seasonal Employer (RSE) accommodation standards are being simplified
                  to give employers clearer, more flexible requirements while continuing to protect the wellbeing of RSE workers.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="bg-[#e6f4fb] text-[#00609c] text-[13px] font-semibold px-3 py-1 rounded-[3px]">
                  Announcement
                </span>
              </div>
            </div>

            {/* Announcement Card 3 */}
            <div className="bg-white rounded-[4px] border border-[#e1e4e8] p-7 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <span className="text-[13px] text-[#556070] block mb-2 font-normal">
                  7 Oct 2026
                </span>
                <h3 className="text-[18px] font-bold text-[#19232d] leading-snug mb-3 hover:text-[#007ac9] transition-colors cursor-pointer">
                  BNZ to join Immigration New Zealand's Funds Transfer Scheme
                </h3>
                <p className="text-[14px] text-[#42495a] leading-relaxed mb-6">
                  Eligible international students studying at a New Zealand university or polytechnic can now
                  choose Bank of New Zealand (BNZ) as a provider under Immigration New Zealand's Funds Transfer Scheme (FTS).
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="bg-[#e6f4fb] text-[#00609c] text-[13px] font-semibold px-3 py-1 rounded-[3px]">
                  Announcement
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Top Visas Section (Screenshot 3 Match) */}
      <section className="w-full bg-white py-14 sm:py-18">
        <div className="max-w-[1240px] mx-auto px-6 lg:px-8">
          <h2 className="text-[28px] sm:text-[34px] font-bold text-[#19232d] tracking-tight mb-8">
            Top visas
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Visa 1: Visitor Visa */}
            <Link
              to="/register/step-2"
              className="bg-white rounded-[4px] border border-[#e1e4e8] p-7 shadow-xs hover:border-[#007ac9] hover:shadow-md transition-all group block text-left"
            >
              <div className="flex items-start gap-4">
                <div className="w-7 h-7 text-[#007ac9] shrink-0 mt-0.5">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                    <rect x="3" y="4" width="18" height="16" rx="2" />
                    <circle cx="12" cy="10" r="2" />
                    <path d="M8 17h8" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-[20px] font-bold text-[#19232d] group-hover:text-[#007ac9] transition-colors mb-2">
                    Visitor Visa
                  </h3>
                  <p className="text-[14px] text-[#42495a] leading-relaxed">
                    People travelling on a passport from some countries must apply for a Visitor Visa
                    to visit New Zealand. You can stay for up to either 6 months or 9 months. You cannot work, but you can study for up to...
                  </p>
                </div>
              </div>
            </Link>

            {/* Top Visa 2: NZeTA */}
            <Link
              to="/register/step-2"
              className="bg-white rounded-[4px] border border-[#e1e4e8] p-7 shadow-xs hover:border-[#007ac9] hover:shadow-md transition-all group block text-left"
            >
              <div className="flex items-start gap-4">
                <div className="w-7 h-7 text-[#007ac9] shrink-0 mt-0.5">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                    <rect x="3" y="4" width="18" height="16" rx="2" />
                    <circle cx="12" cy="10" r="2" />
                    <path d="M8 17h8" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-[20px] font-bold text-[#19232d] group-hover:text-[#007ac9] transition-colors mb-2">
                    New Zealand Electronic Travel Authority (NZeTA)
                  </h3>
                  <p className="text-[14px] text-[#42495a] leading-relaxed">
                    Some people can use an NZeTA to travel to New Zealand without applying for a visa
                    first. This depends on your passport, how you are travelling and if you are visiting or only transiting.
                  </p>
                </div>
              </div>
            </Link>

            {/* Top Visa 3: Business Visitor Visa */}
            <Link
              to="/register/step-2"
              className="bg-white rounded-[4px] border border-[#e1e4e8] p-7 shadow-xs hover:border-[#007ac9] hover:shadow-md transition-all group block text-left"
            >
              <div className="flex items-start gap-4">
                <div className="w-7 h-7 text-[#007ac9] shrink-0 mt-0.5">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                    <rect x="3" y="4" width="18" height="16" rx="2" />
                    <circle cx="12" cy="10" r="2" />
                    <path d="M8 17h8" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-[20px] font-bold text-[#19232d] group-hover:text-[#007ac9] transition-colors mb-2">
                    Business Visitor Visa
                  </h3>
                  <p className="text-[14px] text-[#42495a] leading-relaxed">
                    Apply for this visa if you want to visit New Zealand for business reasons. You must have
                    enough money to live on while you are here or have the financial support of your employer.
                  </p>
                </div>
              </div>
            </Link>

            {/* Top Visa 4: Transit Visa */}
            <Link
              to="/register/step-2"
              className="bg-white rounded-[4px] border border-[#e1e4e8] p-7 shadow-xs hover:border-[#007ac9] hover:shadow-md transition-all group block text-left"
            >
              <div className="flex items-start gap-4">
                <div className="w-7 h-7 text-[#007ac9] shrink-0 mt-0.5">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                    <rect x="3" y="4" width="18" height="16" rx="2" />
                    <circle cx="12" cy="10" r="2" />
                    <path d="M8 17h8" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-[20px] font-bold text-[#19232d] group-hover:text-[#007ac9] transition-colors mb-2">
                    Transit Visa
                  </h3>
                  <p className="text-[14px] text-[#42495a] leading-relaxed">
                    If you are passing through Auckland International Airport you must have a Transit Visa
                    unless you already have a valid visa, are from a visa waiver country or transit visa waiver country, or are trave...
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. "Find a visa" Blue Banner (Screenshot 4 Match) */}
      <section className="relative w-full bg-[#007ac9] text-white py-14 sm:py-18 overflow-hidden">
        {/* Subtle decorative curves on right */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 pointer-events-none opacity-20">
          <svg viewBox="0 0 400 400" className="w-full h-full object-cover">
            <path d="M0,200 Q150,50 300,200 T600,200" fill="none" stroke="white" strokeWidth="8" />
            <path d="M0,250 Q150,100 300,250 T600,250" fill="none" stroke="white" strokeWidth="6" />
          </svg>
        </div>

        <div className="max-w-[1240px] mx-auto px-6 lg:px-8 relative z-10 space-y-4">
          <h2 className="text-[30px] sm:text-[34px] font-bold tracking-tight text-white">
            Find a visa
          </h2>

          <div className="flex flex-wrap items-baseline gap-2.5 text-[22px] sm:text-[28px] font-normal text-white">
            <span>I would like a New Zealand visa to</span>
            <div className="relative inline-block">
              <button
                type="button"
                onClick={() => setIntentDropdownOpen(!intentDropdownOpen)}
                className="underline underline-offset-8 decoration-white font-bold cursor-pointer inline-flex items-center gap-1.5 hover:text-white/90 focus:outline-none"
              >
                <span>{selectedIntent}</span>
                <ChevronDown className="w-6 h-6 stroke-[2.5]" />
              </button>

              {/* Interactive Popover */}
              {intentDropdownOpen && (
                <div className="absolute left-0 top-full mt-3 w-80 bg-white text-[#232833] rounded-[4px] shadow-2xl border border-slate-200 py-2 z-50 text-base font-normal">
                  {visaCategories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => handleSelectIntent(cat)}
                      className="w-full text-left px-4 py-2.5 hover:bg-[#e6f4fb] hover:text-[#007ac9] transition-colors text-sm font-semibold flex items-center justify-between"
                    >
                      <span>{cat.label}</span>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Four Categories Grid: Visit, Study, Work, Live (Screenshot 4 & 5 Match) */}
      <section className="w-full bg-white py-16 sm:py-20">
        <div className="max-w-[1240px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card 1: Visit */}
            <Link
              to="/register/step-2"
              className="bg-white rounded-[4px] overflow-hidden border border-[#e1e4e8] shadow-xs hover:shadow-lg transition-all group flex flex-col"
            >
              <div className="relative h-[280px] w-full overflow-hidden bg-slate-200">
                <img
                  src={visitImg}
                  alt="Visit New Zealand - Queenstown landscape"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-4 left-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-xs flex items-center justify-center text-white group-hover:bg-[#007ac9] transition-colors">
                  <ArrowRight className="w-5 h-5 stroke-[2.2]" />
                </div>
              </div>
              <div className="p-7 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-[22px] font-bold text-[#19232d] group-hover:text-[#007ac9] transition-colors mb-2">
                    Visit
                  </h3>
                  <p className="text-[14px] text-[#42495a] leading-relaxed">
                    Find visitor visas to visit Aotearoa New Zealand on holiday, business or a working holiday.
                  </p>
                </div>
              </div>
            </Link>

            {/* Card 2: Study */}
            <Link
              to="/register/step-2"
              className="bg-white rounded-[4px] overflow-hidden border border-[#e1e4e8] shadow-xs hover:shadow-lg transition-all group flex flex-col"
            >
              <div className="relative h-[280px] w-full overflow-hidden bg-slate-200">
                <img
                  src={studyImg}
                  alt="Study in New Zealand - Students on university campus"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-4 left-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-xs flex items-center justify-center text-white group-hover:bg-[#007ac9] transition-colors">
                  <ArrowRight className="w-5 h-5 stroke-[2.2]" />
                </div>
              </div>
              <div className="p-7 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-[22px] font-bold text-[#19232d] group-hover:text-[#007ac9] transition-colors mb-2">
                    Study
                  </h3>
                  <p className="text-[14px] text-[#42495a] leading-relaxed">
                    Find study visas to study in Aotearoa New Zealand. Education providers – learn about getting approval to be an approved education provider.
                  </p>
                </div>
              </div>
            </Link>

            {/* Card 3: Work */}
            <Link
              to="/register/step-2"
              className="bg-white rounded-[4px] overflow-hidden border border-[#e1e4e8] shadow-xs hover:shadow-lg transition-all group flex flex-col"
            >
              <div className="relative h-[280px] w-full overflow-hidden bg-slate-200">
                <img
                  src={workImg}
                  alt="Work in New Zealand - Technicians on hillside"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-4 left-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-xs flex items-center justify-center text-white group-hover:bg-[#007ac9] transition-colors">
                  <ArrowRight className="w-5 h-5 stroke-[2.2]" />
                </div>
              </div>
              <div className="p-7 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-[22px] font-bold text-[#19232d] group-hover:text-[#007ac9] transition-colors mb-2">
                    Work
                  </h3>
                  <p className="text-[14px] text-[#42495a] leading-relaxed">
                    Find visas and information about working in Aotearoa New Zealand. Employers – learn about hiring people from overseas and getting accredited.
                  </p>
                </div>
              </div>
            </Link>

            {/* Card 4: Live */}
            <Link
              to="/register/step-2"
              className="bg-white rounded-[4px] overflow-hidden border border-[#e1e4e8] shadow-xs hover:shadow-lg transition-all group flex flex-col"
            >
              <div className="relative h-[280px] w-full overflow-hidden bg-slate-200">
                <img
                  src={liveImg}
                  alt="Live in New Zealand - Family outside sunny home"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-4 left-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-xs flex items-center justify-center text-white group-hover:bg-[#007ac9] transition-colors">
                  <ArrowRight className="w-5 h-5 stroke-[2.2]" />
                </div>
              </div>
              <div className="p-7 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-[22px] font-bold text-[#19232d] group-hover:text-[#007ac9] transition-colors mb-2">
                    Live
                  </h3>
                  <p className="text-[14px] text-[#42495a] leading-relaxed">
                    Find visas to live in Aotearoa New Zealand. Get information about living here permanently and what life in Aotearoa is like.
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
