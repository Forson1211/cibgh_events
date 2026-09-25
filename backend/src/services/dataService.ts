import { EventItem, Registration, DigitalTicket, CreateRegistrationRequest, PaymentStatus } from '../types/index.js';
import { TicketService } from './ticketService.js';
import { getSupabase } from '../config/supabase.js';

// Pre-seeded events data matching the CIB Ghana events catalog
const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'cib-conf-2026',
    title: '29th National Banking Conference & Annual General Meeting',
    slug: 'national-banking-conference-2026',
    tagline: 'Navigating Disruption: Sustainable Banking in the Age of AI, Fintech & ESG Integration',
    description: 'The Chartered Institute of Bankers Ghana proudly convenes the 29th National Banking Conference at the prestigious Aqua Safari Resort in Ada Foah. Join industry leaders, governors, banking executives, and global technologists for high-level deliberations.',
    short_description: 'Ghana’s premier gathering of C-suite bankers, regulators, and international fintech innovators discussing the future of African financial services.',
    category: 'Conferences',
    category_id: 'cat-1',
    featured_image: '/aqua-safari-pool-promenade.png',
    banner_image: '/aqua-safari-lawn-night.jpg',
    start_date: '2026-11-18',
    end_date: '2026-11-20',
    start_time: '08:30',
    end_time: '17:30',
    location: 'Aqua Safari Resort, Ada Foah',
    venue: 'Aqua Safari Resort Waterfront Convention Hall',
    venue_address: 'Aqua Safari Resort, Ada Foah, Greater Accra Region, Ghana',
    event_type: 'HYBRID',
    registration_fee: 3500,
    currency: 'GHS',
    capacity: 650,
    registered_count: 482,
    registration_deadline: '2026-11-10',
    status: 'OPEN_FOR_REGISTRATION',
    is_featured: true,
    is_past: false,
    themes: [
      'Next-Gen Core Banking & AI Underwriting',
      'ESG Compliance & Green Finance Transition',
      'Cybersecurity & Anti-Financial Crime Surveillance',
      'AfCFTA Cross-Border Settlement Protocols',
    ],
    speakers: [],
    agenda: [],
    sponsors: [],
    registration_types: [
      {
        id: 'reg-cib-member',
        event_id: 'cib-conf-2026',
        name: 'CIB Chartered Member Pass',
        code: 'MEM-2026',
        price: 2800,
        currency: 'GHS',
        description: 'Discounted delegate pass for registered FCIB, ACIB, and Student Associates in good standing.',
        capacity: 350,
        spots_left: 68,
        benefits: ['Full 3-Day Executive Access', 'Conference Luncheons & Gala Dinner', 'CPD Accreditation Certificate', 'VIP Waterfront Networking Lounge'],
      },
      {
        id: 'reg-corporate',
        event_id: 'cib-conf-2026',
        name: 'Corporate & Non-Member Pass',
        code: 'CORP-2026',
        price: 3500,
        currency: 'GHS',
        description: 'Standard executive ticket for commercial bank staff, fintech partners, legal advisors, and consultants.',
        capacity: 250,
        spots_left: 74,
        benefits: ['Full 3-Day Access to All Plenaries', 'Welcome Reception & Networking Mixer', 'Masterclass Materials & Reports', 'Delegate Welcome Kit'],
      },
      {
        id: 'reg-virtual',
        event_id: 'cib-conf-2026',
        name: 'Virtual Global Pass',
        code: 'VIRT-2026',
        price: 1200,
        currency: 'GHS',
        description: 'Interactive high-definition livestream, real-time polling, and digital networking portal.',
        capacity: 1000,
        spots_left: 620,
        benefits: ['Full Live Stream Plenary Access', 'Interactive Q&A Session Participation', 'Digital Presentation Slides & Video Recordings', 'Digital Verification Certificate'],
      },
    ],
    created_at: '2026-01-15T00:00:00Z',
    updated_at: '2026-09-20T00:00:00Z',
  },
  {
    id: 'cib-fintech-2026',
    title: 'Executive Workshop on AI & Algorithmic Fraud Detection',
    slug: 'ai-fraud-detection-workshop-2026',
    tagline: 'Practical Machine Learning Architectures for Risk Management and Transaction Monitoring',
    description: 'An intensive two-day hands-on masterclass focusing on deploying real-time anomaly detection pipelines, synthetic identity fraud prevention, and supervisory compliance.',
    short_description: 'Technical masterclass for Chief Risk Officers, Compliance Heads, and IT Security Engineers.',
    category: 'Workshops',
    category_id: 'cat-2',
    featured_image: '/cib-conference-hall.jpg',
    start_date: '2026-10-14',
    end_date: '2026-10-15',
    start_time: '09:00',
    end_time: '16:00',
    location: 'CIB Ghana Head Office Auditorium, Accra',
    venue: 'Chartered Institute of Bankers Executive Lab',
    event_type: 'PHYSICAL',
    registration_fee: 1800,
    currency: 'GHS',
    capacity: 80,
    registered_count: 54,
    registration_deadline: '2026-10-08',
    status: 'OPEN_FOR_REGISTRATION',
    is_featured: false,
    is_past: false,
    speakers: [],
    agenda: [],
    sponsors: [],
    registration_types: [
      {
        id: 'reg-ws-standard',
        event_id: 'cib-fintech-2026',
        name: 'Standard Participant',
        code: 'WS-STD',
        price: 1800,
        currency: 'GHS',
        description: 'Complete 2-day workshop participation, lab exercises, and certification.',
        capacity: 80,
        spots_left: 26,
        benefits: ['Hands-on Sandbox Access', 'Course Documentation', 'Lunch & Refreshments', 'CIB CPD Certificate'],
      },
    ],
    created_at: '2026-02-10T00:00:00Z',
    updated_at: '2026-09-18T00:00:00Z',
  },
];

