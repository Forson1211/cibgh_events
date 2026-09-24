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
  const { getEventBySlug, addRegistration, setRegisteredUserEmail, setRegisteredUserName } = useApp();

  const event = slug ? getEventBySlug(slug) : undefined;

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [membershipCategory, setMembershipCategory] = useState<string>('ACIB');
  const [privacyAgreed, setPrivacyAgreed] = useState<boolean>(false);
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
  const [occupancy, setOccupancy] = useState<'SINGLE' | 'DOUBLE'>('SINGLE');
  const [selectedMasterclass, setSelectedMasterclass] = useState<string>(
    'Deploying AI to Combat Modern Fraud in International Trade Finance'
  );
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

  const packagePrice = occupancy === 'SINGLE' ? 5600 : 4000;
  const finalPayable = packagePrice;

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
      registration_type_id: occupancy === 'SINGLE' ? 'early-bird-single' : 'early-bird-double',
      registration_type_name: `${occupancy === 'SINGLE' ? 'Single' : 'Double'} Occupancy Package`,
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      organization,
      job_title: jobTitle || 'Delegate',
      country: country || 'Ghana',
      cib_member_id: cibMemberId || undefined,
      attendance_type: attendanceType,
      dietary_requirements: dietaryRequirements,
      special_assistance: `Masterclass: ${selectedMasterclass}`,
      total_amount: finalPayable,
      currency: 'GHS',
      payment_status: 'SUCCESSFUL',
      payment_reference: ref || `PAY_${Date.now()}`,
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
    setRegisteredUserEmail(email);
    setRegisteredUserName(firstName);
    triggerConfetti();
    // Navigate directly to My Portal
    setTimeout(() => navigate('/my-portal'), 600);
  };

  const stepTitles = [
    'Category',
    'Your Details',
    'Attendance',
    'Payment',
    'Confirmation',
  ];

  return (
    <div className="min-h-screen relative py-10 sm:py-16 pb-20">
      {/* Fixed Full-Viewport Background - Stays static while form and footer scroll over it */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#032616]">
        <img
          src="/aqua-safari-register-banner.jpg"
          alt="Aqua Safari Resort, Ada - Venue"
          fetchPriority="high"
          loading="eager"
          decoding="sync"
          className="w-full h-full object-cover object-center brightness-100 contrast-100"
        />
        {/* Soft light overlay so the resort photo colors (pool, lights, chalets) show vividly */}
        <div className="absolute inset-0 bg-black/15" />
      </div>

      {/* Centered Main White Form Card (Solid White, No Round Edges) */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="bg-white rounded-none shadow-[0_20px_60px_rgba(0,0,0,0.35)] border border-slate-200 p-6 sm:p-10 space-y-8">
          {/* Header Title Section inside the White Card */}
          <div className="space-y-2 text-center border-b border-slate-100 pb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0A5C36]">
              EVENT REGISTRATION
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-cib-charcoal-900 font-display">
              {event.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              {event.venue} &bull; {event.start_date}
            </p>
          </div>

          {/* 5-Step Progress Indicator with Connecting Line Navigation */}
          {currentStep < 5 && (
            <div className="bg-slate-50/80 p-5 border border-slate-200 relative">
              <div className="relative flex items-center justify-between">
                {/* Connecting Line Behind Circles */}
                <div className="absolute top-[18px] left-[10%] right-[10%] -translate-y-1/2 h-[2px] bg-slate-200 z-0">
                  <div
                    className="h-full bg-cib-green-700 transition-all duration-300 ease-out"
                    style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
                  />
                </div>

                {[1, 2, 3, 4, 5].map((step) => {
                  const isCompleted = currentStep > step;
                  const isCurrent = currentStep === step;

                  return (
                    <button
                      key={step}
                      type="button"
                      onClick={() => {
                        if (step <= currentStep) {
                          setCurrentStep(step);
                        } else if (step === 2 && membershipCategory && privacyAgreed) {
                          setCurrentStep(2);
                        } else if (step === 3 && membershipCategory && privacyAgreed && firstName && lastName && email && phone && organization) {
                          setCurrentStep(3);
                        } else if (step === 4 && membershipCategory && privacyAgreed && firstName && lastName && email && phone && organization) {
                          setCurrentStep(4);
                        }
                      }}
                      className="flex flex-col items-center flex-1 relative z-10 group focus:outline-none"
                    >
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-200 ${
                          isCompleted
                            ? 'bg-cib-green-700 text-white hover:bg-cib-green-800 ring-2 ring-white shadow-sm cursor-pointer'
                            : isCurrent
                            ? 'bg-cib-green-900 text-white ring-4 ring-cib-green-100 ring-offset-1 shadow-sm'
                            : 'bg-white border-2 border-slate-300 text-slate-400 group-hover:border-slate-400'
                        }`}
                      >
                        {isCompleted ? <Check className="w-4 h-4 stroke-[2.5]" /> : step}
                      </div>
                      <span
                        className={`hidden sm:block text-[11px] font-semibold mt-2 text-center truncate max-w-[110px] transition-colors ${
                          isCurrent
                            ? 'text-cib-green-900 font-bold'
                            : isCompleted
                            ? 'text-slate-700 group-hover:text-cib-green-700'
                            : 'text-slate-400'
                        }`}
                      >
                        {stepTitles[step - 1]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 1: MEMBERSHIP CATEGORY & PRIVACY NOTICE */}
          {currentStep === 1 && (
            <div className="space-y-6">
              {/* Question Heading */}
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-800">
                  Which membership category best describes you?
                </h3>
              </div>

              {/* 4 Category Cards (2x2 Grid) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                {[
                  { id: 'ACIB', title: 'ACIB', subtitle: 'Associate Member' },
                  { id: 'FCIB', title: 'FCIB', subtitle: 'Fellow' },
                  { id: 'Student', title: 'Student', subtitle: 'Student Member' },
                  { id: 'Non-Member', title: 'Non-Member', subtitle: 'Not yet a member' },
                ].map((item) => {
                  const isSelected = membershipCategory === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setMembershipCategory(item.id)}
                      className={`p-6 rounded-2xl cursor-pointer transition-all duration-200 text-center border ${
                        isSelected
                          ? 'border-[#008129] bg-[#008129]/5 ring-2 ring-[#008129]/20 shadow-sm'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="text-base sm:text-lg font-black text-slate-900">
                        {item.title}
                      </div>
                      <div className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
                        {item.subtitle}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* PRIVACY NOTICE Box */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 sm:p-6 space-y-4">
                <div className="space-y-2">
                  <div className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    PRIVACY NOTICE
                  </div>
                  <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-normal">
                    The information you provide is collected by the Chartered Institute of Bankers, Ghana (CIB Ghana) to process your registration and communicate with you about the 30th National Banking &amp; Ethics Conference. It is used solely for registration, communication and administration relating to the conference.
                  </p>
                </div>

                {/* Checkbox */}
                <label className="flex items-start gap-3 cursor-pointer select-none group pt-1">
                  <input
                    type="checkbox"
                    checked={privacyAgreed}
                    onChange={(e) => setPrivacyAgreed(e.target.checked)}
                    className="mt-0.5 sm:mt-1 w-4 h-4 rounded text-[#008129] focus:ring-[#008129] border-slate-300 cursor-pointer accent-[#008129]"
                  />
                  <span className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                    <strong className="font-bold text-slate-800">I acknowledge and agree</strong> that I have read the privacy notice above and understand that CIB Ghana will collect and process the information I provide for registration, communication and administration relating to the 30th National Banking &amp; Ethics Conference.
                  </span>
                </label>
              </div>

              {/* Continue CTA */}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  disabled={!membershipCategory || !privacyAgreed}
                  onClick={() => setCurrentStep(2)}
                  className={`inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm sm:text-base transition-all shadow-md ${
                    membershipCategory && privacyAgreed
                      ? 'bg-[#1B7E3E] hover:bg-[#166632] text-white active:scale-95 cursor-pointer'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <span>Continue to Your Details</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: PERSONAL INFORMATION (Filled, borderless inputs with icons matching user screenshot) */}
          {currentStep === 2 && (
            <form onSubmit={handlePersonalSubmit} className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-cib-charcoal-900 font-display">
                  Your Details
                </h2>
                <p className="text-xs text-slate-500">
                  Please provide your contact information for the event pass.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">
                    First Name *
                  </label>
                  <div className="relative flex items-center bg-[#F1F3F5] rounded-none px-3.5 py-3 transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-cib-green-600">
                    <User className="w-4 h-4 text-slate-400 shrink-0 mr-2.5" />
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Kwesi"
                      className="w-full bg-transparent border-none outline-none text-sm text-slate-800 placeholder:text-slate-400 p-0 focus:ring-0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">
                    Last Name *
                  </label>
                  <div className="relative flex items-center bg-[#F1F3F5] rounded-none px-3.5 py-3 transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-cib-green-600">
                    <User className="w-4 h-4 text-slate-400 shrink-0 mr-2.5" />
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Mensah"
                      className="w-full bg-transparent border-none outline-none text-sm text-slate-800 placeholder:text-slate-400 p-0 focus:ring-0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">
                    Email Address *
                  </label>
                  <div className="relative flex items-center bg-[#F1F3F5] rounded-none px-3.5 py-3 transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-cib-green-600">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0 mr-2.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="kwesi.mensah@bank.com"
                      className="w-full bg-transparent border-none outline-none text-sm text-slate-800 placeholder:text-slate-400 p-0 focus:ring-0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">
                    Phone Number *
                  </label>
                  <div className="relative flex items-center bg-[#F1F3F5] rounded-none px-3.5 py-3 transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-cib-green-600">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0 mr-2.5" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+233 24 000 0000"
                      className="w-full bg-transparent border-none outline-none text-sm text-slate-800 placeholder:text-slate-400 p-0 focus:ring-0"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">
                    Bank / Organization *
                  </label>
                  <div className="relative flex items-center bg-[#F1F3F5] rounded-none px-3.5 py-3 transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-cib-green-600">
                    <Building className="w-4 h-4 text-slate-400 shrink-0 mr-2.5" />
                    <input
                      type="text"
                      required
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="e.g. Standard Chartered Bank Ghana"
                      className="w-full bg-transparent border-none outline-none text-sm text-slate-800 placeholder:text-slate-400 p-0 focus:ring-0"
                    />
                  </div>
                </div>

                {selectedTier?.name?.toLowerCase().includes('member') && (
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">
                      CIB Ghana Membership PIN (Optional)
                    </label>
                    <div className="relative flex items-center bg-[#F1F3F5] rounded-none px-3.5 py-3 transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-cib-green-600">
                      <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0 mr-2.5" />
                      <input
                        type="text"
                        value={cibMemberId}
                        onChange={(e) => setCibMemberId(e.target.value)}
                        placeholder="e.g. ACIB-2021-0492"
                        className="w-full bg-transparent border-none outline-none text-sm text-slate-800 placeholder:text-slate-400 p-0 focus:ring-0"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <Button
                  type="button"
                  variant="ghost"
                  size="md"
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                  className="rounded-none"
                  onClick={() => setCurrentStep(1)}
                >
                  Back
                </Button>
                <Button type="submit" variant="primary" size="lg" showArrow className="rounded-none">
                  Continue to Preferences
                </Button>
              </div>
            </form>
          )}

          {/* STEP 3: EVENT INFORMATION & ATTENDANCE MODE (Borderless filled cards) */}
          {currentStep === 3 && (
            <form onSubmit={handlePreferencesSubmit} className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-cib-charcoal-900 font-display">
                  Attendance Mode
                </h2>
                <p className="text-xs text-slate-500">
                  Select how you will participate in the sessions.
                </p>
              </div>

              {/* Attendance Type Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: 'PHYSICAL', title: 'In-Person Attendance', desc: 'Join onsite at the conference venue in Accra.' },
                  { id: 'VIRTUAL', title: 'Virtual Livestream', desc: 'Access high-definition livestream broadcast & Q&A.' },
                ].map((item) => {
                  const isSelected = attendanceType === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setAttendanceType(item.id as AttendanceType)}
                      className={`p-4 rounded-none cursor-pointer transition-all flex items-start gap-3 border-none outline-none ${
                        isSelected
                          ? 'bg-[#E5F5EB] shadow-sm'
                          : 'bg-[#F1F3F5] hover:bg-[#E8EAED]'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 shrink-0 transition-colors ${
                          isSelected ? 'bg-cib-green-700 text-white' : 'bg-slate-300'
                        }`}
                      >
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <div className="space-y-1">
                        <h4 className={`text-sm font-bold ${isSelected ? 'text-cib-green-950' : 'text-slate-900'}`}>
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-500">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <Button
                  type="button"
                  variant="ghost"
                  size="md"
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                  className="rounded-none"
                  onClick={() => setCurrentStep(2)}
                >
                  Back
                </Button>
                <Button type="submit" variant="primary" size="lg" showArrow className="rounded-none">
                  Continue to Payment
                </Button>
              </div>
            </form>
          )}

          {/* STEP 4: ACCOMMODATION & EVENT PACKAGES (PAYMENT STAGE) */}
          {currentStep === 4 && (
            <div className="space-y-6">
              {/* Header Title & Subtitle */}
              <div className="space-y-1">
                <h2 className="text-2xl sm:text-[26px] font-black text-slate-900 font-display">
                  Accommodation &amp; Event Packages
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Accommodation for two nights, conference and Masterclass fee, dinner for 2 nights and other complimentary activities.
                </p>
              </div>

              {/* Early Bird Package Yellow Highlight Box */}
              <div className="rounded-2xl border border-[#F5A623] bg-[#FFFDF0] p-4 sm:p-5 space-y-1">
                <div className="text-xs sm:text-sm font-black text-[#A16207] uppercase tracking-wide">
                  EARLY BIRD PACKAGE &mdash; DEADLINE 20TH OCTOBER 2026
                </div>
                <div className="text-xs sm:text-[13px] text-slate-600 font-medium">
                  Book before the deadline to lock in the discounted rate.
                </div>
              </div>

              {/* Choose your occupancy */}
              <div className="space-y-3">
                <h3 className="text-sm font-black text-slate-800">
                  Choose your occupancy
                </h3>
                <div className="grid grid-cols-2 gap-3.5 sm:gap-4">
                  {/* Single Occupancy */}
                  <div
                    onClick={() => setOccupancy('SINGLE')}
                    className={`p-5 rounded-2xl cursor-pointer transition-all duration-200 text-center border-2 ${
                      occupancy === 'SINGLE'
                        ? 'border-[#008129] bg-[#008129]/5 ring-2 ring-[#008129]/20 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="text-sm sm:text-base font-black text-slate-900">
                      Single Occupancy
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
                      GHS 5,600
                    </div>
                  </div>

                  {/* Double Occupancy */}
                  <div
                    onClick={() => setOccupancy('DOUBLE')}
                    className={`p-5 rounded-2xl cursor-pointer transition-all duration-200 text-center border-2 ${
                      occupancy === 'DOUBLE'
                        ? 'border-[#008129] bg-[#008129]/5 ring-2 ring-[#008129]/20 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="text-sm sm:text-base font-black text-slate-900">
                      Double Occupancy
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
                      GHS 4,000
                    </div>
                  </div>
                </div>
              </div>

              {/* Kindly select your preferred Masterclass */}
              <div className="space-y-3">
                <h3 className="text-sm font-black text-slate-800">
                  Kindly select your preferred Masterclass
                </h3>
                <div className="space-y-2.5">
                  {[
                    'Deploying AI to Combat Modern Fraud in International Trade Finance',
                    'Cybersecurity and Fraud Detection',
                    'Virtual Assets and Impact',
                  ].map((option) => {
                    const isSelected = selectedMasterclass === option;
                    return (
                      <div
                        key={option}
                        onClick={() => setSelectedMasterclass(option)}
                        className={`flex items-center gap-3.5 p-4 rounded-2xl cursor-pointer transition-all border ${
                          isSelected
                            ? 'border-[#008129] bg-[#008129]/5 ring-1 ring-[#008129]/20 shadow-sm'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                            isSelected ? 'border-[#008129]' : 'border-slate-400'
                          }`}
                        >
                          {isSelected && <div className="w-2 h-2 rounded-full bg-[#008129]" />}
                        </div>
                        <span className="text-xs sm:text-sm text-slate-800 font-semibold leading-snug">
                          {option}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Total Bar */}
              <div className="flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-sm font-bold text-slate-700">Total</span>
                <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  GHS {finalPayable.toLocaleString()}
                </span>
              </div>

              {/* Proceed to Payment CTA */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPaystackOpen(true)}
                  className="w-full py-4 rounded-full bg-[#1B7E3E] hover:bg-[#166632] active:scale-[0.99] text-white font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
                >
                  <span>Proceed to Payment</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>

                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors inline-flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Attendance</span>
                  </button>
                </div>
              </div>
            </div>
          )}


          {/* STEP 5: REGISTRATION SUCCESSFUL */}
          {currentStep === 5 && completedRegistration && (
            <div className="text-center space-y-8 py-4 animate-in zoom-in-95 duration-300">
              <div className="w-20 h-20 rounded-none bg-cib-green-100 text-cib-green-700 flex items-center justify-center mx-auto shadow-inner">
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
              <div className="inline-block p-4 rounded-none bg-slate-50 border-2 border-dashed border-cib-green-600 max-w-sm w-full mx-auto">
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
                  className="!rounded-none"
                  onClick={() =>
                    navigate(`/events/${event.slug}/ticket/${completedRegistration.registration_number}`)
                  }
                >
                  View Digital Ticket
                </Button>

                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-none border border-slate-200 hover:border-slate-300 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Go to My Delegate Portal
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Paystack Checkout Simulator Modal */}
      {isPaystackOpen && (
        <PaystackModal
          isOpen={isPaystackOpen}
          onClose={() => setIsPaystackOpen(false)}
          amount={finalPayable}
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

