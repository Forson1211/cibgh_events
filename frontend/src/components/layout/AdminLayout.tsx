import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Users,
  UserCheck,
  Mic,
  Award,
  Clock,
  CreditCard,
  QrCode,
  FileText,
  BarChart3,
  Settings,
  ArrowLeft,
  Menu,
  X,
  Shield,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { CIB_LOGO_URL } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  title,
  subtitle,
  actions,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useApp();

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
    { label: 'Events', icon: Calendar, href: '/admin/events' },
    { label: 'Registrations', icon: Users, href: '/admin/registrations' },
    { label: 'Check-In Counter', icon: QrCode, href: '/admin/check-in' },
    { label: 'Speakers', icon: Mic, href: '/admin/speakers' },
    { label: 'Sponsors & Partners', icon: Award, href: '/admin/sponsors' },
    { label: 'Payments Ledger', icon: CreditCard, href: '/admin/payments' },
    { label: 'Certificates', icon: Award, href: '/admin/certificates' },
    { label: 'Event Resources', icon: FileText, href: '/admin/resources' },
    { label: 'Analytics', icon: BarChart3, href: '/admin/analytics' },
    { label: 'Settings', icon: Settings, href: '/admin/settings' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-cib-charcoal-950 text-white flex flex-col transition-transform duration-200 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="bg-white p-1 rounded-lg">
              <img
                src={CIB_LOGO_URL}
                alt="CIB Ghana Logo"
                className="h-8 w-auto object-contain"
              />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-white font-display tracking-tight leading-none">
                CIB GHANA
              </h2>
              <span className="text-[10px] font-bold text-cib-gold-400 uppercase tracking-wider">
                Admin Center
              </span>
            </div>
          </Link>

          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Role Card */}
        <div className="px-4 py-3 bg-white/5 border-b border-slate-800/80 mx-3 my-3 rounded-xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-cib-green-700 flex items-center justify-center font-bold text-xs text-white">
            {currentUser.first_name[0]}
          </div>
          <div className="truncate flex-1">
            <p className="text-xs font-bold text-white truncate">
              {currentUser.first_name} {currentUser.last_name}
            </p>
            <span className="text-[10px] text-cib-gold-400 font-semibold uppercase">
              {currentUser.role}
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  active
                    ? 'bg-cib-green-700 text-white shadow-sm font-bold'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Return to Public Site */}
        <div className="p-3 border-t border-slate-800">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-bold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Site</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Admin Topbar */}
        <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 px-4 sm:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 lg:hidden"
                aria-label="Open Sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-cib-charcoal-900 font-display tracking-tight">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
                )}
              </div>
            </div>

            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