// In-memory persistent collections
const eventsStore = new Map<string, EventItem>(INITIAL_EVENTS.map((e) => [e.id, e]));
const registrationsStore = new Map<string, Registration>();
const ticketsStore = new Map<string, DigitalTicket>();

// Pre-seed an initial registration for demonstration
const sampleRegNumber = 'CIB-2026-DEMO1';
const sampleRegistration: Registration = {
  id: 'reg-demo-1',
  event_id: 'cib-conf-2026',
  event_title: '29th National Banking Conference & Annual General Meeting',
  registration_number: sampleRegNumber,
  registration_type_id: 'reg-cib-member',
  registration_type_name: 'CIB Chartered Member Pass',
  first_name: 'Kofi',
  last_name: 'Mensah',
  email: 'kofi.mensah@ghana-commercial-bank.com',
  phone: '+233 24 123 4567',
  organization: 'GCB Bank PLC',
  job_title: 'Head of Treasury',
  country: 'Ghana',
  cib_member_id: 'FCIB-44910',
  attendance_type: 'PHYSICAL',
  total_amount: 2800,
  currency: 'GHS',
  payment_status: 'SUCCESSFUL',
  payment_reference: 'T_DEMO_REF_123',
  payment_method: 'PAYSTACK_MOMO',
  check_in_status: 'REGISTERED',
  created_at: new Date().toISOString(),
};
registrationsStore.set(sampleRegistration.id, sampleRegistration);

// Initialize sample ticket
TicketService.issueDigitalTicket(sampleRegistration, INITIAL_EVENTS[0]).then((ticket) => {
  ticketsStore.set(ticket.registration_number, ticket);
  ticketsStore.set(ticket.registration_id, ticket);
});

