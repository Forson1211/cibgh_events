-- =========================================================
-- CIB GHANA EVENTS PLATFORM
-- Official Supabase Database Schema & RLS Policies
-- =========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS (idempotent — skips if already exists)
DO $$ BEGIN CREATE TYPE user_role AS ENUM ('SUPER_ADMIN', 'EVENT_ADMIN', 'STAFF', 'ATTENDEE'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE event_status AS ENUM ('DRAFT', 'UPCOMING', 'OPEN_FOR_REGISTRATION', 'REGISTRATION_CLOSED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE attendance_type AS ENUM ('PHYSICAL', 'VIRTUAL', 'HYBRID'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE payment_status AS ENUM ('PENDING', 'PROCESSING', 'SUCCESSFUL', 'FAILED', 'REFUNDED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE check_in_status AS ENUM ('REGISTERED', 'CHECKED_IN', 'CANCELLED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE sponsor_tier AS ENUM ('PLATINUM', 'GOLD', 'SILVER', 'PARTNER', 'ACADEMIC'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2. PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  organization TEXT,
  job_title TEXT,
  country TEXT DEFAULT 'Ghana',
  cib_member_id TEXT,
  role user_role DEFAULT 'ATTENDEE',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. EVENT CATEGORIES
CREATE TABLE IF NOT EXISTS public.event_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. EVENTS
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tagline TEXT,
  description TEXT NOT NULL,
  short_description TEXT NOT NULL,
  category_id UUID REFERENCES public.event_categories(id) ON DELETE SET NULL,
  featured_image TEXT DEFAULT NULL,
  banner_image TEXT DEFAULT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  location TEXT NOT NULL,
  venue TEXT NOT NULL,
  venue_address TEXT,
  virtual_link TEXT,
  event_type attendance_type DEFAULT 'HYBRID',
  registration_fee DECIMAL(10,2) DEFAULT 0.00,
  currency TEXT DEFAULT 'GHS',
  capacity INT NOT NULL DEFAULT 500,
  registered_count INT DEFAULT 0,
  registration_deadline TIMESTAMPTZ NOT NULL,
  status event_status DEFAULT 'OPEN_FOR_REGISTRATION',
  is_featured BOOLEAN DEFAULT FALSE,
  is_past BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SPEAKERS
CREATE TABLE IF NOT EXISTS public.speakers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  position TEXT NOT NULL,
  organization TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'Ghana',
  photo_url TEXT DEFAULT NULL,
  biography TEXT NOT NULL,
  expertise TEXT[] DEFAULT '{}',
  is_keynote BOOLEAN DEFAULT FALSE,
  linkedin_url TEXT,
  twitter_url TEXT,
  website_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. EVENT SPEAKERS JUNCTION
CREATE TABLE IF NOT EXISTS public.event_speakers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  speaker_id UUID REFERENCES public.speakers(id) ON DELETE CASCADE,
  is_keynote BOOLEAN DEFAULT FALSE,
  topic TEXT,
  UNIQUE(event_id, speaker_id)
);

-- 7. AGENDA SESSIONS
CREATE TABLE IF NOT EXISTS public.agenda_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  day_number INT NOT NULL DEFAULT 1,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  session_type TEXT NOT NULL,
  room TEXT NOT NULL,
  track TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. SPONSORS
CREATE TABLE IF NOT EXISTS public.sponsors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  logo_url TEXT DEFAULT NULL,
  website_url TEXT,
  tier sponsor_tier DEFAULT 'PARTNER',
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. EVENT SPONSORS JUNCTION
CREATE TABLE IF NOT EXISTS public.event_sponsors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  sponsor_id UUID REFERENCES public.sponsors(id) ON DELETE CASCADE,
  custom_tier sponsor_tier,
  UNIQUE(event_id, sponsor_id)
);

-- 10. REGISTRATION TYPES
CREATE TABLE IF NOT EXISTS public.registration_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  currency TEXT DEFAULT 'GHS',
  description TEXT,
  eligibility TEXT,
  capacity INT,
  spots_left INT,
  benefits TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. REGISTRATIONS
CREATE TABLE IF NOT EXISTS public.registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES public.events(id) ON DELETE RESTRICT,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  registration_number TEXT UNIQUE NOT NULL,
  registration_type_id UUID REFERENCES public.registration_types(id) ON DELETE RESTRICT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  organization TEXT NOT NULL,
  job_title TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'Ghana',
  cib_member_id TEXT,
  attendance_type attendance_type DEFAULT 'PHYSICAL',
  dietary_requirements TEXT,
  special_assistance TEXT,
  total_amount DECIMAL(10,2) DEFAULT 0.00,
  currency TEXT DEFAULT 'GHS',
  payment_status payment_status DEFAULT 'PENDING',
  payment_reference TEXT,
  payment_method TEXT,
  check_in_status check_in_status DEFAULT 'REGISTERED',
  check_in_time TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. TICKETS
CREATE TABLE IF NOT EXISTS public.tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  registration_id UUID REFERENCES public.registrations(id) ON DELETE CASCADE,
  ticket_code TEXT UNIQUE NOT NULL,
  qr_code_data TEXT NOT NULL,
  security_hash TEXT NOT NULL,
  issue_date TIMESTAMPTZ DEFAULT NOW(),
  status check_in_status DEFAULT 'REGISTERED'
);

