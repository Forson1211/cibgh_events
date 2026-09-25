import React from 'react';
import { useApp } from '../../context/AppContext';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Users,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  Clock,
  Sparkles,
  QrCode,
  Plus
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { formatGHS } from '../../lib/utils';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { events, registrations } = useApp();

  const totalEvents = events.length;
  const upcomingEvents = events.filter((e) => !e.is_past && e.status !== 'DRAFT').length;
  const totalRegistrations = registrations.length;
  const checkedInCount = registrations.filter((r) => r.check_in_status === 'CHECKED_IN').length;
  const totalRevenue = registrations.reduce((acc, r) => acc + (r.total_amount || 0), 0);

  const checkInRate = totalRegistrations > 0
    ? Math.round((checkedInCount / totalRegistrations) * 100)
    : 0;

  return (
    <AdminLayout
      title="Executive Overview"
      subtitle="Real-time analytics for CIB Ghana conferences, registrations, and delegate credentials."
      actions={
        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => navigate('/admin/events/create')}
        >
          Create New Event
        </Button>
      }
    >
      <div className="space-y-8">
        {/* KPI Metric Cards Grid (Requirement #21) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Total Events */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Total Events
              </span>
              <div className="p-2 rounded-xl bg-cib-green-50 text-cib-green-800">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-cib-charcoal-900 font-display">
                {totalEvents}
              </span>
              <span className="text-xs text-cib-green-700 font-semibold">
                {upcomingEvents} active
              </span>
            </div>
            <p className="text-[11px] text-slate-500">Conferences, training & masterclasses</p>
          </div>

          {/* Card 2: Total Registrations */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Total Registrations
              </span>
              <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-cib-charcoal-900 font-display">
                {totalRegistrations}
              </span>
              <span className="text-xs text-emerald-600 font-semibold">100% verified</span>
            </div>
            <p className="text-[11px] text-slate-500">Across all scheduled programmes</p>
          </div>

          {/* Card 3: Checked-In */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Checked-In Attendees
              </span>
              <div className="p-2 rounded-xl bg-cib-gold-50 text-cib-gold-700">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-cib-charcoal-900 font-display">
                {checkedInCount}
              </span>
              <span className="text-xs text-cib-gold-600 font-bold">
                {checkInRate}% rate
              </span>
            </div>
            <p className="text-[11px] text-slate-500">Verified via QR scanner desk</p>
          </div>

          {/* Card 4: Total Revenue */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Total Revenue
              </span>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-cib-charcoal-900 font-display">
                {formatGHS(totalRevenue)}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">Settled via Paystack & bank wires</p>
          </div>
        </div>

        {/* Quick Actions Ribbon */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/admin/check-in"
            className="p-5 rounded-2xl bg-gradient-to-r from-cib-green-900 to-cib-green-800 text-white shadow-md hover:shadow-lg transition-all flex items-center justify-between group"
          >
            <div>
              <span className="text-xs font-bold text-cib-gold-400 uppercase tracking-wider block">
                Accreditation Desk
              </span>
              <h4 className="text-base font-bold text-white font-display mt-0.5">
                Launch QR Check-In Scanner
              </h4>
              <p className="text-xs text-emerald-200 mt-1">Scan delegate badges & verify passes</p>
            </div>
            <div className="p-3 bg-white/10 rounded-xl text-white group-hover:scale-110 transition-transform">
              <QrCode className="w-6 h-6" />
            </div>
          </Link>

          <Link
            to="/admin/registrations"
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-cib-green-300 shadow-sm hover:shadow-md transition-all flex items-center justify-between group"
          >
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Delegate Ledger
              </span>
              <h4 className="text-base font-bold text-cib-charcoal-900 font-display mt-0.5">
                Manage Registrations
              </h4>
              <p className="text-xs text-slate-500 mt-1">Search, filter and export to CSV</p>
            </div>
            <div className="p-3 bg-slate-100 rounded-xl text-slate-600 group-hover:bg-cib-green-50 group-hover:text-cib-green-800 transition-colors">
              <Users className="w-6 h-6" />
            </div>
          </Link>

          <Link
            to="/admin/events"
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-cib-green-300 shadow-sm hover:shadow-md transition-all flex items-center justify-between group"
          >
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Calendar Control
              </span>
              <h4 className="text-base font-bold text-cib-charcoal-900 font-display mt-0.5">
                All Event Programmes
              </h4>
              <p className="text-xs text-slate-500 mt-1">Manage publish states & schedules</p>
            </div>
            <div className="p-3 bg-slate-100 rounded-xl text-slate-600 group-hover:bg-cib-green-50 group-hover:text-cib-green-800 transition-colors">
              <Calendar className="w-6 h-6" />
            </div>
          </Link>
        </div>

        {/* Recent Registrations Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-cib-charcoal-900 font-display">
                Recent Delegate Registrations
              </h3>
              <p className="text-xs text-slate-500">Live feed of incoming conference passes</p>
            </div>
            <Link
              to="/admin/registrations"
              className="text-xs font-bold text-cib-green-700 hover:underline flex items-center gap-1"
            >
              View All Registrations <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-y border-slate-100 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Ref Number</th>
                  <th className="py-3 px-4">Delegate Name</th>
                  <th className="py-3 px-4">Organization</th>
                  <th className="py-3 px-4">Event</th>
                  <th className="py-3 px-4">Tier</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {registrations.slice(0, 5).map((reg) => (
                  <tr key={reg.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-cib-green-800">
                      {reg.registration_number}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-cib-charcoal-900">
                      {reg.first_name} {reg.last_name}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 truncate max-w-[160px]">
                      {reg.organization}
                    </td>
                    <td className="py-3.5 px-4 truncate max-w-[200px]">
                      {reg.event_title}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                        {reg.registration_type_name}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          reg.check_in_status === 'CHECKED_IN'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {reg.check_in_status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-cib-charcoal-900">
                      {formatGHS(reg.total_amount)}
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