export class DataService {
  // 1. Events
  static async getAllEvents(filters?: {
    category?: string;
    search?: string;
    status?: string;
    isPast?: boolean;
  }): Promise<EventItem[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        let query = supabase.from('events').select('*, registration_types(*)');
        if (filters?.status) query = query.eq('status', filters.status);
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data as EventItem[];
        }
      } catch (err) {
        console.warn('Supabase query failed, falling back to local store:', err);
      }
    }

    let list = Array.from(eventsStore.values());
    if (filters?.category) {
      list = list.filter((e) => e.category.toLowerCase() === filters.category?.toLowerCase());
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (e) => e.title.toLowerCase().includes(q) || e.location.toLowerCase().includes(q)
      );
    }
    if (filters?.isPast !== undefined) {
      list = list.filter((e) => !!e.is_past === filters.isPast);
    }
    return list;
  }

  static async getEventBySlugOrId(identifier: string): Promise<EventItem | null> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data } = await supabase
          .from('events')
          .select('*, registration_types(*)')
          .or(`id.eq.${identifier},slug.eq.${identifier}`)
          .single();
        if (data) return data as EventItem;
      } catch {}
    }

    for (const event of eventsStore.values()) {
      if (event.id === identifier || event.slug === identifier) {
        return event;
      }
    }
    return null;
  }

  // 2. Registrations
  static async createRegistration(input: CreateRegistrationRequest): Promise<{
    registration: Registration;
    ticket: DigitalTicket;
  }> {
    const event = await this.getEventBySlugOrId(input.event_id);
    if (!event) throw new Error('Event not found');

    const regType = event.registration_types.find((t) => t.id === input.registration_type_id);
    const amount = regType ? regType.price : event.registration_fee;
    const tierName = regType ? regType.name : 'Standard Delegate';

    const regNumber = TicketService.generateRegistrationNumber();
    const id = `reg-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const registration: Registration = {
      id,
      event_id: event.id,
      event_title: event.title,
      registration_number: regNumber,
      registration_type_id: input.registration_type_id,
      registration_type_name: tierName,
      first_name: input.first_name,
      last_name: input.last_name,
      email: input.email,
      phone: input.phone,
      organization: input.organization,
      job_title: input.job_title,
      country: input.country || 'Ghana',
      cib_member_id: input.cib_member_id,
      attendance_type: input.attendance_type,
      dietary_requirements: input.dietary_requirements,
      special_assistance: input.special_assistance,
      total_amount: amount,
      currency: 'GHS',
      payment_status: amount === 0 ? 'SUCCESSFUL' : 'PENDING',
      check_in_status: 'REGISTERED',
      created_at: new Date().toISOString(),
    };

    // Save registration
    registrationsStore.set(registration.id, registration);

    // Issue digital ticket
    const ticket = await TicketService.issueDigitalTicket(registration, event);
    ticketsStore.set(ticket.registration_number, ticket);
    ticketsStore.set(ticket.registration_id, ticket);

    // Update event registered count
    event.registered_count = (event.registered_count || 0) + 1;

    return { registration, ticket };
  }

  static async getRegistrationById(id: string): Promise<Registration | null> {
    return registrationsStore.get(id) || null;
  }

  static async getRegistrationByNumber(regNumber: string): Promise<Registration | null> {
    for (const reg of registrationsStore.values()) {
      if (reg.registration_number.toLowerCase() === regNumber.toLowerCase()) {
        return reg;
      }
    }
    return null;
  }

  static async updatePaymentStatus(
    registrationId: string,
    status: PaymentStatus,
    reference?: string,
    method?: 'PAYSTACK_CARD' | 'PAYSTACK_MOMO' | 'BANK_TRANSFER'
  ): Promise<Registration | null> {
    const reg = registrationsStore.get(registrationId);
    if (!reg) return null;

    reg.payment_status = status;
    if (reference) reg.payment_reference = reference;
    if (method) reg.payment_method = method;

    return reg;
  }

  // 3. Tickets & Check-In
  static async getTicket(identifier: string): Promise<DigitalTicket | null> {
    // identifier could be registration_number or registration_id
    if (ticketsStore.has(identifier)) {
      return ticketsStore.get(identifier)!;
    }
    for (const t of ticketsStore.values()) {
      if (
        t.registration_number.toLowerCase() === identifier.toLowerCase() ||
        t.registration_id === identifier ||
        t.id === identifier
      ) {
        return t;
      }
    }
    return null;
  }

  static async checkInAttendee(ticketIdentifier: string): Promise<{
    success: boolean;
    ticket?: DigitalTicket;
    message: string;
  }> {
    const ticket = await this.getTicket(ticketIdentifier);
    if (!ticket) {
      return { success: false, message: 'Ticket not found or invalid QR code.' };
    }

    if (ticket.check_in_status === 'CHECKED_IN') {
      return {
        success: false,
        ticket,
        message: 'Attendee has ALREADY checked in for this event.',
      };
    }

    ticket.check_in_status = 'CHECKED_IN';
    const reg = registrationsStore.get(ticket.registration_id);
    if (reg) {
      reg.check_in_status = 'CHECKED_IN';
      reg.check_in_time = new Date().toISOString();
    }

    return {
      success: true,
      ticket,
      message: `Successfully checked in ${ticket.attendee_name} (${ticket.registration_tier})`,
    };
  }

  // 4. Admin stats
  static async getAdminStats() {
    const allEvents = Array.from(eventsStore.values());
    const allRegistrations = Array.from(registrationsStore.values());

    const totalRegistrations = allRegistrations.length;
    const paidRegistrations = allRegistrations.filter((r) => r.payment_status === 'SUCCESSFUL');
    const totalRevenue = paidRegistrations.reduce((acc, r) => acc + r.total_amount, 0);
    const checkedInCount = allRegistrations.filter((r) => r.check_in_status === 'CHECKED_IN').length;

    return {
      total_events: allEvents.length,
      active_events: allEvents.filter((e) => e.status === 'OPEN_FOR_REGISTRATION').length,
      total_registrations: totalRegistrations,
      paid_registrations: paidRegistrations.length,
      total_revenue_ghs: totalRevenue,
      checked_in_attendees: checkedInCount,
    };
  }
}
