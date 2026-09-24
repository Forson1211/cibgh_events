import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { DEMO_USERS, CIB_LOGO_URL } from '../data/mockData';
import { Lock, Mail, Shield, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentUser } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const matched = DEMO_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (matched) {
      setCurrentUser(matched);
      navigate(matched.role === 'SUPER_ADMIN' ? '/admin/dashboard' : '/dashboard');
    } else {
      // Default to attendee
      setCurrentUser({
        id: `usr-${Date.now()}`,
        email,
        first_name: email.split('@')[0],
        last_name: 'Member',
        role: 'ATTENDEE',
        created_at: new Date().toISOString(),
      });
      navigate('/dashboard');
    }
  };

  const handleQuickLogin = (user: typeof DEMO_USERS[0]) => {
    setCurrentUser(user);
    if (user.role === 'SUPER_ADMIN') {
      navigate('/admin/dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="bg-white p-2 rounded-2xl inline-block border border-slate-100 shadow-sm">
            <img
              src={CIB_LOGO_URL}
              alt="CIB Ghana Crest"
              className="h-12 w-auto object-contain mx-auto"
            />
          </div>
          <h1 className="text-2xl font-black text-cib-charcoal-900 font-display">
            CIB Events Portal
          </h1>
          <p className="text-xs text-slate-500">
            Sign in to access your digital tickets, certificates, and event registrations.
          </p>
        </div>

        {/* Quick Demo Selector */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Instant Demo Logins
          </span>
          <div className="space-y-1.5">
            {DEMO_USERS.map((usr) => (
              <button
                key={usr.id}
                type="button"
                onClick={() => handleQuickLogin(usr)}
                className="w-full text-left p-2 rounded-xl bg-white hover:bg-cib-green-50 border border-slate-200/60 hover:border-cib-green-300 text-xs flex items-center justify-between transition-colors"
              >
                <div>
                  <strong className="text-cib-charcoal-900 block">{usr.first_name} {usr.last_name}</strong>
                  <span className="text-[10px] text-slate-500">{usr.email}</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cib-green-100 text-cib-green-800">
                  {usr.role === 'SUPER_ADMIN' ? 'Super Admin' : usr.role}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Manual Form */}
        <form onSubmit={handleManualLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@cibgh.org"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-cib-green-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-cib-green-600 focus:outline-none"
              />
            </div>
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full">
            Sign In
          </Button>
        </form>

        <div className="text-center">
          <Link to="/" className="text-xs text-slate-500 hover:text-cib-green-800 font-semibold">
            &larr; Return to Events Home
          </Link>
        </div>
      </div>
    </div>
  );
};