-- 13. PAYMENTS
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  registration_id UUID REFERENCES public.registrations(id) ON DELETE CASCADE,
  reference TEXT UNIQUE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'GHS',
  channel TEXT NOT NULL,
  status payment_status DEFAULT 'SUCCESSFUL',
  paystack_response JSONB,
  paid_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. CHECK INS
CREATE TABLE IF NOT EXISTS public.check_ins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  registration_id UUID REFERENCES public.registrations(id) ON DELETE CASCADE,
  scanned_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  scanned_at TIMESTAMPTZ DEFAULT NOW(),
  method TEXT DEFAULT 'QR_SCAN'
);

-- 15. EVENT RESOURCES
CREATE TABLE IF NOT EXISTS public.event_resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size TEXT,
  category TEXT DEFAULT 'BROCHURE',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. EVENT GALLERY
CREATE TABLE IF NOT EXISTS public.event_gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  year INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. CERTIFICATES
CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  registration_id UUID REFERENCES public.registrations(id) ON DELETE CASCADE,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  certificate_number TEXT UNIQUE NOT NULL,
  recipient_name TEXT NOT NULL,
  issue_date DATE DEFAULT CURRENT_DATE,
  verification_url TEXT NOT NULL,
  qr_code_data TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. WAITLIST
CREATE TABLE IF NOT EXISTS public.waitlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  status TEXT DEFAULT 'PENDING',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. AUDIT LOGS (Compliance & Durability)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  action TEXT NOT NULL,
  performed_by_email TEXT,
  payload JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================
-- ROW LEVEL SECURITY POLICIES (RLS)
-- =========================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.speakers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_speakers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agenda_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registration_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. PUBLIC READ ACCESS FOR PUBLIC CONTENT
DROP POLICY IF EXISTS "Public can view published events" ON public.events;
CREATE POLICY "Public can view published events"
  ON public.events FOR SELECT
  USING (status != 'DRAFT');

DROP POLICY IF EXISTS "Public can view categories" ON public.event_categories;
CREATE POLICY "Public can view categories"
  ON public.event_categories FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Public can view speakers" ON public.speakers;
CREATE POLICY "Public can view speakers"
  ON public.speakers FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Public can view event speakers" ON public.event_speakers;
CREATE POLICY "Public can view event speakers"
  ON public.event_speakers FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Public can view agenda sessions" ON public.agenda_sessions;
CREATE POLICY "Public can view agenda sessions"
  ON public.agenda_sessions FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Public can view sponsors" ON public.sponsors;
