import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';
import {
  Calendar,
  MapPin,
  ArrowRight,
  Shield,
  Sparkles,
  Award,
  Users,
  TrendingUp,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Search,
  MessageSquare,
  FileText,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MOCK_CATEGORIES } from '../data/mockData';
import { Speaker } from '../types';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { CountdownTimer } from '../components/ui/CountdownTimer';
import { AnimatedCounter } from '../components/ui/AnimatedCounter';
import { EventCard } from '../components/events/EventCard';
import { SpeakerCard } from '../components/events/SpeakerCard';
import { SpeakerMarquee } from '../components/events/SpeakerMarquee';
import { SpeakerModal } from '../components/events/SpeakerModal';
import { AgendaTimeline } from '../components/events/AgendaTimeline';
import { GalleryLightbox } from '../components/events/GalleryLightbox';
import { EventHighlightMarquee } from '../components/events/EventHighlightMarquee';
import { formatDateRange, formatGHS } from '../lib/utils';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { events, speakers, sponsors } = useApp();
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Primary featured event
  const featuredEvent = events.find((e) => e.is_featured && !e.is_past) || events[0];

  // Upcoming published events
  const upcomingEvents = events.filter((e) => !e.is_past && e.status !== 'DRAFT');

  // Filtered upcoming events based on category tab
  const filteredEvents = upcomingEvents.filter((e) => {
    const matchesCat = selectedCategory === 'ALL' || e.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesQuery = searchQuery === '' || 
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  // Past events
  const pastEvents = events.filter((e) => e.is_past);

  // Gallery items aggregated from featured & past events
  const galleryItems = [
    ...(featuredEvent?.gallery || []),
    ...(pastEvents[0]?.gallery || []),
  ].slice(0, 8);

  // WordPress-style smooth scroll entrance variants
  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 32 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  };

  const cardVariant: Variants = {
    hidden: { opacity: 0, y: 28, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. CINEMATIC HERO SECTION (Matching User's Reference Screenshot) */}
      <section className="relative min-h-[92vh] flex items-center justify-start overflow-hidden bg-[#032616] text-white">
        {/* Full-width authentic conference banquet hall background image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=2400&q=90"
            alt="Chartered Institute of Bankers Ghana Conference Hall"
            className="w-full h-full object-cover object-center brightness-[0.52] contrast-105"
          />

          {/* Soft dark green tint on the left to ensure text legibility while letting the hall image show through */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#032616]/70 via-[#032616]/35 via-32% to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#021a0f]/35 via-transparent to-black/10" />

          {/* Connected Constellation Network Overlay matching the screenshot */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Constellation Nodes & Connecting Lines */}
            <g stroke="#22c55e" strokeWidth="0.75" fill="none">
              <line x1="15%" y1="20%" x2="28%" y2="28%" strokeDasharray="3 3" />
              <line x1="28%" y1="28%" x2="42%" y2="18%" />
              <line x1="42%" y1="18%" x2="58%" y2="25%" strokeDasharray="2 2" />
              <line x1="58%" y1="25%" x2="72%" y2="15%" />
              <line x1="72%" y1="15%" x2="88%" y2="24%" />
              <line x1="88%" y1="24%" x2="94%" y2="40%" />
              <line x1="28%" y1="28%" x2="22%" y2="45%" />
              <line x1="42%" y1="18%" x2="38%" y2="38%" />
              <line x1="58%" y1="25%" x2="62%" y2="48%" />
              <line x1="72%" y1="15%" x2="78%" y2="34%" />
              <line x1="78%" y1="34%" x2="88%" y2="52%" strokeDasharray="3 3" />
              <line x1="22%" y1="45%" x2="15%" y2="60%" />
              <line x1="38%" y1="38%" x2="48%" y2="55%" />
              <line x1="62%" y1="48%" x2="75%" y2="62%" />
              <line x1="88%" y1="52%" x2="95%" y2="68%" />
            </g>

            {/* Glowing Node Dots */}
            <g fill="#D4AF37">
              <circle cx="15%" cy="20%" r="3" className="animate-pulse" />
              <circle cx="28%" cy="28%" r="3.5" />
              <circle cx="42%" cy="18%" r="3" />
              <circle cx="58%" cy="25%" r="4" className="animate-ping opacity-75" />
              <circle cx="58%" cy="25%" r="3.5" />
              <circle cx="72%" cy="15%" r="3" />
              <circle cx="88%" cy="24%" r="4" />
              <circle cx="94%" cy="40%" r="3" />
              <circle cx="22%" cy="45%" r="3.5" />
              <circle cx="38%" cy="38%" r="3" />
              <circle cx="62%" cy="48%" r="4" />
              <circle cx="78%" cy="34%" r="3.5" />
              <circle cx="88%" cy="52%" r="3" />
              <circle cx="15%" cy="60%" r="3" />
              <circle cx="48%" cy="55%" r="3.5" />
              <circle cx="75%" cy="62%" r="3" />
              <circle cx="95%" cy="68%" r="3.5" />
            </g>
          </svg>
        </div>

        {/* Hero Content aligned left with expanded widescreen breathing room */}
        {/* Hero Content with 2-column layout: Left (Title/CTAs) & Right (Countdown Timer) */}
        <div className="relative z-10 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-28 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Title, Badge, Theme & Buttons (Left aligned on all screens) */}
            <div className="lg:col-span-7 space-y-6 text-left flex flex-col items-start w-full">
              {/* Top Date & Location Pill Badge (Left-aligned on mobile & desktop) */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center px-4 sm:px-5 py-2.5 sm:py-2 rounded-xl sm:rounded-full bg-[#008129] backdrop-blur-md text-xs sm:text-sm font-semibold text-white shadow-2xl mx-0 max-w-full"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-start gap-1.5 sm:gap-4 text-left">
                  <span className="flex items-center justify-start gap-1.5 text-white">
                    <Calendar className="w-4 h-4 text-emerald-200 shrink-0" />
                    <span>9th – 10th Nov, 2026</span>
                  </span>
                  <span className="hidden sm:block h-3 w-px bg-white/30" />
                  <span className="flex items-center justify-start gap-1.5 text-white">
                    <MapPin className="w-4 h-4 text-emerald-200 shrink-0" />
                    <span>Kempinski Hotel, Accra</span>
                  </span>
                </div>
              </motion.div>

              {/* Bold Headline (Left-aligned) */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="space-y-1 w-full text-left"
              >
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] xl:text-[64px] font-black font-display uppercase tracking-tight text-white leading-tight sm:leading-[1.03] text-left">
                  30TH NATIONAL <br className="hidden sm:inline" />
                  BANKING & ETHICS <br className="hidden sm:inline" />
                  CONFERENCE
                </h1>
              </motion.div>

              {/* Theme Text (Left-aligned) */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="max-w-2xl text-sm sm:text-base lg:text-lg text-slate-200 leading-relaxed text-left mx-0"
              >
                <span className="font-extrabold text-[#F5A623] mr-2">Theme:</span>
                <span>
                  Ethical Leadership & Sustainable Value in Modern Banking
                </span>
              </motion.div>

              {/* Two Action Buttons (Left-aligned, compact natural width) */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-row flex-wrap items-center justify-start gap-3 sm:gap-4 pt-2 sm:pt-4"
              >
                {/* Left Gradient Button: Register Now → */}
                <Link
                  to={`/events/${featuredEvent.slug}/register`}
                  className="w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-none bg-gradient-to-r from-[#088d01] via-[#72ac00] to-[#dccb00] hover:brightness-105 active:scale-95 text-white font-extrabold text-sm sm:text-base transition-all duration-200 shadow-xl text-center whitespace-nowrap"
                >
                  <span>Register Now</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </Link>

                {/* Right White Button: Sponsor / Exhibit */}
                <Link
                  to="/contact"
                  className="w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-none bg-white hover:bg-slate-100 text-cib-charcoal-950 font-bold text-sm sm:text-base transition-all duration-200 shadow-xl active:scale-95 text-center whitespace-nowrap"
                >
                  <span>Sponsor / Exhibit</span>
                </Link>
              </motion.div>
            </div>

            {/* Right Column: Countdown Timer Widget with Glassmorphic Background */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-5 flex justify-start lg:justify-end w-full mt-4 lg:mt-0"
            >
              <div className="bg-white/10 backdrop-blur-xl p-5 sm:p-7 rounded-none shadow-2xl flex flex-col items-center justify-center space-y-3 w-full max-w-sm sm:max-w-md mx-0 lg:mx-0">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FFE500] animate-ping" />
                  <span className="text-xs font-black uppercase tracking-widest text-[#FFE500]">
                    Official Countdown
                  </span>
                </div>
                <CountdownTimer
                  targetDateStr={featuredEvent.start_date}
                  endDateStr={featuredEvent.end_date}
                  variant="gold"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. KEY STATS BANNER */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"
        >
          {[
            { label: 'Expected Delegates', num: 650, suffix: '+', icon: Users },
            { label: 'Participating Banks', num: 25, suffix: '+', icon: Shield },
            { label: 'Accredited CPD Hours', num: 16, suffix: ' Hrs', icon: Award },
            { label: 'Keynotes & Panelists', num: 20, suffix: '+', icon: Sparkles },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                variants={cardVariant}
                whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.2 } }}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-[#008129]/30 transition-all duration-300 flex items-center gap-4 group cursor-default"
              >
                <div className="p-3 rounded-xl bg-cib-green-50 text-cib-green-800 group-hover:bg-[#008129] group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-sm">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-2xl font-black text-cib-charcoal-900 font-display">
                    <AnimatedCounter to={stat.num} suffix={stat.suffix} />
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* 4. UPCOMING PROGRAMMES & CALENDAR (Requirement #9 & #46) */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4"
        >
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#008129]">
              ACCREDITED CALENDAR
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-cib-charcoal-900 font-display">
              UPCOMING EVENTS
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-xl">
              Stay connected with the latest CIB Ghana programmes, masterclasses, and executive conferences.
            </p>
          </div>

          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#008129] hover:underline group"
          >
            <span>View All Events ({events.length})</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* Category Filter Pills */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
          className="flex items-center gap-2 overflow-x-auto w-full pb-2 scrollbar-none"
        >
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'ALL'
                ? 'bg-[#008129] text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
            }`}
          >
            All Programmes
          </button>
          {MOCK_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory.toLowerCase() === cat.name.toLowerCase()
                  ? 'bg-[#008129] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </motion.div>

        {/* Events Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {filteredEvents.map((evt) => (
            <motion.div
              key={evt.id}
              variants={cardVariant}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
            >
              <EventCard event={evt} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 5. WHY ATTEND SECTION (Requirement #11) */}
      <section className="bg-slate-50 py-20 border-y border-slate-200/80 overflow-hidden">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="text-left max-w-3xl space-y-2"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 font-display uppercase tracking-tight">
              Why Attend?
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-2xl">
              Gain practical industry knowledge, meet banking leaders, and advance your career.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              {
                title: 'CONNECT',
                description: 'Meet banking and financial professionals across commercial banks, regulators, fintechs, and development institutions.',
                icon: Users,
                color: 'text-[#008129]',
                bg: 'bg-emerald-50',
              },
              {
                title: 'LEARN',
                description: 'Gain practical industry knowledge, masterclasses on credit modelling, ESG investing, and AI-driven compliance.',
                icon: BookOpen,
                color: 'text-amber-600',
                bg: 'bg-amber-50',
              },
              {
                title: 'LEAD',
                description: 'Engage with industry leaders and decision-makers shaping monetary policy, banking supervision, and corporate governance.',
                icon: Shield,
                color: 'text-[#F20300]',
                bg: 'bg-rose-50',
              },
              {
                title: 'GROW',
                description: 'Build strategic relationships, earn mandatory CIB CPD credits, and advance your professional standing within the Institute.',
                icon: TrendingUp,
                color: 'text-emerald-700',
                bg: 'bg-emerald-50',
              },
            ].map((block, idx) => {
              const Icon = block.icon;
              return (
                <motion.div
                  key={idx}
                  variants={cardVariant}
                  whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.25 } }}
                  className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-card hover:shadow-2xl transition-all duration-300 space-y-4 group cursor-pointer"
                >
                  <div className={`w-12 h-12 rounded-xl ${block.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-6 h-6 ${block.color}`} />
                  </div>
                  <h3 className="text-xl font-extrabold text-cib-charcoal-900 font-display group-hover:text-[#008129] transition-colors">
                    {block.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {block.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* 6. SPEAKERS SECTION (Requirement #12) */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
        >
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#008129]">
              FACULTY & VOICES
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-cib-charcoal-900 font-display">
              MEET THE VOICES SHAPING THE INDUSTRY
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-xl">
              Distinguished regulators, bank chief executives, and international scholars leading the discourse at CIB Ghana forums.
            </p>
          </div>

          <Link
            to="/speakers"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#008129] hover:underline group"
          >
            <span>View All Speakers</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* Continuous Moving Speaker Track */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6 }}
          className="w-full"
        >
          <SpeakerMarquee
            speakers={speakers}
            onSelectSpeaker={(spk) => setSelectedSpeaker(spk)}
          />
        </motion.div>
      </section>

      {/* 7. INTERACTIVE AGENDA SECTION (Compact Height, Full-width Brand Red-to-Yellow Gradient Background) */}
      {featuredEvent?.agenda && featuredEvent.agenda.length > 0 && (
        <section className="w-full bg-gradient-to-r from-[#F20300] via-[#F86400] to-[#FFC400] py-8 sm:py-12 text-white">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={fadeInUp}
            className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6"
          >
            <div className="text-left max-w-3xl space-y-1.5">
              <span className="text-[11px] font-black uppercase tracking-widest text-yellow-200">
                PROGRAMME ITINERARY
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white font-display uppercase tracking-tight">
                CONFERENCE AGENDA
              </h2>
              <p className="text-white/95 text-xs sm:text-sm max-w-2xl font-medium">
                Explore keynotes, regulatory addresses, CEO panel debates, and executive sessions scheduled across the two-day summit.
              </p>
            </div>

            <div className="w-full">
              <AgendaTimeline
                sessions={featuredEvent.agenda}
                speakers={speakers}
                onSelectSpeaker={(spk) => setSelectedSpeaker(spk)}
              />
            </div>
          </motion.div>
        </section>
      )}

      {/* 8. EVENT HIGHLIGHTS & PHOTO STREAM (3-Row Infinite Marquee matching user's reference) */}
      <section className="w-full overflow-hidden space-y-6 sm:space-y-8 py-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
          className="text-center max-w-[1360px] mx-auto space-y-2 px-4 sm:px-6 lg:px-8"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-[#008129]">
            EXPLORE IMAGES & ARCHIVE
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-cib-charcoal-900 font-display">
            EVENT HIGHLIGHTS
          </h2>
          <p className="text-slate-600 text-sm">
            Capturing high-level deliberations, keynote moments, and fellowship from recent CIB Ghana summits.
          </p>
        </motion.div>

        {/* 3-Row Continuous Swiping Photo Marquee */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.7 }}
        >
          <EventHighlightMarquee />
        </motion.div>
      </section>

      {/* 9. PARTNERS & SPONSORS */}
      <section id="partners" className="bg-slate-50 py-16 border-t border-slate-200">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              INSTITUTIONAL PARTNERS
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-cib-charcoal-900 font-display mt-1">
              SUPPORTED BY LEADING FINANCIAL INSTITUTIONS
            </h3>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={staggerContainer}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 items-center"
          >
            {sponsors.map((sp) => (
              <motion.div
                key={sp.id}
                variants={cardVariant}
                whileHover={{ y: -5, scale: 1.05, transition: { duration: 0.2 } }}
                className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-[#008129]/30 transition-all flex flex-col items-center justify-center space-y-2 h-24 cursor-pointer"
              >
                <span className="text-xs font-bold text-cib-charcoal-900 text-center line-clamp-2">
                  {sp.name}
                </span>
                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">
                  {sp.tier}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Speaker Modal */}
      <SpeakerModal
        speaker={selectedSpeaker}
        isOpen={selectedSpeaker !== null}
        onClose={() => setSelectedSpeaker(null)}
        eventTitle={featuredEvent?.title}
      />
    </div>
  );
};
