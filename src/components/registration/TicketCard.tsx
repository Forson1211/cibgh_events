import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { DigitalTicket } from '../../types';
import { CIB_LOGO_URL } from '../../data/mockData';
import { Calendar, MapPin, Download, Printer, Share2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface TicketCardProps {
  ticket: DigitalTicket;
  showActions?: boolean;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket, showActions = true }) => {
  const ticketRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const generateCalendarLink = () => {
    const title = encodeURIComponent(ticket.event_title);
    const location = encodeURIComponent(ticket.event_venue);
    const details = encodeURIComponent(
      `CIB Ghana Official Event Ticket\nRegistration Ref: ${ticket.registration_number}\nAttendee: ${ticket.attendee_name}`
    );
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&location=${location}&details=${details}`;
  };

  return (
    <div className="space-y-6">
      {/* Ticket Pass Container */}
      <div
        ref={ticketRef}
        className="max-w-md mx-auto bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative print-only-container"
      >
        {/* Ticket Header Ribbon */}
        <div className="bg-gradient-to-r from-cib-green-900 via-cib-green-800 to-cib-green-950 p-6 text-white relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white p-1 rounded-xl">
                <img
                  src={CIB_LOGO_URL}
                  alt="CIB Ghana Crest"
                  className="h-10 w-auto object-contain"
                />
              </div>
              <div>
                <h4 className="font-extrabold text-sm tracking-tight text-white font-display">
                  CIB GHANA
                </h4>
                <p className="text-[10px] tracking-wider text-cib-gold-400 uppercase font-semibold">
                  Official Delegate Pass
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block px-2 py-0.5 rounded bg-cib-gold-400 text-cib-charcoal-950 text-[10px] font-black uppercase tracking-wider">
                {ticket.registration_tier}
              </span>
            </div>
          </div>

          <div className="mt-5">
            <h3 className="text-lg font-black text-white font-display leading-tight">
              {ticket.event_title}
            </h3>
          </div>
        </div>

        {/* Notched Border Divider */}
        <div className="relative flex items-center justify-between px-4 py-2 bg-slate-50 border-y border-dashed border-slate-300">
          <div className="w-5 h-5 rounded-full bg-slate-200 -ml-7 shadow-inner" />
          <div className="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-bold">
            REFERENCE: {ticket.registration_number}
          </div>
          <div className="w-5 h-5 rounded-full bg-slate-200 -mr-7 shadow-inner" />
        </div>

        {/* Ticket Body */}
        <div className="p-6 space-y-6 bg-white">
          {/* Attendee Info */}
          <div className="grid grid-cols-2 gap-4 text-left">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                Attendee Name
              </span>
              <p className="text-sm font-bold text-cib-charcoal-900 truncate">
                {ticket.attendee_name}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {ticket.organization || 'Independent Delegate'}
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                Access Tier
              </span>
              <p className="text-sm font-bold text-cib-green-800">
                {ticket.registration_tier}
              </p>
              <p className="text-xs text-slate-500">
                {ticket.attendance_type === 'PHYSICAL' ? 'In-Person Pass' : ticket.attendance_type}
              </p>
            </div>
          </div>

          {/* Event Schedule & Venue */}
          <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-cib-green-700 shrink-0" />
              <span className="font-semibold text-cib-charcoal-900">{ticket.event_date}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-cib-green-700 shrink-0" />
              <span className="truncate">{ticket.event_venue}</span>
            </div>
          </div>

          {/* QR Code Block */}
          <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-center space-y-3">
            <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200">
              <QRCodeSVG
                value={ticket.qr_code_data}
                size={160}
                level="H"
                includeMargin={false}
              />
            </div>
            <div>
              <p className="font-mono text-xs font-bold text-cib-charcoal-900 tracking-wider">
                {ticket.registration_number}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Scan at the accreditation counter for verified entrance
              </p>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-cib-green-700 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Cryptographically Secured CIB Pass</span>
            </div>
          </div>
        </div>

        {/* Ticket Footer Tear */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 text-center">
          <p className="text-[10px] text-slate-400 font-medium">
            Chartered Institute of Bankers, Ghana &bull; Non-Transferable
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      {showActions && (
        <div className="flex flex-wrap items-center justify-center gap-3 no-print">
          <Button
            variant="primary"
            size="md"
            leftIcon={<Printer className="w-4 h-4" />}
            onClick={handlePrint}
          >
            Print Ticket
          </Button>

          <a
            href={generateCalendarLink()}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 hover:border-cib-green-600 bg-white text-xs font-bold text-slate-700 hover:text-cib-green-800 transition-colors shadow-sm"
          >
            <Calendar className="w-4 h-4 text-cib-green-700" />
            Add to Google Calendar
          </a>
        </div>
      )}
    </div>
  );
};
