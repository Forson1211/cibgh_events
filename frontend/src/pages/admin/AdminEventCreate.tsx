import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { useNavigate } from 'react-router-dom';
import {
  Check,
  ArrowRight,
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Mic,
  Award,
  Image as ImageIcon,
  CheckCircle2,
  Save
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { MOCK_CATEGORIES } from '../../data/mockData';
import { AttendanceType, EventStatus, EventItem } from '../../types';

export const AdminEventCreate: React.FC = () => {
  const navigate = useNavigate();
  const { addEvent, speakers: availableSpeakers, sponsors: availableSponsors } = useApp();

  const [currentStep, setCurrentStep] = useState<number>(1);

  // 1. Basic Information
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [category, setCategory] = useState(MOCK_CATEGORIES[0].name);
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');

  // 2. Date & Location
  const [startDate, setStartDate] = useState('2026-12-10');
  const [endDate, setEndDate] = useState('2026-12-11');
  const [startTime, setStartTime] = useState('08:30');
  const [endTime, setEndTime] = useState('17:00');
  const [location, setLocation] = useState('Accra, Ghana');
  const [venue, setVenue] = useState('Kempinski Hotel Gold Coast City');
  const [venueAddress, setVenueAddress] = useState('Ministries, Accra');
  const [eventType, setEventType] = useState<AttendanceType>('HYBRID');

  // 3. Registration
  const [registrationFee, setRegistrationFee] = useState<number>(1200);
  const [capacity, setCapacity] = useState<number>(500);
  const [registrationDeadline, setRegistrationDeadline] = useState('2026-12-05T23:59:59Z');

  // 4. Speakers (select from available)
  const [selectedSpeakerIds, setSelectedSpeakerIds] = useState<string[]>([availableSpeakers[0]?.id]);

  // 5. Agenda (simple item draft)
  const [agendaTitle, setAgendaTitle] = useState('Opening Ceremony & Governor Keynote');

  // 6. Sponsors
  const [selectedSponsorIds, setSelectedSponsorIds] = useState<string[]>([availableSponsors[0]?.id]);

  // 7. Media
  const [featuredImage, setFeaturedImage] = useState(
    'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80'
  );

  const steps = [
    'Basic Information',
    'Date & Location',
    'Registration',
    'Speakers',
    'Agenda',
    'Sponsors',
    'Media',
    'Review & Publish',
  ];

  const handleCreate = async (status: EventStatus) => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') || `cib-event-${Date.now()}`;

    const chosenSpeakers = availableSpeakers.filter((s) => selectedSpeakerIds.includes(s.id));
    const chosenSponsors = availableSponsors.filter((s) => selectedSponsorIds.includes(s.id));

    const newEvent: Omit<EventItem, 'id' | 'created_at' | 'updated_at'> = {
      title,
      slug,
      tagline,
      description,
      short_description: shortDescription,
      category,
      category_id: 'c1111111-1111-1111-1111-111111111111',
      featured_image: featuredImage,
      start_date: startDate,
      end_date: endDate,
      start_time: startTime,
      end_time: endTime,
      location,
      venue,
      venue_address: venueAddress,
      event_type: eventType,
      registration_fee: registrationFee,
      currency: 'GHS',
      capacity,
      registered_count: 0,
      registration_deadline: registrationDeadline,
      status,
      is_featured: false,
      themes: ['Banking Ethics', 'Financial Regulation', 'Digital Transformation'],
      why_attend: [
        { title: 'Industry Leadership', description: 'Hear from prominent banking governors and executives.' },
        { title: 'CPD Hours', description: 'Earn required continuous professional education units.' }
      ],
      speakers: chosenSpeakers,
      agenda: [
        {
          id: `ag-temp-${Date.now()}`,
          event_id: '',
          day_number: 1,
          date: startDate,
          start_time: startTime,
          end_time: '11:00',
          title: agendaTitle,
          session_type: 'KEYNOTE',
          room: 'Main Auditorium',
          speaker_ids: selectedSpeakerIds,
        }
      ],
      sponsors: chosenSponsors,
      registration_types: [
        {
          id: `rt-std-${Date.now()}`,
          event_id: '',
          name: 'CIB Member Delegate',
          code: 'MBR',
          price: registrationFee,
          currency: 'GHS',
          description: 'Accredited admission for members in good standing.',
          benefits: ['Auditorium seat', 'Executive lunch', 'CPD credits']
        }
      ],
      resources: [],
      gallery: [],
    };

    await addEvent(newEvent);
    navigate('/admin/events');
  };

  return (
    <AdminLayout
      title="Create New Event"
      subtitle="Follow the 8-step wizard to configure and publish an official CIB Ghana event programme."
      actions={
        <Button
          variant="outline"
          size="sm"
          leftIcon={<Save className="w-4 h-4" />}
          onClick={() => handleCreate('DRAFT')}
        >
          Save as Draft
        </Button>
      }
    >
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        {/* Multi-step progress bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
          <div className="flex items-center justify-between min-w-[640px]">
            {steps.map((stepName, idx) => {
              const stepNumber = idx + 1;
              const isPassed = currentStep > stepNumber;
              const isCurrent = currentStep === stepNumber;

              return (
                <div
                  key={idx}
                  onClick={() => setCurrentStep(stepNumber)}
                  className="flex flex-col items-center flex-1 cursor-pointer"
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isPassed
                        ? 'bg-cib-green-700 text-white'
                        : isCurrent
                        ? 'bg-cib-green-900 text-white ring-4 ring-cib-green-100'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {isPassed ? <Check className="w-3.5 h-3.5" /> : stepNumber}
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500 mt-1 text-center truncate max-w-[80px]">
                    {stepName}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          {/* STEP 1: BASIC INFORMATION */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-cib-charcoal-900 font-display">
                1. Basic Information
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 31st Annual National Banking & Ethics Conference"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-cib-green-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tagline / Theme
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. Accelerating Ethical Resilience in Stressed Global Markets"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-cib-green-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-cib-green-600 focus:outline-none bg-white"
                >
                  {MOCK_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Short Description
                </label>
                <input
                  type="text"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="A concise 1-2 sentence executive overview for event cards"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-cib-green-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Detailed Description
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Comprehensive narrative detailing curriculum, policy rationale, and target attendees..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-cib-green-600 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 2: DATE & LOCATION */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-cib-charcoal-900 font-display">
                2. Date & Location
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-cib-green-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-cib-green-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Daily Start Time
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-cib-green-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Daily End Time
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-cib-green-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Venue Name
                  </label>
                  <input
                    type="text"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    placeholder="e.g. Kempinski Hotel Gold Coast City"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-cib-green-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    City / Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Accra, Ghana"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-cib-green-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Attendance Mode
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['PHYSICAL', 'VIRTUAL', 'HYBRID'] as AttendanceType[]).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setEventType(mode)}
                      className={`p-3 rounded-xl border text-xs font-bold ${
                        eventType === mode
                          ? 'border-cib-green-700 bg-cib-green-50 text-cib-green-900'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: REGISTRATION */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-cib-charcoal-900 font-display">
                3. Registration Fees & Capacity
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Standard Delegate Fee (GHS)
                  </label>
                  <input
                    type="number"
                    value={registrationFee}
                    onChange={(e) => setRegistrationFee(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-cib-green-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Maximum Capacity (Seats)
                  </label>
                  <input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-cib-green-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: SPEAKERS */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-cib-charcoal-900 font-display">
                4. Assign Faculty & Keynote Speakers
              </h3>
              <p className="text-xs text-slate-500">
                Select speakers to include in the official programme schedule.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {availableSpeakers.map((spk) => {
                  const isSelected = selectedSpeakerIds.includes(spk.id);
                  return (
                    <div
                      key={spk.id}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedSpeakerIds(selectedSpeakerIds.filter((id) => id !== spk.id));
                        } else {
                          setSelectedSpeakerIds([...selectedSpeakerIds, spk.id]);
                        }
                      }}
                      className={`p-3 rounded-xl border cursor-pointer flex items-center gap-3 transition-colors ${
                        isSelected
                          ? 'border-cib-green-700 bg-cib-green-50/60'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <img
                        src={spk.photo_url}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover shrink-0"
                      />
                      <div className="truncate flex-1">
                        <span className="text-xs font-bold text-cib-charcoal-900 block truncate">
                          {spk.name}
                        </span>
                        <span className="text-[10px] text-slate-500 truncate block">
                          {spk.organization}
                        </span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-cib-green-700 shrink-0" />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: AGENDA */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-cib-charcoal-900 font-display">
                5. Session Agenda Blueprint
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Primary Plenary / Keynote Session Title
                </label>
                <input
                  type="text"
                  value={agendaTitle}
                  onChange={(e) => setAgendaTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-cib-green-600 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 6: SPONSORS */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-cib-charcoal-900 font-display">
                6. Attached Sponsors & Partners
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {availableSponsors.map((sp) => {
                  const isSelected = selectedSponsorIds.includes(sp.id);
                  return (
                    <div
                      key={sp.id}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedSponsorIds(selectedSponsorIds.filter((id) => id !== sp.id));
                        } else {
                          setSelectedSponsorIds([...selectedSponsorIds, sp.id]);
                        }
                      }}
                      className={`p-3 rounded-xl border text-center cursor-pointer ${
                        isSelected
                          ? 'border-cib-green-700 bg-cib-green-50'
                          : 'border-slate-200 bg-white'
                      }`}
                    >
                      <p className="text-xs font-bold text-cib-charcoal-900 truncate">{sp.name}</p>
                      <span className="text-[10px] text-cib-gold-600 font-bold uppercase">{sp.tier}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 7: MEDIA */}
          {currentStep === 7 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-cib-charcoal-900 font-display">
                7. Featured Event Photography
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Featured Image URL
                </label>
                <input
                  type="url"
                  value={featuredImage}
                  onChange={(e) => setFeaturedImage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-cib-green-600 focus:outline-none"
                />
              </div>

              <div className="aspect-video w-full max-w-md rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                <img src={featuredImage} alt="Preview" className="w-full h-full object-cover" />
              </div>
            </div>
          )}

          {/* STEP 8: REVIEW & PUBLISH */}
          {currentStep === 8 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-cib-charcoal-900 font-display">
                  8. Review & Publish Programme
                </h3>
                <p className="text-xs text-slate-500">
                  Verify all details before launching the event to the public calendar.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2 text-slate-700">
                <p><strong>Title:</strong> {title || 'Untitled Event'}</p>
                <p><strong>Category:</strong> {category}</p>
                <p><strong>Dates:</strong> {startDate} to {endDate} &bull; {venue}</p>
                <p><strong>Fee:</strong> GHS {registrationFee} &bull; Capacity: {capacity} seats</p>
                <p><strong>Speakers:</strong> {selectedSpeakerIds.length} faculty assigned</p>
                <p><strong>Mode:</strong> {eventType}</p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-4">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => handleCreate('OPEN_FOR_REGISTRATION')}
                >
                  Publish & Open for Registration
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => handleCreate('DRAFT')}
                >
                  Save as Draft Only
                </Button>
              </div>
            </div>
          )}

          {/* Step Navigation Controls */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            {currentStep > 1 ? (
              <Button
                type="button"
                variant="ghost"
                size="md"
                leftIcon={<ArrowLeft className="w-4 h-4" />}
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                Previous Step
              </Button>
            ) : <div />}

            {currentStep < 8 && (
              <Button
                type="button"
                variant="primary"
                size="md"
                showArrow
                onClick={() => setCurrentStep(currentStep + 1)}
              >
                Next Step
              </Button>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
