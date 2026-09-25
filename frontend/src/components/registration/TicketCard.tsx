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
      {/* Ticket Pass Container - Premium Crisp Frame with NO Round Edges and NO Stroke */}
      <div
        ref={ticketRef}
        className="max-w-md mx-auto bg-white rounded-none shadow-[0_25px_60px_rgba(0,0,0,0.35)] overflow-hidden relative print-only-container"
      >
        {/* Ticket Header Ribbon */}
        <div className="bg-[#008129] p-6 text-white relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white p-1 rounded-none shadow-sm">
                <img
                  src={CIB_LOGO_URL}
                  alt="CIB Ghana Crest"
                  className="h-10 w-auto object-contain"
                />
              </div>
              <div className="text-left">
                <h4 className="font-extrabold text-sm tracking-tight text-white font-display">
                  CIB GHANA
                </h4>
                <p className="text-[10px] tracking-wider text-[#FFE500] uppercase font-bold">
                  Official Delegate Pass
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block px-3 py-1 rounded-none bg-[#F5A623] text-black text-[10px] font-black uppercase tracking-wider shadow-sm">
                {ticket.registration_tier}
              </span>
            </div>
          </div>

          <div className="mt-5 text-left">
            <h3 className="text-lg font-black text-white font-display leading-tight">
              {ticket.event_title}
            </h3>
          </div>
        </div>

        {/* Notched Border Divider with Sharp Geometric Cutouts */}
        <div className="relative flex items-center justify-between px-4 py-2 bg-slate-50 border-y border-dashed border-slate-300">
          <div className="w-3.5 h-3.5 bg-slate-300 -ml-6 shadow-inner" />
          <div className="text-[10px] font-mono tracking-widest text-slate-500 uppercase font-bold">
            REFERENCE: {ticket.registration_number}
          </div>
          <div className="w-3.5 h-3.5 bg-slate-300 -mr-6 shadow-inner" />
        </div>

        {/* Ticket Body */}
        <div className="p-6 space-y-6 bg-white">
          {/* Attendee Info */}
          <div className="grid grid-cols-2 gap-4 text-left">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                Attendee Name
              </span>
              <p className="text-sm font-bold text-slate-900 truncate">
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
              <p className="text-sm font-bold text-[#008129]">
                {ticket.registration_tier}
              </p>
              <p className="text-xs text-slate-500">
                {ticket.attendance_type === 'PHYSICAL' ? 'In-Person Pass' : ticket.attendance_type}
              </p>
            </div>
          </div>

          {/* Event Schedule & Venue */}
          <div className="space-y-2 text-xs text-slate-700 bg-slate-50 p-4 rounded-none border border-slate-200 text-left">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-[#008129] shrink-0" />
              <span className="font-semibold text-slate-900">{ticket.event_date}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#008129] shrink-0" />
              <span className="truncate">{ticket.event_venue}</span>
            </div>
          </div>

          {/* QR Code Block */}
          <div className="flex flex-col items-center justify-center p-5 bg-slate-50 rounded-none border border-slate-200 text-center space-y-3">
            <div className="bg-white p-3.5 rounded-none shadow-sm border border-slate-200">
              <QRCodeSVG
                value={ticket.qr_code_data}
                size={160}
                level="H"
                includeMargin={false}
              />
            </div>
            <div>
              <p className="font-mono text-xs font-bold text-slate-900 tracking-wider">
                {ticket.registration_number}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Scan at the accreditation counter for verified entrance
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[#008129] font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Cryptographically Secured CIB Pass</span>
            </div>
          </div>
        </div>

        {/* Ticket Footer Tear */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 text-center rounded-none">
          <p className="text-[10px] text-slate-400 font-medium">
            Chartered Institute of Bankers, Ghana &bull; Non-Transferable
          </p>
        </div>
      </div>

      {/* Action Buttons with No Round Edges */}
      {showActions && (
        <div className="flex flex-wrap items-center justify-center gap-3 no-print">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-none bg-[#008129] hover:bg-[#056b24] text-white text-xs font-bold transition-all shadow-md active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Print Ticket</span>
          </button>

          <a
            href={generateCalendarLink()}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-none border border-slate-300 hover:border-[#008129] bg-white text-xs font-bold text-slate-700 hover:text-[#008129] transition-all shadow-md active:scale-95"
          >
            <Calendar className="w-4 h-4 text-[#008129]" />
            <span>Add to Google Calendar</span>
          </a>
        </div>
      )}
    </div>
  );
};
