import React from 'react';
import { Speaker } from '../../types';
import { ArrowRight } from 'lucide-react';

interface SpeakerCardProps {
  speaker: Speaker;
  onSelect: (speaker: Speaker) => void;
  className?: string;
}

export const SpeakerCard: React.FC<SpeakerCardProps> = ({ speaker, onSelect, className = '' }) => {
  return (
    <div
      onClick={() => onSelect(speaker)}
      className={`group cursor-pointer flex flex-col bg-white rounded-none border border-slate-200 shadow-sm hover:shadow-xl hover:border-[#008129] transition-all duration-300 overflow-hidden ${className}`}
    >
      {/* Photo Frame - Sharp rectangular, taller aspect ratio so pictures show well */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-100 rounded-none">
        <img
          src={speaker.photo_url}
          alt={speaker.name}
          className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {speaker.is_keynote && (
          <div className="absolute top-2.5 left-2.5">
            <span className="px-2.5 py-1 rounded-none text-[10px] font-black uppercase tracking-wider bg-[#F5A623] text-slate-950 shadow-md">
              Keynote
            </span>
          </div>
        )}
      </div>

      {/* Info Block */}
      <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 bg-white">
        <div className="space-y-1">
          <h4 className="text-base sm:text-lg font-bold text-black font-display line-clamp-1">
            {speaker.name}
          </h4>
          <p className="text-xs font-semibold text-[#008129] line-clamp-1">
            {speaker.position}
          </p>
          <p className="text-xs text-slate-500 line-clamp-1">
            {speaker.organization}
          </p>
        </div>

        {/* View Profile CTA - Solid green, no fade out, no stroke */}
        <div className="mt-3.5 pt-3 border-t border-slate-100">
          <span className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-none bg-[#008129] hover:bg-[#006e22] text-white text-xs font-bold transition-all duration-200 shadow-sm">
            <span>View Profile</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </div>
  );
};
