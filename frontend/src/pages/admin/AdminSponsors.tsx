import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Plus, Award, ExternalLink, Building, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const AdminSponsors: React.FC = () => {
  const { sponsors } = useApp();
  const [selectedTier, setSelectedTier] = useState<string>('ALL');

  const filtered = sponsors.filter(
    (s) => selectedTier === 'ALL' || s.tier === selectedTier
  );

  const tierColors: Record<string, string> = {
    PLATINUM: 'bg-slate-900 text-white border-slate-700',
    GOLD: 'bg-amber-100 text-amber-900 border-amber-300',
    SILVER: 'bg-slate-100 text-slate-700 border-slate-300',
    PARTNER: 'bg-emerald-50 text-cib-green-800 border-cib-green-200',
    ACADEMIC: 'bg-blue-50 text-blue-800 border-blue-200',
  };

  return (
    <AdminLayout
      title="Sponsors & Institutional Partners"
      subtitle="Manage corporate financial institutions, regulators, and fintech exhibition partners."
      actions={
        <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
          Add Sponsor
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Tier Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {['ALL', 'PLATINUM', 'GOLD', 'SILVER', 'PARTNER'].map((tier) => (
            <button
              key={tier}
              onClick={() => setSelectedTier(tier)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedTier === tier
                  ? 'bg-cib-green-700 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tier === 'ALL' ? 'All Tiers' : `${tier} Sponsors`}
            </button>
          ))}
        </div>

        {/* Sponsors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((sp) => (
            <div
              key={sp.id}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                      tierColors[sp.tier] || 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {sp.tier}
                  </span>
                  {sp.website_url && (
                    <a
                      href={sp.website_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-400 hover:text-cib-green-700"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>

                <div className="h-14 flex items-center justify-center bg-slate-50 rounded-xl p-2 border border-slate-100">
                  <img
                    src={sp.logo_url}
                    alt={sp.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                <div>
                  <h4 className="text-base font-bold text-cib-charcoal-900 font-display">
                    {sp.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {sp.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button className="text-xs text-slate-400 hover:text-rose-600 font-bold">
                  Remove Sponsor
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};
