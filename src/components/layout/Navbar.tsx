import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  ChevronDown,
  User,
  Shield,
  ArrowUpRight,
  Sparkles,
  ExternalLink,
  Calendar,
  Layers
} from 'lucide-react';
import { CIB_LOGO_URL, DEMO_USERS } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [partnersDropdownOpen, setPartnersDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, setCurrentUser, registeredUserEmail } = useApp();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    setPartnersDropdownOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-slate-200 py-2'
          : 'bg-white border-b border-slate-100 shadow-sm py-2 sm:py-2.5'
      }`}
    >
      <div className="relative z-50 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center group focus:outline-none py-1 ml-0.5 sm:-ml-2 md:-ml-3.5">
            <img
              src="/cib-logo-navbar.png"
              alt="Chartered Institute of Bankers, Ghana"
              className="h-16 sm:h-18 md:h-20 w-auto object-contain group-hover:scale-105 transition-transform duration-200"
            />
          </Link>

          {/* Desktop Navigation Links - Large, Clear & Legible */}
          <nav className="hidden lg:flex items-center gap-1.5 xl:gap-3">
            {/* Home - Direct Link, No Dropdown */}
            <Link
              to="/"
              className={`px-2.5 xl:px-3 py-2 rounded-none text-base font-bold transition-colors ${
                isActive('/') ? 'text-[#008129] font-black' : 'text-slate-900 hover:text-[#008129]'
              }`}
            >
              Home
            </Link>

            {/* Programme */}
            <Link
              to="/events"
              className={`px-2.5 xl:px-3 py-2 rounded-none text-base font-bold transition-colors ${
                isActive('/events') ? 'text-[#008129] font-black' : 'text-slate-900 hover:text-[#008129]'
              }`}
            >
              Programme
            </Link>

            {/* Speakers */}
            <Link
              to="/speakers"
              className={`px-2.5 xl:px-3 py-2 rounded-none text-base font-bold transition-colors ${
                isActive('/speakers') ? 'text-[#008129] font-black' : 'text-slate-900 hover:text-[#008129]'
              }`}
            >
              Speakers
            </Link>

            {/* Partners & Sponsors with dropdown */}
            <div className="relative">
              <button
                onClick={() => setPartnersDropdownOpen(!partnersDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 xl:px-3 py-2 rounded-none text-base font-bold text-slate-900 hover:text-[#008129] transition-colors"
              >
                <span>Partners & Sponsors</span>
                <ChevronDown className="w-4 h-4 text-slate-600" />
              </button>
              {partnersDropdownOpen && (
                <div className="absolute left-0 mt-2 w-72 bg-white rounded-none shadow-2xl border border-slate-300 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <a
                    href="#partners"
                    onClick={() => setPartnersDropdownOpen(false)}
                    className="block px-4 py-3 rounded-none text-base font-bold text-slate-900 hover:bg-[#008129]/10 hover:text-[#008129] border-l-2 border-transparent hover:border-[#008129] transition-all"
                  >
                    Institutional Partners
                  </a>
                  <Link
                    to="/contact"
                    onClick={() => setPartnersDropdownOpen(false)}
                    className="block px-4 py-3 rounded-none text-base font-bold text-slate-900 hover:bg-[#008129]/10 hover:text-[#008129] border-l-2 border-transparent hover:border-[#008129] transition-all"
                  >
                    Become a Sponsor / Exhibitor
                  </Link>
                </div>
              )}
            </div>

            {/* News */}
            <Link
              to="/resources"
              className={`px-2.5 xl:px-3 py-2 rounded-none text-base font-bold transition-colors ${
                isActive('/resources') ? 'text-[#008129] font-black' : 'text-slate-900 hover:text-[#008129]'
              }`}
            >
              News
            </Link>
          </nav>

          {/* Right Action Cluster */}
          <div className="hidden sm:flex items-center gap-3">
            {registeredUserEmail ? (
              <Link
                to="/my-portal"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-none bg-gradient-to-r from-[#088d01] via-[#72ac00] to-[#dccb00] hover:brightness-105 active:scale-95 text-white font-extrabold text-sm sm:text-base transition-all duration-200 shadow-md"
              >
                <User className="w-4 h-4" />
                <span>My Portal</span>
              </Link>
            ) : (
              <Link
                to="/events/30th-national-banking-ethics-conference-2026/register"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-none bg-gradient-to-r from-[#088d01] via-[#72ac00] to-[#dccb00] hover:brightness-105 active:scale-95 text-white font-extrabold text-sm sm:text-base transition-all duration-200 shadow-md"
              >
                <span>Register Now</span>
                <ArrowUpRight className="w-4 h-4 text-white stroke-[2.5]" />
              </Link>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1 text-slate-950 bg-transparent border-0 shadow-none outline-none focus:outline-none active:opacity-70 transition-opacity"
              aria-label="Toggle Navigation Menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileMenuOpen ? (
                  <motion.div
                    key="close-icon"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X className="w-7 h-7 stroke-[2.85] text-slate-950" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu-icon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu className="w-7 h-7 stroke-[2.85] text-slate-950" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer Overlay (Pure solid white, overlays on top without pushing content down) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="mobile-menu-drawer"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute top-full left-0 right-0 z-50 bg-white border-t border-b border-slate-200 shadow-2xl px-4 sm:px-6 pt-3 pb-6 space-y-1.5 lg:hidden text-slate-900 max-h-[calc(100dvh-75px)] overflow-y-auto"
          >
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-4 py-3 rounded-none text-base font-bold transition-all ${
                isActive('/')
                  ? 'text-[#008129] font-black bg-slate-50 border-l-4 border-[#008129]'
                  : 'text-slate-900 hover:text-[#008129] hover:bg-slate-50 border-l-4 border-transparent'
              }`}
            >
              <span>Home</span>
            </Link>

            <Link
              to="/events"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-4 py-3 rounded-none text-base font-bold transition-all ${
                isActive('/events')
                  ? 'text-[#008129] font-black bg-slate-50 border-l-4 border-[#008129]'
                  : 'text-slate-900 hover:text-[#008129] hover:bg-slate-50 border-l-4 border-transparent'
              }`}
            >
              <span>Programme</span>
            </Link>

            <Link
              to="/speakers"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-4 py-3 rounded-none text-base font-bold transition-all ${
                isActive('/speakers')
                  ? 'text-[#008129] font-black bg-slate-50 border-l-4 border-[#008129]'
                  : 'text-slate-900 hover:text-[#008129] hover:bg-slate-50 border-l-4 border-transparent'
              }`}
            >
              <span>Speakers</span>
            </Link>

            {/* Partners & Sponsors with Expandable Submenu */}
            <div className="border-l-4 border-transparent">
              <button
                onClick={() => setPartnersDropdownOpen(!partnersDropdownOpen)}
                className="flex items-center justify-between w-full px-4 py-3 text-base font-bold text-slate-900 hover:text-[#008129] hover:bg-slate-50 transition-all"
              >
                <span>Partners & Sponsors</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    partnersDropdownOpen ? 'rotate-180 text-[#008129]' : 'text-slate-600'
                  }`}
                />
              </button>
              {partnersDropdownOpen && (
                <div className="pl-6 pr-2 py-1 space-y-1 bg-slate-50 border-l-2 border-[#008129]/30 ml-4 my-1">
                  <a
                    href="#partners"
                    onClick={() => {
                      setPartnersDropdownOpen(false);
                      setMobileMenuOpen(false);
                    }}
                    className="block px-3 py-2 text-sm font-semibold text-slate-800 hover:text-[#008129]"
                  >
                    Institutional Partners
                  </a>
                  <Link
                    to="/contact"
                    onClick={() => {
                      setPartnersDropdownOpen(false);
                      setMobileMenuOpen(false);
                    }}
                    className="block px-3 py-2 text-sm font-semibold text-slate-800 hover:text-[#008129]"
                  >
                    Become a Sponsor / Exhibitor
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/resources"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-4 py-3 rounded-none text-base font-bold transition-all ${
                isActive('/resources')
                  ? 'text-[#008129] font-black bg-slate-50 border-l-4 border-[#008129]'
                  : 'text-slate-900 hover:text-[#008129] hover:bg-slate-50 border-l-4 border-transparent'
              }`}
            >
              <span>News</span>
            </Link>

            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-4 py-3 rounded-none text-base font-bold transition-all ${
                isActive('/about')
                  ? 'text-[#008129] font-black bg-slate-50 border-l-4 border-[#008129]'
                  : 'text-slate-900 hover:text-[#008129] hover:bg-slate-50 border-l-4 border-transparent'
              }`}
            >
              <span>About CIB Ghana</span>
            </Link>

            <div className="pt-4 border-t border-slate-200 space-y-2">
              {registeredUserEmail ? (
                <Link
                  to="/my-portal"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-none bg-gradient-to-r from-[#088d01] via-[#72ac00] to-[#dccb00] hover:brightness-105 active:scale-95 text-white font-black text-base shadow-md transition-all"
                >
                  <User className="w-4 h-4" />
                  <span>My Portal</span>
                </Link>
              ) : (
                <Link
                  to="/events/30th-national-banking-ethics-conference-2026/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-none bg-gradient-to-r from-[#088d01] via-[#72ac00] to-[#dccb00] hover:brightness-105 active:scale-95 text-white font-black text-base shadow-md transition-all"
                >
                  <span>Register Now</span>
                  <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

