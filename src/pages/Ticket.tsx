import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { TicketCard } from '../components/registration/TicketCard';
import { DigitalTicket } from '../types';
import { ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const Ticket: React.FC = () => {
  const { slug, id } = useParams<{ slug: string; id: string }>();
  const navigate = useNavigate();
  const { getRegistrationByNumber, getEventBySlug, registrations } = useApp();

  // Find registration either by registration_number or id
  const registration = (id && getRegistrationByNumber(id)) || 
    registrations.find((r) => r.id === id || r.registration_number === id);

  const event = slug ? getEventBySlug(slug) : undefined;

  if (!registration) {
    return (
      <div className="max-w-xl mx-auto py-24 text-center space-y-4 px-4">
        <h2 className="text-2xl font-bold text-cib-charcoal-900 font-display">
          Ticket Not Found
        </h2>
        <p className="text-sm text-slate-600">
          The requested delegate pass reference ({id}) could not be located in the CIB credential registry.
        </p>
        <Button variant="primary" size="md" onClick={() => navigate('/events')}>
          Browse Events
        </Button>
      </div>
    );
  }

  // Construct DigitalTicket object
  const ticket: DigitalTicket = {
    id: `tkt-${registration.id}`,
    registration_id: registration.id,
    registration_number: registration.registration_number,
    event_id: registration.event_id,
    event_title: registration.event_title,
    event_date: event?.start_date || 'Conference Dates',
    event_venue: event?.venue || 'Accra, Ghana',
    attendee_name: `${registration.first_name} ${registration.last_name}`,
    attendee_email: registration.email,
    organization: registration.organization,
    registration_tier: registration.registration_type_name,
    attendance_type: registration.attendance_type,
    qr_code_data: JSON.stringify({
      regNumber: registration.registration_number,
      name: `${registration.first_name} ${registration.last_name}`,
      event: registration.event_title,
      tier: registration.registration_type_name,
      status: registration.check_in_status,
    }),
    security_hash: `SHA256_${registration.registration_number}`,
    issue_date: registration.created_at,
    check_in_status: registration.check_in_status,
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-16 space-y-8">
      {/* Top Banner / Actions */}
      <div className="flex items-center justify-between no-print">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-cib-charcoal"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-bold text-cib-green-800 bg-cib-green-50 px-3 py-1.5 rounded-lg border border-cib-green-200/60">
          <ShieldCheck className="w-4 h-4 text-cib-green-700" />
          <span>Accredited CIB Pass</span>
        </div>
      </div>

      <div className="text-center space-y-2 no-print">
        <span className="text-xs font-bold uppercase tracking-widest text-cib-green-700">
          DELEGATE ACCREDITATION
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-cib-charcoal-900 font-display">
          Your Digital Event Ticket
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          Please present this digital pass on your smartphone or bring a printed copy to the check-in desk at the venue.
        </p>
      </div>

      {/* Render Ticket Pass */}
      <TicketCard ticket={ticket} showActions={true} />
    </div>
  );
};
