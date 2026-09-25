import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Pages
import { Home } from './pages/Home';
import { Events } from './pages/Events';
import { EventDetails } from './pages/EventDetails';
import { Register } from './pages/Register';
import { Ticket } from './pages/Ticket';
import { Speakers } from './pages/Speakers';
import { About } from './pages/About';
import { PastEvents } from './pages/PastEvents';
import { Resources } from './pages/Resources';
import { Contact } from './pages/Contact';
import { Login } from './pages/Login';
import { MyPortal } from './pages/MyPortal';
import { NotFound } from './pages/NotFound';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminEvents } from './pages/admin/AdminEvents';
import { AdminEventCreate } from './pages/admin/AdminEventCreate';
import { AdminRegistrations } from './pages/admin/AdminRegistrations';
import { AdminCheckIn } from './pages/admin/AdminCheckIn';
import { AdminSpeakers } from './pages/admin/AdminSpeakers';
import { AdminSponsors } from './pages/admin/AdminSponsors';
import { AdminPayments } from './pages/admin/AdminPayments';
import { AdminCertificates } from './pages/admin/AdminCertificates';
import { AdminAnalytics } from './pages/admin/AdminAnalytics';
import { AdminSettings } from './pages/admin/AdminSettings';

import { ScrollProgressBar } from './components/ui/ScrollProgressBar';
import { WhatsAppWidget } from './components/chat/WhatsAppWidget';

// Ensures desktop screens maintain the 100% scale regardless of Windows DPI (125%, 150%, 175%)
function DpiScaleManager() {
  useEffect(() => {
    const handleScale = () => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isDesktop = !isMobile && (window.screen.width >= 1024 || window.innerWidth >= 1024);

      if (isDesktop && window.devicePixelRatio && window.devicePixelRatio > 1) {
        (document.body.style as any).zoom = (1 / window.devicePixelRatio).toString();
      } else if (document.body) {
        (document.body.style as any).zoom = '1';
      }
    };

    handleScale();
    window.addEventListener('resize', handleScale);
    return () => window.removeEventListener('resize', handleScale);
  }, []);

  return null;
}

// Helper component to restore scroll position on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Layout wrapper that excludes public Navbar and Footer on admin paths
function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-white text-cib-charcoal-900 relative">
      <ScrollProgressBar />
      {!isAdminRoute && <Navbar />}
      <main className="flex-1">{children}</main>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <WhatsAppWidget />}
    </div>
  );
}

export function App() {
  return (
    <AppProvider>
      <Router>
        <DpiScaleManager />
        <ScrollToTop />
        <LayoutWrapper>
          <Routes>
            {/* Public Pages */}
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:slug" element={<EventDetails />} />
            <Route path="/events/:slug/register" element={<Register />} />
            <Route path="/events/:slug/ticket/:id" element={<Ticket />} />
            <Route path="/speakers" element={<Speakers />} />
            <Route path="/about" element={<About />} />
            <Route path="/past-events" element={<PastEvents />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Login />} />
            {/* /dashboard redirects to the new attendee portal */}
            <Route path="/dashboard" element={<Navigate to="/my-portal" replace />} />
            <Route path="/my-portal" element={<MyPortal />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/events" element={<AdminEvents />} />
            <Route path="/admin/events/create" element={<AdminEventCreate />} />
            <Route path="/admin/events/:id/edit" element={<AdminEventCreate />} />
            <Route path="/admin/registrations" element={<AdminRegistrations />} />
            <Route path="/admin/attendees" element={<AdminRegistrations />} />
            <Route path="/admin/speakers" element={<AdminSpeakers />} />
            <Route path="/admin/sponsors" element={<AdminSponsors />} />
            <Route path="/admin/agenda" element={<AdminEvents />} />
            <Route path="/admin/payments" element={<AdminPayments />} />
            <Route path="/admin/check-in" element={<AdminCheckIn />} />
            <Route path="/admin/certificates" element={<AdminCertificates />} />
            <Route path="/admin/resources" element={<AdminEvents />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/settings" element={<AdminSettings />} />

            {/* 404 Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </LayoutWrapper>
      </Router>
    </AppProvider>
  );
}

export default App;