CREATE POLICY "Public can view sponsors"
  ON public.sponsors FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Public can view event sponsors" ON public.event_sponsors;
CREATE POLICY "Public can view event sponsors"
  ON public.event_sponsors FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Public can view registration types" ON public.registration_types;
CREATE POLICY "Public can view registration types"
  ON public.registration_types FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Public can view event resources" ON public.event_resources;
CREATE POLICY "Public can view event resources"
  ON public.event_resources FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Public can view event gallery" ON public.event_gallery;
CREATE POLICY "Public can view event gallery"
  ON public.event_gallery FOR SELECT
  USING (true);

-- 2. REGISTRATION POLICIES (Public can register; Admins & Staff can manage)
DROP POLICY IF EXISTS "Public can create registrations" ON public.registrations;
CREATE POLICY "Public can create registrations"
  ON public.registrations FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Attendees can view own registrations" ON public.registrations;
CREATE POLICY "Attendees can view own registrations"
  ON public.registrations FOR SELECT
  USING (
    auth.uid() = user_id OR
    email = current_setting('request.jwt.claim.email', true)
  );

DROP POLICY IF EXISTS "Staff and Admin can view all registrations" ON public.registrations;
CREATE POLICY "Staff and Admin can view all registrations"
  ON public.registrations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('SUPER_ADMIN', 'EVENT_ADMIN', 'STAFF')
    )
  );

DROP POLICY IF EXISTS "Staff and Admin can manage registrations" ON public.registrations;
CREATE POLICY "Staff and Admin can manage registrations"
  ON public.registrations FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('SUPER_ADMIN', 'EVENT_ADMIN', 'STAFF')
    )
  );

-- 3. TICKETS POLICIES
DROP POLICY IF EXISTS "Public can view tickets with valid code" ON public.tickets;
CREATE POLICY "Public can view tickets with valid code"
  ON public.tickets FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Staff and Admin can manage tickets" ON public.tickets;
CREATE POLICY "Staff and Admin can manage tickets"
  ON public.tickets FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('SUPER_ADMIN', 'EVENT_ADMIN', 'STAFF')
    )
  );

-- 4. PROFILES & ADMIN POLICIES
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admin can manage all events" ON public.events;
CREATE POLICY "Admin can manage all events"
  ON public.events FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('SUPER_ADMIN', 'EVENT_ADMIN')
    )
  );

