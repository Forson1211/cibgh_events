import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { formatDateRange, formatGHS } from '../lib/utils';
import {
  Calendar,
  MapPin,
  Users,
  Award,
  CheckCircle2,
  FileDown,
  ExternalLink,
  Shield,
  Sparkles,
  ArrowRight,
  Clock,
  Layers,
  ChevronRight
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge, AttendanceTypeBadge, EventStatusBadge } from '../components/ui/Badge';
import { SpeakerCard } from '../components/events/SpeakerCard';
import { SpeakerModal } from '../components/events/SpeakerModal';
import { AgendaTimeline } from '../components/events/AgendaTimeline';
import { GalleryLightbox } from '../components/events/GalleryLightbox';
import { CountdownTimer } from '../components/ui/CountdownTimer';
import { Speaker } from '../types';

export const EventDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { getEventBySlug, speakers } = useApp();
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null);

  const event = slug ? getEventBySlug(slug) : undefined;

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-3xl font-bold text-cib-charcoal-900 font-display">
          Event Not Found
        </h2>
        <p className="text-slate-600">
          The event you are looking for may have been removed or is no longer available.
        </p>
        <Button variant="primary" size="md" onClick={() => navigate('/events')}>
          Back to All Events
        </Button>
      </div>
    );
  }

  const spotsLeft = Math.max(0, event.capacity - event.registered_count);
  const isRegistrationOpen = event.status === 'OPEN_FOR_REGISTRATION';

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. CINEMATIC EVENT HERO (Requirement #16 & #47) */}
      <section className="relative min-h-[75vh] flex items-center bg-cib-charcoal-950 text-white overflow-hidden">
        {/* Background Visual */}
        <div className="absolute inset-0 z-0">
          <img
            src={event.banner_image || event.featured_image}
            alt={event.title}
            className="w-full h-full object-cover brightness-[0.35] contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cib-charcoal-950 via-cib-charcoal-950/70 to-transparent" />
        </div>

        <div className="relative z-10 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-6">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to="/events" className="hover:text-white transition-colors">Events</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-cib-gold-400 truncate max-w-xs">{event.category}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="gold" size="md" className="bg-amber-400/20 text-cib-gold-300 border-cib-gold-400/30">
              {event.category}
            </Badge>
            <AttendanceTypeBadge type={event.event_type} />
            <EventStatusBadge status={event.status} />
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight text-white max-w-4xl leading-[1.12]">
            {event.title}
          </h1>

          {event.tagline && (
            <p className="text-base sm:text-xl text-emerald-200 font-medium max-w-3xl leading-relaxed">
              {event.tagline}
            </p>
          )}

          {/* Schedule & Location Pills */}
          <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm font-semibold text-slate-200 pt-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cib-gold-400" />
              <span>{formatDateRange(event.start_date, event.end_date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-cib-gold-400" />
              <span>{event.start_time} – {event.end_time} GMT</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cib-gold-400" />
              <span>{event.venue}, {event.location}</span>
            </div>
          </div>

          {/* Hero Action Row */}
          <div className="pt-4 flex flex-wrap items-center gap-4">
            {isRegistrationOpen && (
              <Button
                variant="accent"
                size="xl"
                showArrow
                onClick={() => navigate(`/events/${event.slug}/register`)}
              >
                Register Now &bull; {formatGHS(event.registration_fee)}
              </Button>
            )}
            <a
              href="#agenda"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-xl border border-white/20 hover:border-white text-white text-base font-bold transition-colors bg-white/5"
            >
              View Agenda
            </a>
          </div>
        </div>
      </section>

      {/* 2. ABOUT THE EVENT */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Description */}
          <div className="lg:col-span-8 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-cib-green-700">
                OVERVIEW
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-cib-charcoal-900 font-display">
                ABOUT THE EVENT
              </h2>
            </div>

            <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-4">
              {event.description.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="text-base sm:text-lg">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* KEY THEMES (Requirement #16) */}
            {event.themes && event.themes.length > 0 && (
              <div className="pt-6 space-y-4">
                <h3 className="text-lg font-bold text-cib-charcoal-900 font-display">
                  Core Conference Themes
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {event.themes.map((theme, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80"
                    >
                      <CheckCircle2 className="w-5 h-5 text-cib-green-700 shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm font-semibold text-slate-800">
                        {theme}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Registration Sidebar Card */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-card space-y-6">
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  Delegate Admission
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-cib-charcoal-900 font-display">
                    {formatGHS(event.registration_fee)}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">/ delegate</span>
                </div>
              </div>

              <div className="space-y-3 py-2 text-xs text-slate-600 border-y border-slate-100">
                <div className="flex items-center justify-between">
                  <span>Capacity</span>
                  <strong className="text-cib-charcoal-900">{event.capacity} seats</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Available Seats</span>
                  <strong className="text-cib-green-700">{spotsLeft} remaining</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>CPD Certification</span>
                  <strong className="text-cib-charcoal-900">Included</strong>
                </div>
              </div>

              {isRegistrationOpen ? (
                <Button
                  variant="accent"
                  size="lg"
                  className="w-full"
                  showArrow
                  onClick={() => navigate(`/events/${event.slug}/register`)}
                >
                  Register for Event
                </Button>
              ) : (
                <div className="p-3 bg-slate-100 text-slate-600 rounded-xl text-center text-xs font-bold">
                  Registration is currently closed
                </div>
              )}

              <p className="text-[11px] text-center text-slate-400">
                Member verification and instant digital ticket issuance upon checkout.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WHY ATTEND (Requirement #16) */}
      {event.why_attend && event.why_attend.length > 0 && (
        <section className="bg-slate-50 py-16 border-y border-slate-200/80">
          <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-cib-green-700">
                BENEFITS
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-cib-charcoal-900 font-display">
                WHY YOU SHOULD ATTEND
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {event.why_attend.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-cib-green-100 flex items-center justify-center text-cib-green-800 font-bold text-sm">
                    0{idx + 1}
                  </div>
                  <h4 className="text-base font-bold text-cib-charcoal-900 font-display">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. SPEAKERS SECTION */}
      {event.speakers && event.speakers.length > 0 && (
        <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-cib-green-700">
                CONFERENCE FACULTY
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-cib-charcoal-900 font-display">
                FEATURED SPEAKERS
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {event.speakers.map((spk) => (
              <SpeakerCard
                key={spk.id}
                speaker={spk}
                onSelect={(speaker) => setSelectedSpeaker(speaker)}
              />
            ))}
          </div>
        </section>
      )}

      {/* 5. INTERACTIVE AGENDA SECTION */}
      {event.agenda && event.agenda.length > 0 && (
        <section id="agenda" className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-24">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-cib-green-700">
              TIMETABLE
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-cib-charcoal-900 font-display">
              EVENT AGENDA
            </h2>
          </div>

          <AgendaTimeline
            sessions={event.agenda}
            speakers={event.speakers}
            onSelectSpeaker={(spk) => setSelectedSpeaker(spk)}
          />
        </section>
      )}

      {/* 6. VENUE DETAILS */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 overflow-hidden relative border border-slate-800">
          <div className="max-w-2xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-cib-gold-400">
              LOCATION & VENUE
            </span>
            <h3 className="text-2xl sm:text-4xl font-black font-display text-white">
              {event.venue}
            </h3>
            <p className="text-sm sm:text-base text-slate-300">
              {event.venue_address || `${event.location}, Ghana`}
            </p>
            <p className="text-xs text-slate-400 leading-relaxed pt-2">
              Onsite parking, translation booths, high-speed delegate Wi-Fi, and corporate accommodation rates are coordinated for registered CIB attendees.
            </p>
          </div>
        </div>
      </section>

      {/* 7. EVENT RESOURCES (Requirement #16 & #27) */}
      {event.resources && event.resources.length > 0 && (
        <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-cib-green-700">
              COLLATERAL & DOWNLOADS
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-cib-charcoal-900 font-display">
              EVENT RESOURCES
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {event.resources.map((res) => (
              <div
                key={res.id}
                className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-cib-green-300 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-cib-green-50 text-cib-green-800">
                    <FileDown className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-cib-charcoal-900">{res.title}</h5>
                    <p className="text-xs text-slate-500">{res.file_type} &bull; {res.file_size}</p>
                  </div>
                </div>

                <a
                  href={res.file_url}
                  className="p-2 rounded-lg bg-slate-100 hover:bg-cib-green-50 text-slate-600 hover:text-cib-green-800 text-xs font-bold transition-colors"
                  download
                >
                  Download
                </a>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 8. BOTTOM REGISTRATION CALL TO ACTION */}
      {isRegistrationOpen && (
        <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-cib-green-900 to-cib-charcoal-950 p-8 sm:p-12 rounded-3xl text-white text-center space-y-6 shadow-xl">
            <h2 className="text-2xl sm:text-4xl font-black font-display">
              Secure Your Seat at {event.title}
            </h2>
            <p className="max-w-xl mx-auto text-sm sm:text-base text-emerald-200">
              Join senior banking peers, regulatory heads, and ethical leaders. Limited delegate seats available.
            </p>
            <div>
              <Button
                variant="accent"
                size="xl"
                showArrow
                onClick={() => navigate(`/events/${event.slug}/register`)}
              >
                Proceed to Registration
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Sticky Mobile Registration Bar (Requirement #55) */}
      {isRegistrationOpen && (
        <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 z-40 flex items-center justify-between shadow-2xl">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Fee</span>
            <span className="text-base font-extrabold text-cib-charcoal-900">
              {formatGHS(event.registration_fee)}
            </span>
          </div>
          <Button
            variant="accent"
            size="md"
            showArrow
            onClick={() => navigate(`/events/${event.slug}/register`)}
          >
            Register Now
          </Button>
        </div>
      )}

      {/* Speaker Dossier Modal */}
      <SpeakerModal
        speaker={selectedSpeaker}
        isOpen={selectedSpeaker !== null}
        onClose={() => setSelectedSpeaker(null)}
        eventTitle={event.title}
      />
    </div>
  );
};
