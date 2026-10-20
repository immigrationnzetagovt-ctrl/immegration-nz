import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/immegration.png';
import liveImage from '../assets/live-family.jpg';
import studyImage from '../assets/study-students.jpg';
import visitImage from '../assets/visit-landscape.jpg';
import workImage from '../assets/work-workers.jpg';
import { FooterPattern, KoruArtwork } from '../components/DecorativeArtwork.jsx';

const announcements = [
  {
    id: 'rse-accommodation',
    date: '13 Oct 2026',
    title: 'Simpler accommodation standards coming for RSE employers',
    description: 'Recognised Seasonal Employer (RSE) accommodation standards are being simplified to give employers clearer, more flexible requirements while continuing to protect the wellbeing of RSE workers.',
    content: `
      Recognised Seasonal Employer (RSE) accommodation standards are being updated and simplified to give primary sector employers clearer, more flexible guidelines.
      
      Key reforms include:
      - Modernized space per worker rules reflecting flexible modern housing options.
      - Streamlined pre-season audit processes for returning accredited employers.
      - Stronger safeguards ensuring health, safety, and hygiene standards remain uncompromised.
    `,
    tags: ['Announcement'],
  },
  {
    id: 'bnz-funds-transfer',
    date: '7 Oct 2026',
    title: 'BNZ to join Immigration New Zealand’s Funds Transfer Scheme',
    description: 'Eligible international students studying at a New Zealand university or polytechnic can now choose Bank of New Zealand (BNZ) as a provider under Immigration New Zealand’s Funds Transfer Scheme (FTS).',
    content: `
      Bank of New Zealand (BNZ) has officially partnered with Immigration New Zealand under the Funds Transfer Scheme (FTS).
      
      This partnership allows international students from selected participating nations to securely deposit living expense funds with BNZ to satisfy student visa financial requirements.
    `,
    tags: ['Announcement'],
  },
  {
    id: 'parent-resident-hybrid',
    date: '5 Oct 2026',
    title: 'Parent Resident Visa category hybrid selection process now in place',
    description: 'From 5 October 2026, all valid Parent Resident Visa expressions of interest (EOIs) have moved into a single pool under the new hybrid selection model.',
    content: `
      Immigration New Zealand has implemented a new hybrid selection mechanism for Parent Resident Visa Expressions of Interest (EOIs).
      
      The update combines queue-based longevity with periodic ballot draws to offer a fairer selection process for sponsoring families across Aotearoa.
    `,
    tags: ['Announcement', 'Join or bring family'],
  },
];

const topVisas = [
  {
    title: 'Visitor Visa',
    description: 'People travelling on a passport from some countries must apply for a Visitor Visa to visit New Zealand. You can stay for up to either 6 months or 9 months. You cannot work, but you can study for up to...',
    link: '/visas',
  },
  {
    title: 'New Zealand Electronic Travel Authority (NZeTA)',
    description: 'Some people can use an NZeTA to travel to New Zealand without applying for a visa first. This depends on your passport, how you are travelling and if you are visiting or only transiting.',
    link: '/visas',
  },
  {
    title: 'Business Visitor Visa',
    description: 'Apply for this visa if you want to visit New Zealand for business reasons. You must have enough money to live on while you are here or have the financial support of your employer.',
    link: '/visas',
  },
  {
    title: 'Transit Visa',
    description: 'If you are passing through Auckland International Airport you must have a Transit Visa unless you already have a valid visa, are from a visa waiver country or transit visa waiver country, or are trave...',
    link: '/visas',
  },
  {
    title: 'Check your e-visa',
    description: 'Sign in securely to view your verified eVisa application record.',
    link: '/application',
  },
];

const journeys = [
  { title: 'Visit', image: visitImage, alt: 'Mountain lake and landscape', description: 'Find visitor visas to visit Aotearoa New Zealand on holiday, business or working holiday.' },
  { title: 'Study', image: studyImage, alt: 'Student at a graduation ceremony', description: 'Find study visas to study in Aotearoa New Zealand. Education providers – learn about getting approval as an education provider.' },
  { title: 'Work', image: workImage, alt: 'Workers on a construction site', description: 'Find visas and information about working in Aotearoa New Zealand. Employers – learn about hiring people from overseas.' },
  { title: 'Live', image: liveImage, alt: 'Family spending time together', description: 'Find visas to live in Aotearoa New Zealand. Get information about living here permanently and what life in New Zealand is like.' },
];

