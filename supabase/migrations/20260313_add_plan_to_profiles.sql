-- Add plan column to profiles table
-- Values: 'starter' (default) | 'pro'
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS plan TEXT NOT NULL DEFAULT 'starter';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS plan_activated_at TIMESTAMPTZ;
