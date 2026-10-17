import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Navbar from "../components/Navbar";
import { ArrowRight, ChevronDown } from "lucide-react";

import heroPattern from "../assets/hero.png";
import visitImg from "../assets/visit.jpg";
import studyImg from "../assets/study.jpg";
import workImg from "../assets/work.jpg";
import liveImg from "../assets/live.jpg";
import { KoruArtwork } from "../components/DecorativeArtwork.jsx";

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // "Find a visa" interactive dropdown state
  const [selectedIntent, setSelectedIntent] = useState("select");
  const [intentDropdownOpen, setIntentDropdownOpen] = useState(false);

  const visaCategories = [
    {
      label: "visit as a tourist or holiday",
      value: "visit",
      href: "/register/step-2",
    },
    {
      label: "study at an approved school or university",
      value: "study",
      href: "/register/step-2",
    },
    {
      label: "work for an accredited employer",
      value: "work",
      href: "/register/step-2",
    },
    {
      label: "live permanently with family or residence",
      value: "live",
      href: "/register/step-2",
    },
    {
      label: "transit through Auckland airport",
      value: "transit",
      href: "/register/step-2",
    },
  ];

  const handleSelectIntent = (category) => {
    setSelectedIntent(category.label);
    setIntentDropdownOpen(false);
    navigate(category.href);
  };

  return (
    <div className="w-full bg-white font-sans text-[#232833] antialiased">
      {/* 1. Official New Zealand Immigration Navbar */}
      <Navbar />

      {/* 2. Hero Section */}
      <section className="relative w-full bg-[#002844] overflow-hidden text-white min-h-[380px] flex items-center">
        {/* Background Kowhaiwhai Pattern on the right */}
        <div className="absolute right-0 top-0 bottom-0 w-full sm:w-1/2 lg:w-[48%] pointer-events-none opacity-40 mix-blend-screen flex items-center justify-end overflow-hidden">
          {/* <img
            src={heroPattern}
            alt="Māori Pattern Accent"
            className="h-full w-auto max-w-none object-contain object-right"
          /> */}
          <KoruArtwork className="hero-pattern" />
        </div>

        <div className="max-w-[1280px] mx-auto px-6 sm:px-10 py-16 lg:py-20 relative z-10 w-full">
          <div className="max-w-[650px] space-y-3">
            <p className="text-[17px] font-semibold text-white tracking-wide">
              Immigration New Zealand
            </p>
            <h1 className="text-[38px] sm:text-[46px] lg:text-[48px] font-bold text-white leading-[1.12] tracking-tight">
              Apply now to visit, study, work or live in New Zealand
            </h1>
          </div>
        </div>
      </section>

      {/* 3. Latest Announcements Section */}
      <section className="w-full bg-[#f4f6f8] border-b border-[#e1e4e8] py-14 sm:py-16">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-10">
          {/* Header Row */}
          <div className="flex items-center justify-between gap-4 mb-8">
            <h2 className="text-[32px] sm:text-[36px] font-bold text-[#19232d] tracking-tight">
              Latest announcements
            </h2>
            <a
              href="#announcements"
              className="px-[22px] py-[10px] bg-[#007ac9] hover:bg-[#006cb3] text-white font-bold text-[15px] rounded-[3px] transition-colors shadow-xs shrink-0"
            >
              All announcements
            </a>
          </div>

          {/* Announcements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Announcement 1 */}
            <div className="bg-white rounded-[4px] border border-[#e1e4e8] p-7 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <span className="text-[13px] text-[#556070] block mb-3 font-normal">
                  15 Oct 2026
                </span>
                <h3 className="text-[18px] font-bold text-[#19232d] leading-[1.3] mb-3 hover:text-[#007ac9] transition-colors cursor-pointer">
                  Planning summer travel? Submit your investment documents early
                </h3>
                <p className="text-[14px] text-[#42495a] leading-[1.5] mb-6">
                  If you have received approval in principle for an Active
                  Investor Plus or Parent Retirement Resident Visa and plan to
                  travel to New Zealand over the Christmas or summer holiday
                  period, we encourage yo...
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

            {/* Announcement 2 */}
            <div className="bg-white rounded-[4px] border border-[#e1e4e8] p-7 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <span className="text-[13px] text-[#556070] block mb-3 font-normal">
                  13 Oct 2026
                </span>
                <h3 className="text-[18px] font-bold text-[#19232d] leading-[1.3] mb-3 hover:text-[#007ac9] transition-colors cursor-pointer">
                  Simpler accommodation standards coming for RSE employers
                </h3>
                <p className="text-[14px] text-[#42495a] leading-[1.5] mb-6">
                  Recognised Seasonal Employer (RSE) accommodation standards are
                  being simplified to give employers clearer, more flexible
                  requirements while continuing to protect the wellbeing of RSE
                  workers.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="bg-[#e6f4fb] text-[#00609c] text-[13px] font-semibold px-3 py-1 rounded-[3px]">
                  Announcement
                </span>
              </div>
            </div>

            {/* Announcement 3 */}
            <div className="bg-white rounded-[4px] border border-[#e1e4e8] p-7 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <span className="text-[13px] text-[#556070] block mb-3 font-normal">
                  7 Oct 2026
                </span>
                <h3 className="text-[18px] font-bold text-[#19232d] leading-[1.3] mb-3 hover:text-[#007ac9] transition-colors cursor-pointer">
                  BNZ to join Immigration New Zealand's Funds Transfer Scheme
                </h3>
                <p className="text-[14px] text-[#42495a] leading-[1.5] mb-6">
                  Eligible international students studying at a New Zealand
                  university or polytechnic can now choose Bank of New Zealand
                  (BNZ) as a provider under Immigration New Zealand's Funds
                  Transfer Scheme (FTS).
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

      {/* 4. Top Visas Section */}
      <section className="w-full bg-white py-14 sm:py-18">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-10">
          <h2 className="text-[32px] sm:text-[36px] font-bold text-[#19232d] tracking-tight mb-8">
            Top visas
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Visa 1: Visitor Visa */}
            <Link
              to="/register/step-2"
              className="bg-white rounded-[4px] border border-[#e1e4e8] p-7 shadow-xs hover:border-[#007ac9] transition-all group block text-left"
            >
              <div className="flex items-start gap-4">
                <div className="w-[38px] h-[38px] border-2 border-[#007ac9] rounded-[3px] flex flex-col items-center justify-center shrink-0 text-[#007ac9]">
                  <span className="text-[9px] font-bold leading-none uppercase tracking-tighter">
                    VISA
                  </span>
                  <div className="w-2.5 h-[1.5px] bg-[#007ac9] mt-0.5" />
                </div>
                <div>
                  <h3 className="text-[21px] font-bold text-[#19232d] group-hover:text-[#007ac9] transition-colors mb-2">
                    Visitor Visa
                  </h3>
                  <p className="text-[14px] text-[#42495a] leading-[1.5]">
                    People travelling on a passport from some countries must
                    apply for a Visitor Visa to visit New Zealand. You can stay
                    for up to either 6 months or 9 months. You cannot work, but
                    you can study for up to...
                  </p>
                </div>
              </div>
            </Link>

            {/* Top Visa 2: NZeTA */}
            <Link
              to="/register/step-2"
              className="bg-white rounded-[4px] border border-[#e1e4e8] p-7 shadow-xs hover:border-[#007ac9] transition-all group block text-left"
            >
              <div className="flex items-start gap-4">
                <div className="w-[38px] h-[38px] border-2 border-[#007ac9] rounded-[3px] flex flex-col items-center justify-center shrink-0 text-[#007ac9]">
                  <span className="text-[9px] font-bold leading-none uppercase tracking-tighter">
                    VISA
                  </span>
                  <div className="w-2.5 h-[1.5px] bg-[#007ac9] mt-0.5" />
                </div>
                <div>
                  <h3 className="text-[21px] font-bold text-[#19232d] group-hover:text-[#007ac9] transition-colors mb-2">
                    New Zealand Electronic Travel Authority (NZeTA)
                  </h3>
                  <p className="text-[14px] text-[#42495a] leading-[1.5]">
                    Some people can use an NZeTA to travel to New Zealand
                    without applying for a visa first. This depends on your
                    passport, how you are travelling and if you are visiting or
                    only transiting.
                  </p>
                </div>
              </div>
            </Link>

            {/* Top Visa 3: Business Visitor Visa */}
            <Link
              to="/register/step-2"
              className="bg-white rounded-[4px] border border-[#e1e4e8] p-7 shadow-xs hover:border-[#007ac9] transition-all group block text-left"
            >
              <div className="flex items-start gap-4">
                <div className="w-[38px] h-[38px] border-2 border-[#007ac9] rounded-[3px] flex flex-col items-center justify-center shrink-0 text-[#007ac9]">
                  <span className="text-[9px] font-bold leading-none uppercase tracking-tighter">
                    VISA
                  </span>
                  <div className="w-2.5 h-[1.5px] bg-[#007ac9] mt-0.5" />
                </div>
                <div>
                  <h3 className="text-[21px] font-bold text-[#19232d] group-hover:text-[#007ac9] transition-colors mb-2">
                    Business Visitor Visa
                  </h3>
                  <p className="text-[14px] text-[#42495a] leading-[1.5]">
                    Apply for this visa if you want to visit New Zealand for
                    business reasons. You must have enough money to live on
                    while you are here or have the financial support of your
                    employer.
                  </p>
                </div>
              </div>
            </Link>

            {/* Top Visa 4: Transit Visa */}
            <Link
              to="/register/step-2"
              className="bg-white rounded-[4px] border border-[#e1e4e8] p-7 shadow-xs hover:border-[#007ac9] transition-all group block text-left"
            >
              <div className="flex items-start gap-4">
                <div className="w-[38px] h-[38px] border-2 border-[#007ac9] rounded-[3px] flex flex-col items-center justify-center shrink-0 text-[#007ac9]">
                  <span className="text-[9px] font-bold leading-none uppercase tracking-tighter">
                    VISA
                  </span>
                  <div className="w-2.5 h-[1.5px] bg-[#007ac9] mt-0.5" />
                </div>
                <div>
                  <h3 className="text-[21px] font-bold text-[#19232d] group-hover:text-[#007ac9] transition-colors mb-2">
                    Transit Visa
                  </h3>
                  <p className="text-[14px] text-[#42495a] leading-[1.5]">
                    If you are passing through Auckland International Airport
                    you must have a Transit Visa unless you already have a valid
                    visa, are from a visa waiver country or transit visa waiver
                    country, or are trave...
                  </p>
                </div>
              </div>
            </Link>
            {/* Top Visa 4: Check e visa*/}
            <Link
              to="/register/step-2"
              className="bg-white rounded-[4px] border border-[#e1e4e8] p-7 shadow-xs hover:border-[#007ac9] transition-all group block text-left"
            >
              <div className="flex items-start gap-4">
                <div className="w-[38px] h-[38px] border-2 border-[#007ac9] rounded-[3px] flex flex-col items-center justify-center shrink-0 text-[#007ac9]">
                  <span className="text-[9px] font-bold leading-none uppercase tracking-tighter">
                    VISA
                  </span>
                  <div className="w-2.5 h-[1.5px] bg-[#007ac9] mt-0.5" />
                </div>
                <div>
                  <h3 className="text-[21px] font-bold text-[#19232d] group-hover:text-[#007ac9] transition-colors mb-2">
                    Check your e-visa
                  </h3>
                  <p className="text-[14px] text-[#42495a] leading-[1.5]">
                    Sign in securely to access your eVisa, review your visa
                    details, and check your current immigration status online.
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. "Find a visa" Blue Banner */}
      <section className="relative w-full bg-[#007ac9] text-white py-14 sm:py-18 overflow-hidden">
        {/* Subtle decorative curves on right */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 pointer-events-none opacity-20">
          <svg viewBox="0 0 400 400" className="w-full h-full object-cover">
            <path
              d="M0,200 Q150,50 300,200 T600,200"
              fill="none"
              stroke="white"
              strokeWidth="8"
            />
            <path
              d="M0,250 Q150,100 300,250 T600,250"
              fill="none"
              stroke="white"
              strokeWidth="6"
            />
          </svg>
        </div>

        <div className="max-w-[1280px] mx-auto px-6 sm:px-10 relative z-10 space-y-4">
          <h2 className="text-[32px] sm:text-[36px] font-bold tracking-tight text-white">
            Find a visa
          </h2>

          <div className="flex flex-wrap items-baseline gap-2.5 text-[24px] sm:text-[28px] font-normal text-white">
            <span>I would like a New Zealand visa to</span>
            <div className="relative inline-block">
              <button
                type="button"
                onClick={() => setIntentDropdownOpen(!intentDropdownOpen)}
                className="border-b-2 border-white pb-0.5 font-bold cursor-pointer inline-flex items-center gap-1.5 hover:opacity-90 focus:outline-none"
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

      {/* 6. Category Image Cards Section */}
      <section className="w-full bg-white py-16 sm:py-20">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card 1: Visit */}
            <Link
              to="/"
              className="bg-white rounded-[4px] overflow-hidden border border-[#e1e4e8] shadow-xs hover:border-[#007ac9] transition-all group flex flex-col"
            >
              <div className="relative h-[290px] w-full overflow-hidden bg-slate-100">
                <img
                  src={visitImg}
                  alt="Visit New Zealand - Queenstown landscape"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                />
                {/* White Arrow Overlay on Bottom-Left */}
                <div className="absolute bottom-6 left-6 text-white text-3xl font-light drop-shadow-md">
                  →
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-[26px] font-bold text-[#19232d] group-hover:text-[#007ac9] transition-colors mb-3">
                    Visit
                  </h3>
                  <p className="text-[15px] text-[#42495a] leading-[1.5]">
                    Find visitor visas to visit Aotearoa New Zealand on holiday,
                    business or a working holiday.
                  </p>
                </div>
              </div>
            </Link>

            {/* Card 2: Study */}
            <Link
              to="/"
              className="bg-white rounded-[4px] overflow-hidden border border-[#e1e4e8] shadow-xs hover:border-[#007ac9] transition-all group flex flex-col"
            >
              <div className="relative h-[290px] w-full overflow-hidden bg-slate-100">
                <img
                  src={studyImg}
                  alt="Study in New Zealand - Students on university campus"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                />
                {/* White Arrow Overlay on Bottom-Left */}
                <div className="absolute bottom-6 left-6 text-white text-3xl font-light drop-shadow-md">
                  →
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-[26px] font-bold text-[#19232d] group-hover:text-[#007ac9] transition-colors mb-3">
                    Study
                  </h3>
                  <p className="text-[15px] text-[#42495a] leading-[1.5]">
                    Find study visas to study in Aotearoa New Zealand. Education
                    providers – learn about getting approval to be an approved
                    education provider.
                  </p>
                </div>
              </div>
            </Link>

            {/* Card 3: Work */}
            <Link
              to="/"
              className="bg-white rounded-[4px] overflow-hidden border border-[#e1e4e8] shadow-xs hover:border-[#007ac9] transition-all group flex flex-col"
            >
              <div className="relative h-[290px] w-full overflow-hidden bg-slate-100">
                <img
                  src={workImg}
                  alt="Work in New Zealand - Technicians on hillside"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                />
                {/* White Arrow Overlay on Bottom-Left */}
                <div className="absolute bottom-6 left-6 text-white text-3xl font-light drop-shadow-md">
                  →
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-[26px] font-bold text-[#19232d] group-hover:text-[#007ac9] transition-colors mb-3">
                    Work
                  </h3>
                  <p className="text-[15px] text-[#42495a] leading-[1.5]">
                    Find visas and information about working in Aotearoa New
                    Zealand. Employers – learn about hiring people from overseas
                    and getting accredited.
                  </p>
                </div>
              </div>
            </Link>

            {/* Card 4: Live */}
            <Link
              to="/"
              className="bg-white rounded-[4px] overflow-hidden border border-[#e1e4e8] shadow-xs hover:border-[#007ac9] transition-all group flex flex-col"
            >
              <div className="relative h-[290px] w-full overflow-hidden bg-slate-100">
                <img
                  src={liveImg}
                  alt="Live in New Zealand - Family outside sunny home"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                />
                {/* White Arrow Overlay on Bottom-Left */}
                <div className="absolute bottom-6 left-6 text-white text-3xl font-light drop-shadow-md">
                  →
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-[26px] font-bold text-[#19232d] group-hover:text-[#007ac9] transition-colors mb-3">
                    Live
                  </h3>
                  <p className="text-[15px] text-[#42495a] leading-[1.5]">
                    Find visas to live in Aotearoa New Zealand. Get information
                    about living here permanently and what life in Aotearoa is
                    like.
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Footer Section */}
      <footer className="w-full bg-[#1c222d] text-white pt-16 pb-12">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start pb-16">
            {/* Visa Lookup Block */}
            <div className="md:col-span-5 space-y-4">
              <h2 className="text-[38px] font-extrabold text-white tracking-tight">
                Visa lookup
              </h2>
              <div className="relative max-w-md">
                <input
                  type="text"
                  placeholder="Visa lookup"
                  className="w-full bg-transparent border border-slate-400 text-white placeholder-slate-400 px-4 py-3 rounded-[3px] text-base focus:outline-none focus:border-white"
                />
              </div>
            </div>

            {/* Find & Compare Visas */}
            <div className="md:col-span-3 space-y-3 pt-2">
              <h3 className="text-[16px] font-bold text-white tracking-wide">
                Find and compare visas
              </h3>
              <ul className="space-y-2 text-[15px]">
                <li>
                  <a
                    href="/#visit"
                    className="border-b border-white hover:opacity-80"
                  >
                    Visit
                  </a>
                </li>
                <li>
                  <a
                    href="/#work"
                    className="border-b border-white hover:opacity-80"
                  >
                    Work
                  </a>
                </li>
                <li>
                  <a
                    href="/#study"
                    className="border-b border-white hover:opacity-80"
                  >
                    Study
                  </a>
                </li>
                <li>
                  <a
                    href="/#live"
                    className="border-b border-white hover:opacity-80"
                  >
                    Live
                  </a>
                </li>
                <li>
                  <a
                    href="/#all-visas"
                    className="border-b border-white hover:opacity-80"
                  >
                    All visas
                  </a>
                </li>
              </ul>
            </div>

            {/* Popular Information */}
            <div className="md:col-span-4 space-y-3 pt-2">
              <h3 className="text-[16px] font-bold text-white tracking-wide">
                Popular information
              </h3>
              <ul className="space-y-2 text-[15px]">
                <li>
                  <a
                    href="/#contact"
                    className="border-b border-white hover:opacity-80"
                  >
                    Contact us
                  </a>
                </li>
                <li>
                  <a
                    href="/#residence"
                    className="border-b border-white hover:opacity-80"
                  >
                    Residence
                  </a>
                </li>
                <li>
                  <a
                    href="/#checking-app"
                    className="border-b border-white hover:opacity-80"
                  >
                    Checking your application
                  </a>
                </li>
                <li>
                  <a
                    href="/#applying"
                    className="border-b border-white hover:opacity-80"
                  >
                    Applying for a visa
                  </a>
                </li>
                <li>
                  <a
                    href="/#documents"
                    className="border-b border-white hover:opacity-80"
                  >
                    Documents and proof
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Ministry Logos and Disclaimers */}
          <div className="border-t border-slate-700/80 pt-8 flex flex-wrap items-center justify-between gap-6 text-[14px] text-slate-300">
            <div className="flex items-center gap-6 flex-wrap">
              <span className="font-bold text-white text-[15px]">
                MINISTRY OF BUSINESS, INNOVATION & EMPLOYMENT
              </span>
            </div>

            <div className="flex items-center gap-6 flex-wrap text-slate-300">
              <a
                href="/#glossary"
                className="border-b border-slate-300 hover:text-white"
              >
                Glossary
              </a>
              <a
                href="/#accessibility"
                className="border-b border-slate-300 hover:text-white"
              >
                Accessibility
              </a>
              <a
                href="/#privacy"
                className="border-b border-slate-300 hover:text-white"
              >
                Privacy
              </a>
              <a
                href="/#terms"
                className="border-b border-slate-300 hover:text-white"
              >
                Terms of use
              </a>
              <a
                href="/#copyright"
                className="border-b border-slate-300 hover:text-white"
              >
                Copyright
              </a>
              <a
                href="/#cookies"
                className="border-b border-slate-300 hover:text-white"
              >
                Cookie preferences
              </a>
            </div>

            <div className="text-right text-xs text-slate-400 w-full sm:w-auto">
              Crown copyright © 2026
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