const VisaBadge = () => (
  <svg aria-hidden="true" viewBox="0 0 22 26" className="w-[20px] h-[24px] mt-0.5 fill-none stroke-[#1584ca] stroke-[1.2] shrink-0">
    <rect x="1" y="1" width="20" height="24" rx="1" />
    <circle cx="11" cy="11" r="5" />
    <path d="m8.5 11 1.7 1.7 3.6-4M6 20h10" />
  </svg>
);

export default function Home() {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeArticle, setActiveArticle] = useState(null);

  const megaMenuItems = {
    visit: {
      title: 'Visit',
      subTitle: 'Toro',
      linksLeft: [
        { name: 'Visas for visiting New Zealand', path: '/visas' },
        { name: 'Visitor Visa requirements', path: '/visas' },
        { name: 'NZeTA (Electronic Travel Authority)', path: '/visas' },
      ],
      linksRight: [
        { name: 'Transit visas', path: '/visas' },
        { name: 'Border entry rules', path: '/visas' },
      ],
    },
    study: {
      title: 'Study',
      subTitle: 'Ako',
      linksLeft: [
        { name: 'Student visas overview', path: '/study' },
        { name: 'Fee Paying Student Visa', path: '/study' },
      ],
      linksRight: [
        { name: 'Post-study work rights', path: '/study' },
        { name: 'Approved education providers', path: '/study' },
      ],
    },
    work: {
      title: 'Work',
      subTitle: 'Mahi',
      description: 'Find information about work visas and working in New Zealand. Employers can learn about hiring people from overseas.',
      linksLeft: [
        { name: 'Visas for working in New Zealand', path: '/work' },
        { name: 'Working holiday visas', path: '/work' },
        { name: 'Finding work in New Zealand', path: '/work' },
      ],
      linksRight: [
        { name: 'For employers', path: '/work' },
        { name: 'Worker rights', path: '/work' },
        { name: 'Protecting yourself from scams', path: '/work' },
      ],
    },
    live: {
      title: 'Live',
      subTitle: 'Ora',
      linksLeft: [
        { name: 'Residence visas overview', path: '/live' },
        { name: 'Skilled Resident Pathway', path: '/live' },
      ],
      linksRight: [
        { name: 'Living permanently in NZ', path: '/live' },
        { name: 'New Zealand Citizenship', path: '/live' },
      ],
    },
  };

  return (
    <div className="min-h-screen bg-white text-[#323849] font-sans antialiased selection:bg-[#087dc1] selection:text-white">
      {/* Site Header */}
      <header className="relative z-20 bg-white border-b border-[#cfd3da]">
        <div className="relative z-[3] max-w-[1450px] mx-auto px-6 lg:px-8">
          <div className="min-h-[96px] lg:min-h-[106px] flex items-center justify-between border-b border-[#d4d6db]">
            <Link to="/" className="inline-flex items-center w-[170px] lg:w-[205px]">
              <img src={logo} alt="Immigration New Zealand" className="block w-full h-auto" />
            </Link>

            <div className="flex items-center gap-8 text-[16px]">
              <span className="cursor-pointer hover:underline underline-offset-4">Process to apply</span>
              <span className="cursor-pointer hover:underline underline-offset-4">For employers</span>
              <button
                onClick={() => navigate('/login')}
                className="inline-flex items-center justify-center rounded-[4px] bg-[#087dc1] text-white font-bold min-w-[82px] min-h-[43px] hover:bg-[#056aa7] transition-colors"
              >
                Login
              </button>
            </div>
          </div>

          {/* Primary Navigation Bar */}
          <nav className="min-h-[79px] flex items-center justify-between">
            <div className="flex items-center gap-6 lg:gap-12">
              {Object.keys(megaMenuItems).map((key) => {
                const item = megaMenuItems[key];
                const isActive = activeMenu === key;
                return (
                  <button
                    key={key}
                    onClick={() => setActiveMenu(isActive ? null : key)}
                    className={`relative inline-flex items-center gap-2 border-0 bg-transparent text-[#323849] whitespace-nowrap text-[20px] cursor-pointer group py-2 ${
                      isActive ? 'underline underline-offset-[5px]' : ''
                    }`}
                  >
                    <strong className="font-bold">{item.title}</strong>
                    {item.subTitle && <span className="font-normal">{item.subTitle}</span>}
                    <svg
                      className={`w-[11px] h-[8px] fill-none stroke-current stroke-[1.8] transition-transform duration-160 ${
                        isActive ? 'rotate-180' : ''
                      }`}
                      viewBox="0 0 11 8"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="m1 1 4.5 5.5L10 1" />
                    </svg>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="w-[40px] h-[40px] inline-flex items-center justify-center border-0 bg-transparent text-[#30394c] cursor-pointer"
              aria-label="Search"
            >
              <svg className="w-[24px] h-[24px] fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path strokeLinecap="round" d="m21 21-4.35-4.35" />
              </svg>
            </button>
          </nav>

          {/* Search Dropdown Panel */}
          {searchOpen && (
            <div className="absolute top-full right-0 z-10 w-full max-w-[550px] p-6 border border-[#d4d6db] bg-white shadow-xl">
              <label htmlFor="search-input" className="block mb-2.5 font-bold">Search site</label>
              <div className="flex">
                <input
                  id="search-input"
                  type="text"
                  placeholder="Search visas, policy or news..."
                  className="min-w-0 flex-1 h-[44px] px-3 border border-[#858b95] outline-none"
                />
                <button type="button" className="px-5 border-0 bg-[#087dc1] text-white font-bold cursor-pointer">
                  Search
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mega Menu Overlay Dropdown */}
        {activeMenu && (
          <>
            <button
              className="fixed inset-0 z-10 w-full h-full bg-black/72 border-0 cursor-default p-0"
              onClick={() => setActiveMenu(null)}
              aria-label="Close menu overlay"
            />
            <div className="absolute z-20 top-full left-1/2 -translate-x-1/2 w-screen min-h-[360px] overflow-hidden px-[max(50px,calc((100vw-1400px)/2))] pt-[78px] pb-16 bg-[#20232d] text-white shadow-2xl animate-in fade-in duration-150">
              <button
                className="absolute top-6 right-[max(50px,calc((100vw-1400px)/2))] inline-flex items-center gap-2 border-0 bg-transparent text-white text-[11px] uppercase cursor-pointer"
                onClick={() => setActiveMenu(null)}
              >
                <span>Close</span>
                <svg className="w-[15px] h-[15px] fill-none stroke-current stroke-[1.2]" viewBox="0 0 15 15">
                  <path d="m2 2 11 11M13 2 2 13" />
                </svg>
              </button>

              <div className="relative grid grid-cols-1 md:grid-cols-[minmax(280px,1fr)_minmax(220px,0.8fr)_minmax(220px,0.8fr)] gap-12 max-w-[1400px] mx-auto">
                <div className="space-y-4">
                  <h2 className="flex items-center gap-2.5 m-0 text-[34px] font-bold leading-tight">
                    <span>{megaMenuItems[activeMenu].title}</span>
                    <span className="font-normal">{megaMenuItems[activeMenu].subTitle}</span>
                    <svg className="w-[21px] h-[15px] fill-none stroke-current stroke-[1.8]" viewBox="0 0 21 15">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m1 7.5 18 0M13.5 2l5.5 5.5-5.5 5.5" />
                    </svg>
                  </h2>
                  {megaMenuItems[activeMenu].description && (
                    <p className="max-w-[365px] m-0 text-[14px] leading-relaxed text-slate-300">
                      {megaMenuItems[activeMenu].description}
                    </p>
                  )}
                </div>

                <ul className="grid content-start gap-[22px] m-0 p-0 list-none">
                  {megaMenuItems[activeMenu].linksLeft.map((link, idx) => (
                    <li key={idx}>
                      <Link
                        to={link.path}
                        onClick={() => setActiveMenu(null)}
                        className="text-[15px] leading-snug font-bold underline underline-offset-3 hover:text-[#b8d9f2] transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>

                <ul className="grid content-start gap-[22px] m-0 p-0 list-none">
                  {megaMenuItems[activeMenu].linksRight.map((link, idx) => (
                    <li key={idx}>
                      <Link
                        to={link.path}
                        onClick={() => setActiveMenu(null)}
                        className="text-[15px] leading-snug font-bold underline underline-offset-3 hover:text-[#b8d9f2] transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}
      </header>

      {/* Main Content */}
      <main>
        {/* Hero Banner */}
        <section className="relative min-h-[374px] flex items-center overflow-hidden bg-[#062f59] text-white">
          <KoruArtwork className="absolute pointer-events-none top-0 right-0 w-[44vw] h-full text-[#0a4b7f] opacity-88" />
          <div className="relative z-10 w-[min(100%-100px,1400px)] mx-auto">
            <p className="m-0 mb-6 text-[16px] font-bold">Immigration New Zealand</p>
            <h1 className="max-w-[850px] m-0 text-[clamp(34px,3vw,56px)] font-bold leading-[1.12] tracking-[-0.35px]">
              Apply now to visit, study, work or<br className="hidden lg:inline" /> live in New Zealand
            </h1>
          </div>
        </section>

        {/* Announcements Section */}
        <section className="relative overflow-hidden py-10 lg:py-[38px] pb-[86px] bg-[#f2f2f2]">
          <div className="w-[min(100%-100px,1400px)] mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-6">
              <h2 className="m-0 text-[28px] font-bold leading-tight">Latest announcements</h2>
              <Link
                className="inline-flex items-center justify-center rounded-[4px] bg-[#087dc1] text-white font-bold min-h-[40px] px-[22px] text-[16px] hover:bg-[#056aa7] transition-colors w-fit"
                to="/about-us/news-centre"
              >
                All announcements
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-[26px]">
              {announcements.map((item) => (
                <article
                  className="min-h-[278px] flex flex-col p-6 lg:p-[30px_25px_26px] rounded-[3px] bg-white cursor-pointer hover:shadow-lg transition-shadow"
                  key={item.title}
                  onClick={() => setActiveArticle(item)}
                >
                  <p className="m-0 mb-3 text-[#5c6372] text-[12px]">{item.date}</p>
                  <h3 className="m-0 mb-2.5 text-[16px] font-bold leading-snug hover:underline underline-offset-3">
                    <span>{item.title}</span>
                  </h3>
                  <p className="m-0 mb-4 text-[14px] leading-relaxed text-slate-600">{item.description}</p>
                  <div className="flex flex-wrap gap-2.5 mt-auto">
                    {item.tags.map((tag) => (
                      <span className="inline-flex items-center min-h-[24px] px-2.5 py-0.5 rounded-[2px] bg-[#e8f3f9] text-[12px]" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Top Visas Section */}
        <section className="py-16 lg:py-[80px] pb-[82px] bg-white">
          <div className="w-[min(100%-100px,1400px)] mx-auto">
            <h2 className="m-0 mb-4 text-[28px] font-bold leading-tight">Top visas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {topVisas.map((visa) => (
                <Link
                  className="min-h-[152px] grid grid-cols-[22px_1fr] items-start gap-3 p-6 lg:p-[26px_24px] border border-[#d6d8dc] rounded-[4px] bg-white hover:border-[#c6c9ce] hover:shadow-[0_2px_10px_rgba(0,0,0,0.14)] transition-all"
                  to={visa.link}
                  key={visa.title}
                >
                  <VisaBadge />
                  <div>
                    <h3 className="m-0 mb-2.5 text-[18px] font-bold leading-snug hover:underline underline-offset-3">{visa.title}</h3>
                    <p className="m-0 text-[14px] leading-relaxed text-slate-600">{visa.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Find a Visa Section */}
        <section className="relative min-h-[222px] overflow-hidden py-12 lg:py-[60px] pb-[38px] bg-[#117fc2] text-white">
          <div className="w-[min(100%-100px,1400px)] mx-auto">
            <h2 className="m-0 mb-6 text-[28px] font-bold leading-tight">Find a visa</h2>
            <label className="inline-flex flex-col sm:flex-row sm:items-baseline gap-3 text-[22px]">
              <span>I would like a New Zealand visa to</span>
              <select
                defaultValue=""
                aria-label="Choose what you want to do in New Zealand"
                className="max-w-[180px] pb-1 border-0 border-b border-white/80 rounded-none bg-transparent text-white font-bold cursor-pointer outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#117fc2]"
              >
                <option value="" disabled className="text-[#323849]">select</option>
                <option value="visit" className="text-[#323849]">visit</option>
                <option value="study" className="text-[#323849]">study</option>
                <option value="work" className="text-[#323849]">work</option>
                <option value="live" className="text-[#323849]">live</option>
              </select>
            </label>
          </div>
        </section>

        {/* Journeys Grid Section */}
        <section className="py-16 lg:py-[82px] pb-[86px] bg-white">
          <div className="w-[min(100%-100px,1400px)] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-[26px_24px]">
              {journeys.map((journey) => (
                <Link
                  className="overflow-hidden border border-[#e0e1e4] rounded-[4px] bg-white hover:shadow-lg transition-shadow group"
                  to={`/${journey.title.toLowerCase()}`}
                  key={journey.title}
                >
                  <div className="relative h-[260px] lg:h-[310px] overflow-hidden bg-[#dce7ec]">
                    <img src={journey.image} alt={journey.alt} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <span className="absolute z-10 bottom-5 left-6 text-white text-[50px] font-light leading-none" aria-hidden="true">
                      →
                    </span>
                  </div>
                  <div className="min-h-[112px] p-5 lg:p-[20px_24px_22px]">
                    <h3 className="m-0 mb-2 text-[18px] font-bold">{journey.title}</h3>
                    <p className="m-0 text-[14px] leading-relaxed text-slate-600">{journey.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Article Detail Modal View */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-[6px] max-w-2xl w-full max-h-[85vh] overflow-y-auto p-8 space-y-4 text-slate-800 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setActiveArticle(null)}
              className="absolute top-4 right-4 text-slate-500 hover:text-black font-bold text-lg border-0 bg-transparent cursor-pointer"
            >
              ✕
            </button>
            <p className="text-xs text-slate-500">{activeArticle.date}</p>
            <h2 className="text-2xl font-bold text-[#062f59]">{activeArticle.title}</h2>
            <div className="text-sm leading-relaxed whitespace-pre-line border-t border-slate-200 pt-4">
              {activeArticle.content}
            </div>
            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setActiveArticle(null)}
                className="px-4 py-2 bg-[#087dc1] text-white font-bold text-xs rounded-[4px] hover:bg-[#056aa7] transition-colors cursor-pointer border-0"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative overflow-hidden min-h-[475px] py-14 lg:py-[68px] pb-[26px] bg-[#323849] text-white">
        <FooterPattern className="absolute inset-0 w-full h-full pointer-events-none opacity-55 text-[#2c3343]" />
        <div className="w-[min(100%-100px,1400px)] mx-auto grid grid-cols-1 lg:grid-cols-[minmax(300px,1.65fr)_1fr] gap-10 lg:gap-[56px] relative z-10">
          <div className="space-y-5">
            <h2 className="m-0 text-[32px] lg:text-[36px] font-bold leading-tight">Visa lookup</h2>
            <input
              aria-label="Visa lookup"
              placeholder="Visa lookup"
              className="w-full max-w-[429px] h-[38px] px-2.5 border border-[#aeb3c0] bg-transparent text-white placeholder-[#d8dbe2] text-[14px] outline-none"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-10">
            <div className="space-y-3">
              <h3 className="m-0 mb-3 text-[13px] font-bold">Find and compare visas</h3>
              <Link to="/visit" className="block w-fit mb-2 text-[12px] hover:underline">Visit</Link>
              <Link to="/work" className="block w-fit mb-2 text-[12px] hover:underline">Work</Link>
              <Link to="/study" className="block w-fit mb-2 text-[12px] hover:underline">Study</Link>
              <Link to="/live" className="block w-fit mb-2 text-[12px] hover:underline">Live</Link>
              <Link to="/visas" className="block w-fit mb-2 text-[12px] hover:underline">All visas</Link>
            </div>
            <div className="space-y-3">
              <h3 className="m-0 mb-3 text-[13px] font-bold">Popular information</h3>
              <Link to="/contact" className="block w-fit mb-2 text-[12px] hover:underline">Contact us</Link>
              <Link to="/residents" className="block w-fit mb-2 text-[12px] hover:underline">Residents</Link>
              <Link to="/apply" className="block w-fit mb-2 text-[12px] hover:underline">Checking your visa application</Link>
              <Link to="/apply" className="block w-fit mb-2 text-[12px] hover:underline">Applying for a visa</Link>
              <Link to="/documents" className="block w-fit mb-2 text-[12px] hover:underline">Documents and proof</Link>
            </div>
          </div>
          <div className="col-span-full grid gap-0 mt-6 text-[11px]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between min-h-[100px] pb-4.5 border-b border-white/35 text-[12px] font-bold gap-4">
              <span>
                Ministry of Business,
                <br />
                Innovation &amp; Employment
              </span>
              <span>
                New Zealand Government
                <br />
                Te Kāwanatanga o Aotearoa
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-5 text-[11px]">
              <nav aria-label="Footer links" className="flex flex-wrap gap-4">
                <Link to="/about" className="hover:underline">Glossary</Link>
                <Link to="/accessibility" className="hover:underline">Accessibility</Link>
                <Link to="/privacy" className="hover:underline">Privacy</Link>
                <Link to="/terms" className="hover:underline">Terms of use</Link>
                <Link to="/copyright" className="hover:underline">Copyright</Link>
                <Link to="/cookies" className="hover:underline">Cookie preferences</Link>
              </nav>
              <small className="whitespace-nowrap">Crown copyright © 2026</small>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
