import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  ChevronDown,
  ChevronUp,
  Search,
  X,
  Menu,
  LogOut,
  User as UserIcon,
  ArrowRight,
} from 'lucide-react';
import logo from '../assets/immegration.png';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Active dropdown state: 'visit' | 'study' | 'work' | 'live' | 'about' | null
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setActiveDropdown(null);
    navigate('/login');
  };

  const toggleDropdown = (key) => {
    setActiveDropdown((current) => (current === key ? null : key));
  };

  // Navigation structure
  const navItems = [
    {
      id: 'visit',
      title: 'Visit',
      subTitle: 'Toro',
      links: [
        [
          { name: 'Visitor Visa', href: '/#visit-visitor' },
          { name: 'Transit Visa', href: '/#visit-transit' },
          { name: 'Visa options for visiting', href: '/#visit-options' },
        ],
        [
          { name: 'Events & Tourism', href: '/#visit-tourism' },
          { name: 'Before you travel', href: '/#visit-travel' },
        ],
      ],
    },
    {
      id: 'study',
      title: 'Study',
      subTitle: 'Ako',
      links: [
        [
          { name: 'Student Visa', href: '/#study-visa' },
          { name: 'Post-study work visa', href: '/#study-work' },
        ],
        [
          { name: 'Working holiday visa', href: '/#study-working-holiday' },
          { name: 'Bring family when studying', href: '/#study-family' },
        ],
      ],
    },
    {
      id: 'work',
      title: 'Work',
      subTitle: 'Mahi',
      links: [
        [
          { name: 'Accredited Employer Work Visa', href: '/#work-aewv' },
          { name: 'Skilled Residence Visas', href: '/#work-skilled' },
        ],
        [
          { name: 'Working Holiday Visas', href: '/#work-holiday' },
          { name: 'Work in New Zealand', href: '/#work-nz' },
        ],
      ],
    },
    {
      id: 'live',
      title: 'Live',
      subTitle: 'Ora',
      links: [
        [
          { name: 'Resident Visas', href: '/#live-resident' },
          { name: 'Family Visas', href: '/#live-family' },
        ],
        [
          { name: 'Permanent Residence', href: '/#live-permanent' },
          { name: 'Active Investor Plus Visa', href: '/#live-investor' },
        ],
      ],
    },
    {
      id: 'about',
      title: 'About us',
      subTitle: '',
      links: [
        [
          { name: 'News centre', href: '/#news' },
          { name: 'How we work', href: '/#how-we-work' },
          { name: 'Our strategies and programmes', href: '/#strategies' },
          { name: 'International cooperation', href: '/#cooperation' },
          {
            name: 'Information for industry, embassies and consulates',
            href: '/#industry',
          },
        ],
        [
          { name: 'Research and statistics', href: '/#research' },
          { name: 'About this site', href: '/#about-site' },
          { name: 'Glossary', href: '/#glossary' },
          { name: 'Immigration policy and law', href: '/#policy-law' },
        ],
      ],
    },
  ];

  const currentActiveData = navItems.find((item) => item.id === activeDropdown);

  return (
    <header className="relative w-full bg-white font-['Open_Sans',-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,sans-serif] text-[#232833] z-50 select-none">
      <div className="max-w-[1240px] mx-auto px-6 lg:px-8">
        
        {/* Top Utility Row */}
        <div className="flex items-center justify-between pt-[22px] pb-[18px]">
          {/* Official Logo */}
          <Link to="/" className="flex items-center focus:outline-none" aria-label="New Zealand Immigration Home">
            <img
              src={logo}
              alt="New Zealand Immigration"
              className="h-[44px] w-auto object-contain block"
            />
          </Link>

          {/* Right Utility Navigation */}
          <div className="hidden md:flex items-center gap-[34px] text-[15px] font-normal tracking-normal text-[#232833]">
            <a
              href="/#process"
              className="hover:text-[#007ac9] hover:underline underline-offset-4 transition-colors"
            >
              Process to apply
            </a>
            <a
              href="/#employers"
              className="hover:text-[#007ac9] hover:underline underline-offset-4 transition-colors"
            >
              For employers
            </a>

            {/* Login Action (always matches screenshot exactly, never reverts or flickers on auth load) */}
            <Link
              to={user ? "/application" : "/login"}
              className="h-[38px] px-[24px] bg-[#007ac9] hover:bg-[#006cb3] text-white font-bold rounded-[3px] text-[15px] inline-flex items-center justify-center transition-colors shadow-xs cursor-pointer select-none"
            >
              Login
            </Link>
          </div>

          {/* Mobile menu trigger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-slate-800 hover:text-[#007ac9] focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>

        {/* Crisp Divider Line */}
        <div className="w-full h-[1px] bg-[#e1e4e8]" />

        {/* Primary Desktop Navigation Row */}
        <div className="hidden md:flex items-center justify-between pt-[14px] pb-[16px]">
          <nav className="flex items-center gap-[38px] lg:gap-[46px]">
            {navItems.map((item) => {
              const isOpen = activeDropdown === item.id;
              return (
                <div key={item.id} className="relative">
                  <button
                    onClick={() => toggleDropdown(item.id)}
                    className="flex items-center gap-1.5 focus:outline-none group text-left cursor-pointer"
                  >
                    <span className="font-bold text-[17px] text-[#232833] tracking-normal group-hover:text-[#007ac9] transition-colors">
                      {item.title}
                    </span>
                    {item.subTitle && (
                      <span className="font-normal text-[17px] text-[#556070] group-hover:text-[#007ac9] transition-colors ml-0.5">
                        {item.subTitle}
                      </span>
                    )}
                    {isOpen ? (
                      <ChevronUp className="w-[15px] h-[15px] text-[#232833] stroke-[2.2] ml-[2px]" />
                    ) : (
                      <ChevronDown className="w-[15px] h-[15px] text-[#232833] stroke-[2.2] ml-[2px]" />
                    )}
                  </button>

                  {/* Active Arrow Pointer matched to Screenshot */}
                  {isOpen && (
                    <div className="absolute left-1/2 -bottom-[17px] -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[10px] border-b-[#1c222d] z-50 pointer-events-none" />
                  )}
                </div>
              );
            })}
          </nav>

          {/* Search Button aligned with Login button above */}
          <button
            aria-label="Search"
            className="p-1 text-[#232833] hover:text-[#007ac9] transition-colors focus:outline-none cursor-pointer"
          >
            <Search className="w-[21px] h-[21px] stroke-[2]" />
          </button>
        </div>
      </div>

      {/* Expanded Dark Navy Mega Dropdown Menu */}
      {activeDropdown && currentActiveData && (
        <div
          className="hidden md:block w-full bg-[#1c222d] text-white shadow-2xl relative z-40 border-t border-[#1c222d]"
          onMouseLeave={() => setActiveDropdown(null)}
        >
          <div className="max-w-[1240px] mx-auto px-6 lg:px-8 py-12 relative">
            {/* Close Control */}
            <button
              onClick={() => setActiveDropdown(null)}
              className="absolute top-6 right-8 flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-slate-300 hover:text-white focus:outline-none cursor-pointer"
            >
              <span className="w-5 h-5 rounded-full border border-slate-400 flex items-center justify-center">
                <X className="w-3 h-3" />
              </span>
              <span>CLOSE</span>
            </button>

            <div className="grid grid-cols-12 gap-8 items-start pt-2">
              {/* Main Heading Column */}
              <div className="col-span-4 flex items-baseline gap-3 flex-wrap">
                <h2 className="text-[38px] font-bold text-white tracking-tight leading-none">
                  {currentActiveData.title}
                </h2>
                {currentActiveData.subTitle && (
                  <span className="text-[30px] font-normal text-slate-300 leading-none">
                    {currentActiveData.subTitle}
                  </span>
                )}
                <ArrowRight className="w-6 h-6 text-white ml-2 self-center stroke-[2.5]" />
              </div>

              {/* Column 1 Links */}
              <div className="col-span-4 space-y-3.5">
                {currentActiveData.links[0]?.map((link, idx) => (
                  <div key={idx}>
                    <a
                      href={link.href}
                      onClick={() => setActiveDropdown(null)}
                      className="text-[17px] font-bold text-white hover:underline underline-offset-4 tracking-normal block"
                    >
                      {link.name}
                    </a>
                  </div>
                ))}
              </div>

              {/* Column 2 Links */}
              <div className="col-span-4 space-y-3.5">
                {currentActiveData.links[1]?.map((link, idx) => (
                  <div key={idx}>
                    <a
                      href={link.href}
                      onClick={() => setActiveDropdown(null)}
                      className="text-[17px] font-bold text-white hover:underline underline-offset-4 tracking-normal block"
                    >
                      {link.name}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-6 pt-4 pb-6 space-y-4 shadow-xl">
          <div className="flex flex-col space-y-3">
            {navItems.map((item) => (
              <div key={item.id} className="border-b border-slate-100 pb-2">
                <button
                  onClick={() => toggleDropdown(item.id)}
                  className="w-full flex items-center justify-between text-left py-2 text-[17px] font-bold text-[#232833]"
                >
                  <span>
                    {item.title}{' '}
                    {item.subTitle && (
                      <span className="font-normal text-slate-500">
                        ({item.subTitle})
                      </span>
                    )}
                  </span>
                  {activeDropdown === item.id ? (
                    <ChevronUp className="w-5 h-5 text-slate-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-600" />
                  )}
                </button>

                {activeDropdown === item.id && (
                  <div className="pl-4 py-2 bg-slate-50 rounded space-y-2 mt-1">
                    {item.links.flat().map((link, idx) => (
                      <a
                        key={idx}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block text-sm font-semibold text-slate-700 hover:text-[#007ac9] py-1"
                      >
                        {link.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="pt-2 space-y-3">
            <a
              href="/#process"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-slate-800"
            >
              Process to apply
            </a>
            <a
              href="/#employers"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-slate-800"
            >
              For employers
            </a>

            <Link
              to={user ? "/application" : "/login"}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full block text-center py-2.5 bg-[#007ac9] text-white font-bold rounded-[3px] text-sm"
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}