import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, ArrowRight, Sparkles } from 'lucide-react';
import { EventItem } from '../../types';
import { formatDateRange, formatGHS } from '../../lib/utils';
import { Badge, EventStatusBadge, AttendanceTypeBadge } from '../ui/Badge';

interface EventCardProps {
  event: EventItem;
  featured?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({ event, featured = false }) => {
  const spotsLeft = Math.max(0, event.capacity - event.registered_count);
  const isSoldOut = spotsLeft === 0;

  return (
    <article
      className={`group relative flex flex-col bg-white rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden ${
        featured ? 'ring-2 ring-cib-gold-400' : ''
      }`}
    >
      {/* Event Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <img
          src={event.featured_image}
          alt={event.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <Badge variant="green" size="sm" className="bg-white/90 backdrop-blur-md text-cib-green-900 border-none font-bold">
            {event.category}
          </Badge>
          {event.is_featured && (
            <Badge variant="gold" size="sm" className="bg-amber-400/90 backdrop-blur-md text-slate-900 border-none font-bold">
              <Sparkles className="w-3 h-3 text-amber-900" />
              Featured
            </Badge>
          )}
        </div>

        {/* Attendance Type Bottom-Right on image */}
        <div className="absolute bottom-3 right-3">
          <AttendanceTypeBadge type={event.event_type} />
        </div>

        {/* Spots Remaining Pill */}
        {spotsLeft > 0 && spotsLeft <= 30 && (
          <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-cib-red-600/90 text-white text-[11px] font-bold backdrop-blur-md shadow-sm">
            Only {spotsLeft} spots remaining
          </div>
        )}
        {isSoldOut && (
          <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-cib-charcoal-900 text-white text-[11px] font-bold backdrop-blur-md shadow-sm">
            REGISTRATION FULL
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-5 sm:p-6 justify-between">
        <div className="space-y-3">
          {/* Date & Location Line */}
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1.5 text-cib-green-800">
              <Calendar className="w-3.5 h-3.5 text-cib-green-700" />
              {formatDateRange(event.start_date, event.end_date)}
            </span>
            <span className="flex items-center gap-1 truncate">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              {event.location}
            </span>
          </div>

          {/* Event Title */}
          <h3 className="text-lg sm:text-xl font-bold text-cib-charcoal-900 font-display leading-snug group-hover:text-cib-green-800 transition-colors line-clamp-2">
            <Link to={`/events/${event.slug}`}>
              {event.title}
            </Link>
          </h3>

          {/* Short Description */}
          <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
            {event.short_description}
          </p>
        </div>

        {/* Footer Meta: Pricing & CTA */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
              Admission
            </span>
            <span className="text-base font-extrabold text-cib-charcoal-900">
              {formatGHS(event.registration_fee)}
            </span>
          </div>

          <Link
            to={`/events/${event.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-cib-green-800 bg-cib-green-50 hover:bg-cib-green-100 px-3.5 py-2 rounded-lg transition-all duration-200 group-hover:translate-x-0.5"
          >
            <span>View Event</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
};