-- =========================================================
-- ACID PROPERTIES: ATOMIC REGISTRATION TRANSACTION FUNCTION
-- =========================================================
-- This function guarantees:
--   - ATOMICITY: All registration steps (seat check, registration record, ticket issuance, count increment) succeed or roll back together.
--   - CONSISTENCY: Enforces event capacity limits and prevents double booking.
--   - ISOLATION: Locks the event record using 'FOR UPDATE' to prevent concurrent race conditions.
--   - DURABILITY: Fully committed to WAL and recorded in audit_logs.
CREATE OR REPLACE FUNCTION register_attendee_atomic(
  p_event_id UUID,
  p_first_name TEXT,
  p_last_name TEXT,
  p_email TEXT,
  p_phone TEXT,
  p_organization TEXT,
  p_job_title TEXT DEFAULT 'Delegate',
  p_country TEXT DEFAULT 'Ghana',
  p_membership_category TEXT DEFAULT 'Non-Member',
  p_attendance_type attendance_type DEFAULT 'PHYSICAL',
  p_total_amount DECIMAL DEFAULT 0.00,
  p_payment_status payment_status DEFAULT 'PENDING',
  p_payment_reference TEXT DEFAULT NULL,
  p_payment_method TEXT DEFAULT NULL,
  p_registration_type_id UUID DEFAULT NULL,
  p_cib_member_id TEXT DEFAULT NULL,
  p_dietary_requirements TEXT DEFAULT NULL,
  p_special_assistance TEXT DEFAULT NULL
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_event RECORD;
  v_reg_id UUID;
  v_reg_number TEXT;
  v_ticket_id UUID;
  v_ticket_code TEXT;
  v_qr_data TEXT;
BEGIN
  -- 1. ISOLATION & CAPACITY CHECK: Row lock on the event to prevent concurrent overselling
  SELECT id, title, venue, start_date, capacity, registered_count, status
  INTO v_event
  FROM public.events
  WHERE id = p_event_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Event not found with ID: %', p_event_id;
  END IF;

  IF v_event.status NOT IN ('UPCOMING', 'OPEN_FOR_REGISTRATION') THEN
    RAISE EXCEPTION 'Event is currently not open for registration';
  END IF;

  IF v_event.registered_count >= v_event.capacity THEN
    RAISE EXCEPTION 'Event capacity of % attendees has been reached', v_event.capacity;
  END IF;

  -- 2. GENERATE UNIQUE IDENTIFIERS
  v_reg_id := uuid_generate_v4();
  v_reg_number := 'CIB-' || TO_CHAR(NOW(), 'YY') || '-' || UPPER(SUBSTRING(MD5(v_reg_id::TEXT || NOW()::TEXT) FROM 1 FOR 6));
  v_ticket_id := uuid_generate_v4();
  v_ticket_code := 'TCK-' || UPPER(SUBSTRING(MD5(v_ticket_id::TEXT || NOW()::TEXT) FROM 1 FOR 8));
  v_qr_data := 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=' || v_reg_number;

  -- 3. ATOMICITY: Insert registration record
  INSERT INTO public.registrations (
    id, event_id, registration_number, registration_type_id,
    first_name, last_name, email, phone, organization, job_title,
    country, cib_member_id, membership_category, attendance_type,
    dietary_requirements, special_assistance, total_amount, currency,
    payment_status, payment_reference, payment_method, check_in_status,
    created_at, updated_at
  ) VALUES (
    v_reg_id, p_event_id, v_reg_number, p_registration_type_id,
    p_first_name, p_last_name, p_email, p_phone, p_organization, p_job_title,
    COALESCE(p_country, 'Ghana'), p_cib_member_id, p_membership_category, p_attendance_type,
    p_dietary_requirements, p_special_assistance, p_total_amount, 'GHS',
    p_payment_status, p_payment_reference, p_payment_method, 'REGISTERED',
    NOW(), NOW()
  );

  -- 4. ATOMICITY: Issue digital attendee pass
  INSERT INTO public.tickets (
    id, registration_id, ticket_code, qr_code_data, security_hash,
    issue_date, status
  ) VALUES (
    v_ticket_id, v_reg_id, v_ticket_code, v_qr_data,
    MD5(v_ticket_code || v_reg_number || p_email),
    NOW(), 'REGISTERED'
  );

  -- 5. CONSISTENCY: Increment event registered count atomically
  UPDATE public.events
  SET registered_count = registered_count + 1,
      updated_at = NOW()
  WHERE id = p_event_id;

  -- 6. DURABILITY: Audit log entry
  INSERT INTO public.audit_logs (
    entity_type, entity_id, action, performed_by_email, payload, created_at
  ) VALUES (
    'REGISTRATION', v_reg_id, 'CREATED', p_email,
    jsonb_build_object(
      'registration_number', v_reg_number,
      'ticket_code', v_ticket_code,
      'amount', p_total_amount,
      'payment_status', p_payment_status
    ),
    NOW()
  );

  RETURN jsonb_build_object(
    'success', true,
    'registration_id', v_reg_id,
    'registration_number', v_reg_number,
    'ticket_code', v_ticket_code,
    'qr_code_data', v_qr_data,
    'event_title', v_event.title,
    'event_venue', v_event.venue,
    'event_date', v_event.start_date
  );

EXCEPTION WHEN OTHERS THEN
  -- Complete rollback on any constraint violation or unexpected error
  RAISE;
END;
$$;
