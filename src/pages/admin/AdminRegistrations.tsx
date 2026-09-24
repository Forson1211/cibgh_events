import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Link } from 'react-router-dom';
import { Search, Download, Filter, Ticket, CheckCircle2, QrCode } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { formatGHS } from '../../lib/utils';

export const AdminRegistrations: React.FC = () => {
  const { registrations, events } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEventId, setSelectedEventId] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  const filtered = registrations.filter((r) => {
    const matchesEvent = selectedEventId === 'ALL' || r.event_id === selectedEventId;
    const matchesStatus = selectedStatus === 'ALL' || r.check_in_status === selectedStatus;
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      searchQuery === '' ||
      r.registration_number.toLowerCase().includes(q) ||
      r.first_name.toLowerCase().includes(q) ||
      r.last_name.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.organization.toLowerCase().includes(q);
    return matchesEvent && matchesStatus && matchesQuery;
  });

  const exportCSV = () => {
    const headers = ['Reg Number', 'First Name', 'Last Name', 'Email', 'Phone', 'Organization', 'Job Title', 'Event', 'Tier', 'Amount', 'Payment Status', 'Check-In Status', 'Created At'];
    const rows = filtered.map((r) => [
      r.registration_number,
      r.first_name,
      r.last_name,
      r.email,
      r.phone,
      `"${r.organization}"`,
      `"${r.job_title}"`,
      `"${r.event_title}"`,
      `"${r.registration_type_name}"`,
      r.total_amount,
      r.payment_status,
      r.check_in_status,
      r.created_at,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CIB_Ghana_Registrations_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdminLayout
      title="Delegate Registrations Ledger"
      subtitle="Complete database of registered conference attendees, payment receipts, and check-in audits."
      actions={
        <Button
          variant="outline"
          size="sm"
          leftIcon={<Download className="w-4 h-4" />}
          onClick={exportCSV}
        >
          Export to CSV
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, ref number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:border-cib-green-600 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Event Filter */}
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
            >
              <option value="ALL">All Events</option>
              {events.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.title}
                </option>
              ))}
            </select>

            {/* Check-In Status */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
            >
              <option value="ALL">All Check-in Status</option>
              <option value="REGISTERED">Registered</option>
              <option value="CHECKED_IN">Checked In</option>
            </select>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Registration Ref</th>
                  <th className="py-3.5 px-4">Attendee</th>
                  <th className="py-3.5 px-4">Organization & Title</th>
                  <th className="py-3.5 px-4">Event & Tier</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">Accreditation</th>
                  <th className="py-3.5 px-4 text-right">Pass</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((reg) => (
                  <tr key={reg.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-cib-green-800">
                      {reg.registration_number}
                    </td>

                    <td className="py-3.5 px-4">
                      <strong className="text-cib-charcoal-900 block">
                        {reg.first_name} {reg.last_name}
                      </strong>
                      <span className="text-[11px] text-slate-400">{reg.email}</span>
                    </td>

                    <td className="py-3.5 px-4 max-w-[180px]">
                      <span className="font-semibold text-slate-800 block truncate">
                        {reg.organization}
                      </span>
                      <span className="text-[11px] text-slate-400 block truncate">
                        {reg.job_title}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 max-w-[200px]">
                      <span className="font-semibold text-slate-800 block truncate">
                        {reg.event_title}
                      </span>
                      <span className="text-[10px] font-bold text-cib-gold-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                        {reg.registration_type_name}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <strong className="text-cib-charcoal-900 block">
                        {formatGHS(reg.total_amount)}
                      </strong>
                      <span className="text-[10px] text-emerald-600 font-bold uppercase">
                        {reg.payment_status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          reg.check_in_status === 'CHECKED_IN'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {reg.check_in_status === 'CHECKED_IN' ? 'Checked In ✓' : 'Registered'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/events/30th-national-banking-ethics-conference-2026/ticket/${reg.registration_number}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-cib-green-700 hover:text-cib-green-900 font-bold"
                      >
                        <Ticket className="w-3.5 h-3.5" />
                        <span>Pass</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
