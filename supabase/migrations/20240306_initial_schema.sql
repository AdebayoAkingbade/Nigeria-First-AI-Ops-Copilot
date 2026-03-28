-- Initial Schema for Nigeria First AI KudiPal

-- 1. Profiles table (extends Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    whatsapp_number TEXT UNIQUE,
    business_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Receipts table (Storage for uploaded documents)
CREATE TABLE IF NOT EXISTS public.receipts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    storage_path TEXT NOT NULL, -- Path in Supabase Storage
    file_name TEXT,
    content_type TEXT,
    status TEXT DEFAULT 'pending', -- pending, processing, completed, error
    ocr_raw_json JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Expenses table (Structured data from AI analysis)
CREATE TABLE IF NOT EXISTS public.expenses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    receipt_id UUID REFERENCES public.receipts ON DELETE SET NULL,
    amount DECIMAL(12, 2) NOT NULL,
    currency TEXT DEFAULT 'NGN',
    category TEXT, -- food, transport, inventory, utilities, etc.
    merchant_name TEXT,
    transaction_date DATE DEFAULT CURRENT_DATE,
    description TEXT,
    is_reconciled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Simple RLS Policies (User can only see their own data)
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view their own receipts" ON public.receipts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own receipts" ON public.receipts FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own expenses" ON public.expenses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own expenses" ON public.expenses FOR INSERT WITH CHECK (auth.uid() = user_id);
