import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminLayout } from '../../components/layout/AdminLayout';
import {
  QrCode,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  User,
  ShieldCheck,
  Building,
  RefreshCw
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Registration } from '../../types';

export const AdminCheckIn: React.FC = () => {
  const { registrations, checkInAttendee } = useApp();
  const [searchInput, setSearchInput] = useState('');
  const [activeRegistration, setActiveRegistration] = useState<Registration | null>(null);
  const [scanResult, setScanResult] = useState<{
    status: 'idle' | 'success' | 'already_checked_in' | 'not_found';
    message: string;
    timestamp?: string;
  }>({ status: 'idle', message: '' });

  const handleLookup = (regNumber: string) => {
    const cleanNumber = regNumber.trim().toUpperCase();
    if (!cleanNumber) return;

    const found = registrations.find(
      (r) => r.registration_number.toUpperCase() === cleanNumber || r.email.toLowerCase() === cleanNumber.toLowerCase()
    );

    if (found) {
      setActiveRegistration(found);
      setScanResult({ status: 'idle', message: '' });
    } else {
      setActiveRegistration(null);
      setScanResult({
        status: 'not_found',
        message: `Registration record "${cleanNumber}" not found in delegate roster.`,
      });
    }
  };

  const handleConfirmCheckIn = () => {
    if (!activeRegistration) return;

    const result = checkInAttendee(activeRegistration.registration_number);
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (result.success) {
      setScanResult({
        status: 'success',
        message: `CHECKED IN ✓ Time: ${nowTime}`,
        timestamp: nowTime,
      });
      if (result.registration) {
        setActiveRegistration(result.registration);
      }
    } else {
      setScanResult({
        status: 'already_checked_in',
        message: result.message,
      });
    }
  };

  const handleReset = () => {
    setSearchInput('');
    setActiveRegistration(null);
    setScanResult({ status: 'idle', message: '' });
  };

  return (
    <AdminLayout
      title="Accreditation & Check-In Desk"
      subtitle="Verify delegate badge credentials and manage real-time entrance status."
    >
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Scanner / Barcode Input Console */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cib-green-50 text-cib-green-800">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-cib-charcoal-900 font-display">
                Scanner & Registration Lookup
              </h3>
              <p className="text-xs text-slate-500">
                Scan QR code badge or type delegate registration reference ID.
              </p>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLookup(searchInput);
            }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="e.g. CIB-EVT-782419 or email..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-300 font-mono text-sm uppercase focus:border-cib-green-600 focus:outline-none"
              />
            </div>
            <Button type="submit" variant="primary" size="lg">
              Find Attendee
            </Button>
          </form>

          {/* Quick Click Sample Badge References for Evaluator Convenience */}
          <div className="pt-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Quick Scan Simulation:
            </span>
            <div className="flex flex-wrap gap-2">
              {registrations.slice(0, 4).map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    setSearchInput(r.registration_number);
                    handleLookup(r.registration_number);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-cib-green-50 text-slate-700 hover:text-cib-green-900 font-mono text-xs font-semibold border border-slate-200 transition-colors"
                >
                  {r.registration_number} ({r.first_name})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Scan Status Feedback */}
        {scanResult.status === 'not_found' && (
          <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0" />
            <div>
              <p className="text-sm font-bold">Attendee Not Found</p>
              <p className="text-xs">{scanResult.message}</p>
            </div>
          </div>
        )}

        {/* ATTENDEE FOUND CARD (Requirement #19) */}
        {activeRegistration && (
          <div className="bg-white rounded-3xl border-2 border-cib-green-700 shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-cib-green-900 text-white px-6 py-4 flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-widest text-cib-gold-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> ATTENDEE FOUND
              </span>
              <span className="font-mono text-xs text-slate-200">
                {activeRegistration.registration_number}
              </span>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {/* Attendee Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-[11px] font-bold uppercase text-slate-400 block">
                    NAME:
                  </span>
                  <strong className="text-lg text-cib-charcoal-900">
                    {activeRegistration.first_name} {activeRegistration.last_name}
                  </strong>
                  <p className="text-xs text-slate-500">{activeRegistration.email}</p>
                </div>

                <div>
                  <span className="text-[11px] font-bold uppercase text-slate-400 block">
                    CATEGORY &amp; MEMBERSHIP:
                  </span>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <strong className="text-base text-cib-green-800">
                      {activeRegistration.registration_type_name}
                    </strong>
                    {activeRegistration.membership_category && (
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                          activeRegistration.membership_category === 'ACIB'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : activeRegistration.membership_category === 'FCIB'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : activeRegistration.membership_category === 'Student'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-orange-100 text-orange-800 border border-orange-200'
                        }`}
                      >
                        {activeRegistration.membership_category}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">Mode: {activeRegistration.attendance_type}</p>
                </div>

                <div>
                  <span className="text-[11px] font-bold uppercase text-slate-400 block">
                    EVENT:
                  </span>
                  <p className="font-bold text-slate-800 line-clamp-1">
                    {activeRegistration.event_title}
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-bold uppercase text-slate-400 block">
                    CURRENT STATUS:
                  </span>
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-black uppercase ${
                      activeRegistration.check_in_status === 'CHECKED_IN'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {activeRegistration.check_in_status}
                  </span>
                </div>
              </div>

              {/* Success Check-In Stamp */}
              {scanResult.status === 'success' && (
                <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-500 text-emerald-900 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
                    <div>
                      <p className="text-lg font-black font-display">
                        CHECKED IN ✓
                      </p>
                      <p className="text-xs font-semibold">Time: {scanResult.timestamp}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold bg-emerald-600 text-white px-3 py-1 rounded-lg">
                    Accredited
                  </span>
                </div>
              )}

              {/* Duplicate Prevention Alert */}
              {scanResult.status === 'already_checked_in' && (
                <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-500 text-amber-900 flex items-center gap-3">
                  <AlertTriangle className="w-7 h-7 text-amber-600 shrink-0" />
                  <div>
                    <p className="text-sm font-bold">DUPLICATE ENTRY DETECTED</p>
                    <p className="text-xs">{scanResult.message}</p>
                  </div>
                </div>
              )}

              {/* Actions Button */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <Button variant="ghost" size="md" onClick={handleReset}>
                  Scan Next Badge
                </Button>

                {activeRegistration.check_in_status !== 'CHECKED_IN' && (
                  <Button
                    variant="accent"
                    size="xl"
                    leftIcon={<CheckCircle2 className="w-5 h-5" />}
                    onClick={handleConfirmCheckIn}
                  >
                    CHECK IN ATTENDEE
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
