import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Award, ExternalLink } from 'lucide-react';
import { CIB_LOGO_URL } from '../../data/mockData';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#064225] text-white">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* ROW 1: NEWSLETTER SUBSCRIPTION (Matching reference) */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 py-10 sm:py-12 border-b border-white/20">
          <div className="space-y-1.5 max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight">
              Subscribe to our Newsletter!
            </h3>
            <p className="text-white/85 text-sm sm:text-base">
              Sign up our newsletter to get update news, regulatory digests, and event briefings.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="flex items-stretch w-full lg:w-auto max-w-md">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full sm:w-80 px-4 py-3 bg-white text-slate-900 placeholder:text-slate-400 rounded-none text-sm outline-none focus:ring-2 focus:ring-[#F5A623]"
            />
            <button
              type="submit"
              className="px-8 py-3 bg-[#F5A623] hover:bg-[#e09618] text-white font-black uppercase tracking-wider rounded-none text-sm transition-all duration-150 whitespace-nowrap shadow-sm active:scale-95 shrink-0"
            >
              {subscribed ? 'Sent!' : 'Send'}
            </button>
          </form>
        </div>

        {/* ROW 2: LOGO & SOCIAL MEDIA (Matching reference) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 py-8">
          {/* Organization Brand Logo */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="bg-white px-4 py-2.5 inline-flex items-center gap-3 shadow-md">
              <img
                src={CIB_LOGO_URL}
                alt="Chartered Institute of Bankers Ghana"
                className="h-10 sm:h-11 w-auto object-contain"
              />
              <div>
                <div className="font-black text-slate-900 text-sm tracking-tight font-display leading-tight uppercase">
                  CIB Ghana Events
                </div>
                <div className="text-[11px] text-[#008129] font-bold tracking-wider">
                  Connect &bull; Learn &bull; Lead
                </div>
              </div>
            </div>
            <p className="text-xs text-white/80 max-w-md hidden md:block leading-relaxed">
              Discover upcoming events, high-impact training programmes, and executive gatherings shaping the ethical and digital future of Ghana&apos;s banking sector.
            </p>
          </div>

          {/* Social Media Icons */}
          <div className="flex items-center gap-4 text-white/80">
            {/* Facebook */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="w-9 h-9 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="w-9 h-9 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>

            {/* X / Twitter */}
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              aria-label="X"
              className="w-9 h-9 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="w-9 h-9 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>

            {/* YouTube */}
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
              className="w-9 h-9 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
          </div>
        </div>

        {/* ROW 3: 5 CONTENT COLUMNS (Matching reference layout with individual header underlines) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 pb-12 text-sm">
          {/* Column 1: Organization */}
          <div>
            <h4 className="font-bold text-white text-base">Organization</h4>
            <div className="h-[1px] bg-white/20 w-full my-3" />
            <ul className="space-y-2.5 text-white/85">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/speakers" className="hover:text-white transition-colors">
                  Our Team &amp; Faculty
                </Link>
              </li>
              <li>
                <a
                  href="https://cibgh.org/membership"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>Membership Services</span>
                  <ExternalLink className="w-3 h-3 text-white/70" />
                </a>
              </li>
              <li>
                <a
                  href="https://cibgh.org/education"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>Education &amp; Certification</span>
                  <ExternalLink className="w-3 h-3 text-white/70" />
                </a>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  Code of Banking Ethics
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Participation */}
          <div>
            <h4 className="font-bold text-white text-base">Participation</h4>
            <div className="h-[1px] bg-white/20 w-full my-3" />
            <ul className="space-y-2.5 text-white/85">
              <li>
                <Link to="/events" className="hover:text-white transition-colors">
                  Upcoming Events
                </Link>
              </li>
              <li>
                <Link to="/past-events" className="hover:text-white transition-colors">
                  Past Events Archive
                </Link>
              </li>
              <li>
                <Link to="/speakers" className="hover:text-white transition-colors">
                  Keynote Speakers
                </Link>
              </li>
              <li>
                <Link to="/resources" className="hover:text-white transition-colors">
                  Conference Resources
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-white transition-colors">
                  National Conferences
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Support & Legal */}
          <div>
            <h4 className="font-bold text-white text-base">Support &amp; Legal</h4>
            <div className="h-[1px] bg-white/20 w-full my-3" />
            <ul className="space-y-2.5 text-white/85">
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact Secretariat
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Portal Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Connect */}
          <div>
            <h4 className="font-bold text-white text-base">Connect</h4>
            <div className="h-[1px] bg-white/20 w-full my-3" />
            <ul className="space-y-2.5 text-white/85">
              <li>
                <a
                  href="https://cibgh.org"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>Main Portal</span>
                  <ExternalLink className="w-3 h-3 text-white/70" />
                </a>
              </li>
              <li>
                <a
                  href="https://mis.cibgh.org"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>Member MIS</span>
                  <ExternalLink className="w-3 h-3 text-white/70" />
                </a>
              </li>
              <li>
                <a
                  href="https://elearning.cibgh.org"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>E-Learning Campus</span>
                  <ExternalLink className="w-3 h-3 text-white/70" />
                </a>
              </li>
              <li>
                <Link to="/events" className="hover:text-white transition-colors">
                  Events Calendar
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-white transition-colors">
                  Photo Gallery &amp; Highlights
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Secretariat Contact (or Make an Impact) */}
          <div className="col-span-2 sm:col-span-1">
            <h4 className="font-bold text-white text-base">Secretariat Contact</h4>
            <div className="h-[1px] bg-white/20 w-full my-3" />
            <div className="space-y-3 text-white/85 text-xs sm:text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#FFE500] shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Okponglo-East Legon, Trinity Avenue, Accra, Ghana
                </span>
              </div>

              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-[#FFE500] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <a href="tel:0302541309" className="hover:text-white transition-colors block">
                    0302 541 309
                  </a>
                  <a href="tel:0302541308" className="hover:text-white transition-colors block">
                    0302 541 308
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-[#FFE500] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <a href="mailto:info@cibgh.org" className="hover:text-white transition-colors block">
                    info@cibgh.org
                  </a>
                  <a href="mailto:academic@cibgh.org" className="hover:text-white transition-colors block">
                    academic@cibgh.org
                  </a>
                </div>
              </div>

              <div className="pt-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-black/15 border border-white/20 text-[11px] text-[#FFE500] font-medium">
                  <Award className="w-3.5 h-3.5" />
                  <span>CPD Accredited Professional Learning</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ROW 4: BOTTOM COPYRIGHT SUB-FOOTER */}
        <div className="py-6 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/75">
          <p>
            &copy; {new Date().getFullYear()} Chartered Institute of Bankers, Ghana. All Rights Reserved.
          </p>
          <p className="text-white/70 text-center sm:text-right">
            Chartered by the Republic of Ghana under the Chartered Institute of Bankers Act, 2019 (Act 991).
          </p>
        </div>
      </div>
    </footer>
  );
};

