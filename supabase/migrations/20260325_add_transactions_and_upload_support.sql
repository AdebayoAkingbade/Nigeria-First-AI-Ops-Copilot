-- Upload processing support for queued bank statement and POS imports

CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    receipt_id UUID REFERENCES public.receipts ON DELETE SET NULL,
    direction TEXT NOT NULL CHECK (direction IN ('in', 'out')),
    amount DECIMAL(12, 2) NOT NULL,
    currency TEXT DEFAULT 'NGN',
    category TEXT,
    merchant_name TEXT,
    description TEXT,
    transaction_date DATE DEFAULT CURRENT_DATE,
    source_type TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own transactions" ON public.transactions
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions" ON public.transactions
FOR INSERT WITH CHECK (auth.uid() = user_id);
