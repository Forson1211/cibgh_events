import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { AttendanceType, RegistrationType, Registration } from '../types';
import { formatGHS } from '../lib/utils';
import {
  Check,
  CheckCircle2,
  CreditCard,
  User,
  Building,
  Mail,
  Phone,
  Globe,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Download,
  Ticket as TicketIcon,
  Sparkles
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { PaystackModal } from '../components/registration/PaystackModal';
import { sendEmailNotification } from '../lib/email';

export const Register: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { getEventBySlug, addRegistration } = useApp();

  const event = slug ? getEventBySlug(slug) : undefined;

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedTier, setSelectedTier] = useState<RegistrationType | null>(() => {
    return event?.registration_types?.[0] || null;
  });

  // Step 2: Personal Info
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [organization, setOrganization] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [country, setCountry] = useState('Ghana');
  const [cibMemberId, setCibMemberId] = useState('');

  // Step 3: Event Preferences
  const [attendanceType, setAttendanceType] = useState<AttendanceType>('PHYSICAL');
  const [dietaryRequirements, setDietaryRequirements] = useState('');
  const [specialAssistance, setSpecialAssistance] = useState('');

  // Payment & Success
  const [isPaystackOpen, setIsPaystackOpen] = useState(false);
  const [completedRegistration, setCompletedRegistration] = useState<Registration | null>(null);

  if (!event) {
    return (
      <div className="max-w-xl mx-auto py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold text-cib-charcoal-900">Event Not Found</h2>
        <Button variant="primary" size="md" onClick={() => navigate('/events')}>
          Browse Events
        </Button>
      </div>
    );
  }

  const vatRate = 0.05; // 5% VAT/levies calculation
  const subtotal = selectedTier ? selectedTier.price : event.registration_fee;
  const vatAmount = subtotal * vatRate;
  const totalAmount = subtotal + vatAmount;

  // Trigger celebration on step 5
  const triggerConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#0A5C36', '#D4AF37', '#C41230'],
    });
  };

  const handlePersonalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(3);
  };

  const handlePreferencesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(4);
  };

  const handleFinalizeRegistration = (paymentMethod: 'PAYSTACK_CARD' | 'PAYSTACK_MOMO' | 'COMPLIMENTARY', ref?: string) => {
    const newReg = addRegistration({
      event_id: event.id,
      event_title: event.title,
      registration_type_id: selectedTier?.id || 'standard',
      registration_type_name: selectedTier?.name || 'Standard Registration',
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      organization,
      job_title: jobTitle,
      country,
      cib_member_id: cibMemberId || undefined,
      attendance_type: attendanceType,
      dietary_requirements: dietaryRequirements,
      special_assistance: specialAssistance,
      total_amount: totalAmount,
      currency: 'GHS',
      payment_status: subtotal === 0 ? 'SUCCESSFUL' : 'SUCCESSFUL',
      payment_reference: ref || `FREE_${Date.now()}`,
      payment_method: paymentMethod,
      check_in_status: 'REGISTERED',
    });

    // Send transactional confirmation email
    sendEmailNotification({
      to: email,
      subject: `Registration Confirmed: ${event.title}`,
      template: 'REGISTRATION_CONFIRMATION',
      data: {
        attendeeName: `${firstName} ${lastName}`,
        eventTitle: event.title,
        eventDate: event.start_date,
        eventVenue: event.venue,
        registrationNumber: newReg.registration_number,
        attendanceType,
        ticketUrl: `${window.location.origin}/events/${event.slug}/ticket/${newReg.registration_number}`,
      },
    });

    setCompletedRegistration(newReg);
    setCurrentStep(5);
    triggerConfetti();
  };

  const stepTitles = [
    'Registration Type',
    'Personal Information',
    'Event Preferences',
    'Payment Summary',
    'Confirmation',
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-16 space-y-8">
      {/* Top Breadcrumb & Event Summary */}
      <div className="space-y-2 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-cib-green-700">
          EVENT REGISTRATION
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-cib-charcoal-900 font-display">
          {event.title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          {event.venue} &bull; {event.start_date}
        </p>
      </div>

      {/* 5-Step Progress Indicator */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4, 5].map((step) => (
            <div key={step} className="flex flex-col items-center flex-1 relative">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors z-10 ${
                  currentStep > step
                    ? 'bg-cib-green-700 text-white'
                    : currentStep === step
                    ? 'bg-cib-green-900 text-white ring-4 ring-cib-green-100'
                    : 'bg-white border-2 border-slate-300 text-slate-400'
                }`}
              >
                {currentStep > step ? <Check className="w-4 h-4" /> : step}
              </div>
              <span className="hidden sm:block text-[11px] font-semibold text-slate-600 mt-1.5 text-center truncate max-w-[100px]">
                {stepTitles[step - 1]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1: SELECT REGISTRATION TYPE */}
      {currentStep === 1 && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-cib-charcoal-900 font-display">
              Step 1: Select Registration Category
            </h2>
            <p className="text-xs text-slate-500">
              Select the delegate tier appropriate for your institutional affiliation.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {(event.registration_types || []).map((tier) => (
              <div
                key={tier.id}
                onClick={() => setSelectedTier(tier)}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  selectedTier?.id === tier.id
                    ? 'border-cib-green-700 bg-cib-green-50/40 ring-2 ring-cib-green-600/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-cib-charcoal-900">
                      {tier.name}
                    </h3>
                    {tier.eligibility && (
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                        {tier.eligibility}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 max-w-lg">
                    {tier.description}
                  </p>
                  {tier.benefits && (
                    <ul className="flex flex-wrap gap-2 pt-1 text-[11px] text-slate-500">
                      {tier.benefits.slice(0, 3).map((b, i) => (
                        <li key={i} className="flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-cib-green-700" /> {b}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="text-right shrink-0">
                  <span className="text-2xl font-black text-cib-charcoal-900 font-display block">
                    {formatGHS(tier.price)}
                  </span>
                  <span className="text-[11px] text-slate-400">per delegate</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4">
            <Button
              variant="primary"
              size="lg"
              showArrow
              disabled={!selectedTier}
              onClick={() => setCurrentStep(2)}
            >
              Continue to Personal Info
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: PERSONAL INFORMATION */}
      {currentStep === 2 && (
        <form onSubmit={handlePersonalSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-cib-charcoal-900 font-display">
              Step 2: Personal & Institutional Details
            </h2>
            <p className="text-xs text-slate-500">
              Provide delegate credentials for the official attendee ledger and digital pass.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                First Name *
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g. Kwesi"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-cib-green-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Last Name *
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="e.g. Mensah"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-cib-green-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Official Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="kwesi.mensah@bank.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-cib-green-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+233 24 000 0000"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-cib-green-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Bank / Organization *
              </label>
              <input
                type="text"
                required
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="e.g. Standard Chartered Bank Ghana"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-cib-green-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Job Title / Position *
              </label>
              <input
                type="text"
                required
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Head of Compliance"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-cib-green-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Country of Residence
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Ghana"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-cib-green-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                CIB Ghana Membership PIN (Optional)
              </label>
              <input
                type="text"
                value={cibMemberId}
                onChange={(e) => setCibMemberId(e.target.value)}
                placeholder="e.g. ACIB-2021-0492"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-cib-green-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="ghost"
              size="md"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              onClick={() => setCurrentStep(1)}
            >
              Back
            </Button>
            <Button type="submit" variant="primary" size="lg" showArrow>
              Continue to Preferences
            </Button>
          </div>
        </form>
      )}

      {/* STEP 3: EVENT INFORMATION & ATTENDANCE MODE */}
      {currentStep === 3 && (
        <form onSubmit={handlePreferencesSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-cib-charcoal-900 font-display">
              Step 3: Event Preferences & Attendance Mode
            </h2>
            <p className="text-xs text-slate-500">
              Select how you will participate in the sessions.
            </p>
          </div>

          {/* Attendance Type Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              Attendance Mode *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'PHYSICAL', title: 'In-Person Attendance', desc: 'Join onsite at the official conference venue in Accra.' },
                { id: 'VIRTUAL', title: 'Virtual Livestream', desc: 'Access high-definition live video broadcast & Q&A.' },
                { id: 'HYBRID', title: 'Hybrid Pass', desc: 'Flexible access to both physical halls and digital recordings.' },
              ].map((item) => (
                <div
                  key={item.id}
                  onClick={() => setAttendanceType(item.id as AttendanceType)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all space-y-1 ${
                    attendanceType === item.id
                      ? 'border-cib-green-700 bg-cib-green-50/50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <h4 className="text-sm font-bold text-cib-charcoal-900">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Dietary Requirements (Optional)
              </label>
              <input
                type="text"
                value={dietaryRequirements}
                onChange={(e) => setDietaryRequirements(e.target.value)}
                placeholder="e.g. Vegetarian, Halal, Diabetic, None"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-cib-green-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Accessibility / Special Assistance (Optional)
              </label>
              <input
                type="text"
                value={specialAssistance}
                onChange={(e) => setSpecialAssistance(e.target.value)}
                placeholder="Wheelchair access, auditory support, etc."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-cib-green-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="ghost"
              size="md"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              onClick={() => setCurrentStep(2)}
            >
              Back
            </Button>
            <Button type="submit" variant="primary" size="lg" showArrow>
              Continue to Payment
            </Button>
          </div>
        </form>
      )}

      {/* STEP 4: PAYMENT SUMMARY */}
      {currentStep === 4 && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-cib-charcoal-900 font-display">
              Step 4: Invoice & Payment Breakdown
            </h2>
            <p className="text-xs text-slate-500">
              Review invoice calculations before proceeding to secure Paystack settlement.
            </p>
          </div>

          {/* Breakdown Table */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">
                {selectedTier?.name || 'Standard Registration'} (1 Delegate)
              </span>
              <span className="font-bold text-cib-charcoal-900">{formatGHS(subtotal)}</span>
            </div>

            {subtotal > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Statutory Levies & VAT (5%)</span>
                <span className="font-bold text-cib-charcoal-900">{formatGHS(vatAmount)}</span>
              </div>
            )}

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-base font-black text-cib-charcoal-900 font-display block">
                  Total Payable
                </span>
                <span className="text-xs text-slate-500">Including all conference privileges</span>
              </div>
              <span className="text-2xl font-black text-cib-green-800 font-display">
                {formatGHS(totalAmount)}
              </span>
            </div>
          </div>

          {/* Delegate Review Capsule */}
          <div className="p-4 rounded-xl bg-cib-green-50/60 border border-cib-green-200/60 text-xs text-slate-700 space-y-1">
            <p><strong>Delegate:</strong> {firstName} {lastName} ({email})</p>
            <p><strong>Organization:</strong> {organization} &bull; {jobTitle}</p>
            <p><strong>Mode:</strong> {attendanceType}</p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="ghost"
              size="md"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              onClick={() => setCurrentStep(3)}
            >
              Back
            </Button>

            {totalAmount === 0 ? (
              <Button
                variant="primary"
                size="lg"
                onClick={() => handleFinalizeRegistration('COMPLIMENTARY')}
              >
                Complete Complimentary Registration
              </Button>
            ) : (
              <Button
                variant="accent"
                size="lg"
                leftIcon={<CreditCard className="w-4 h-4" />}
                onClick={() => setIsPaystackOpen(true)}
              >
                Pay with Paystack ({formatGHS(totalAmount)})
              </Button>
            )}
          </div>
        </div>
      )}

      {/* STEP 5: REGISTRATION SUCCESSFUL (Requirement #17) */}
      {currentStep === 5 && completedRegistration && (
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-cib-green-200 shadow-2xl text-center space-y-8 animate-in zoom-in-95 duration-300">
          <div className="w-20 h-20 rounded-full bg-cib-green-100 text-cib-green-700 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-cib-gold-600">
              ACCREDITATION CONFIRMED
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-cib-charcoal-900 font-display">
              Thank You for Registering!
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-md mx-auto">
              Your delegate registration has been processed successfully. An official receipt and digital badge pass have been sent to <strong>{completedRegistration.email}</strong>.
            </p>
          </div>

          {/* Registration ID Capsule */}
          <div className="inline-block p-4 rounded-2xl bg-slate-50 border-2 border-dashed border-cib-green-600 max-w-sm w-full mx-auto">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
              Official Registration ID
            </span>
            <span className="text-2xl font-mono font-black text-cib-green-800 tracking-wider">
              {completedRegistration.registration_number}
            </span>
          </div>

          {/* Ticket Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Button
              variant="primary"
              size="lg"
              leftIcon={<TicketIcon className="w-4 h-4" />}
              onClick={() =>
                navigate(`/events/${event.slug}/ticket/${completedRegistration.registration_number}`)
              }
            >
              View Digital Ticket
            </Button>

            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-200 hover:border-slate-300 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Go to My Delegate Portal
            </Link>
          </div>
        </div>
      )}

      {/* Paystack Checkout Simulator Modal */}
      {isPaystackOpen && (
        <PaystackModal
          isOpen={isPaystackOpen}
          onClose={() => setIsPaystackOpen(false)}
          amount={totalAmount}
          currency="GHS"
          email={email}
          eventTitle={event.title}
          registrationId={`reg-${Date.now()}`}
          onSuccess={(tx) => {
            setIsPaystackOpen(false);
            handleFinalizeRegistration(
              tx.channel === 'card' ? 'PAYSTACK_CARD' : 'PAYSTACK_MOMO',
              tx.reference
            );
          }}
        />
      )}
    </div>
  );
};
