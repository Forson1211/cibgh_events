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
  banner_image TEXT,
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

-- =========================================================
-- ROW LEVEL SECURITY POLICIES (RLS)
-- =========================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Public can view published events
CREATE POLICY "Public can view published events"
  ON public.events FOR SELECT
  USING (status != 'DRAFT');

-- Admin can manage all events
CREATE POLICY "Admin can manage all events"
  ON public.events FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('SUPER_ADMIN', 'EVENT_ADMIN')
    )
  );

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can view their own registrations
CREATE POLICY "Users can view own registrations"
  ON public.registrations FOR SELECT
  USING (auth.uid() = user_id);

-- Staff and Admin can view all registrations and check-ins
CREATE POLICY "Staff can view registrations"
  ON public.registrations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('SUPER_ADMIN', 'EVENT_ADMIN', 'STAFF')
    )
  );
