import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Plus, Search, Mic, Building, MapPin, Edit, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const AdminSpeakers: React.FC = () => {
  const { speakers } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = speakers.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.organization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout
      title="Conference Faculty & Speakers"
      subtitle="Manage keynote luminaries, panel moderators, and guest resource persons."
      actions={
        <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
          Add Speaker
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Search */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search faculty name or institution..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:border-cib-green-600 focus:outline-none"
            />
          </div>
          <span className="text-xs text-slate-500 font-semibold">
            {filtered.length} Speakers Enrolled
          </span>
        </div>

        {/* Speakers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((spk) => (
            <div
              key={spk.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4"
            >
              <img
                src={spk.photo_url}
                alt={spk.name}
                className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-slate-200"
              />

              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-cib-charcoal-900 truncate">
                    {spk.name}
                  </h4>
                  {spk.is_keynote && (
                    <span className="text-[9px] font-black uppercase bg-cib-gold-400 text-cib-charcoal-950 px-1.5 py-0.2 rounded">
                      Keynote
                    </span>
                  )}
                </div>
                <p className="text-xs font-semibold text-cib-green-800 truncate">
                  {spk.position}
                </p>
                <p className="text-xs text-slate-500 truncate flex items-center gap-1">
                  <Building className="w-3 h-3 text-slate-400 shrink-0" />
                  {spk.organization}
                </p>
                {spk.expertise && spk.expertise.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-1">
                    {spk.expertise.slice(0, 2).map((exp, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium"
                      >
                        {exp}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};
