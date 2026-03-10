-- Add missing fields to profiles table for business onboarding
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS business_type TEXT,
ADD COLUMN IF NOT EXISTS industry TEXT,
ADD COLUMN IF NOT EXISTS cac_registration_number TEXT,
ADD COLUMN IF NOT EXISTS incorporation_date DATE,
ADD COLUMN IF NOT EXISTS business_size TEXT,
ADD COLUMN IF NOT EXISTS monthly_revenue_range TEXT,
ADD COLUMN IF NOT EXISTS business_goals TEXT;

-- Ensure RLS is updated if needed (it already allows users to select/update their own profile)
