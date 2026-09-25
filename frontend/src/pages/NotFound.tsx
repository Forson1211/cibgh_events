import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowLeft, Home } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto shadow-inner">
          <Search className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-cib-gold-600">
            ERROR 404
          </span>
          <h1 className="text-3xl font-black text-cib-charcoal-900 font-display">
            WE COULDN'T FIND THAT PAGE
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            The event or page you are looking for may have concluded, been rescheduled, or is no longer available.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link to="/events">
            <Button variant="primary" size="md">
              Browse Events Calendar
            </Button>
          </Link>
          <Link to="/">
            <Button variant="outline" size="md" leftIcon={<Home className="w-4 h-4" />}>
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
