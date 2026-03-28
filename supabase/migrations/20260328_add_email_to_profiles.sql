-- Comprehensive migration to align profiles table with backend entity
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS business_type TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS industry TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS cac_registration_number TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS incorporation_date TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS business_size TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS monthly_revenue_range TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS business_goals TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone_number TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'free';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS plan_activated_at TIMESTAMPTZ;
