-- =========================================================================
-- CAMPUS COMMUNITY MARKETPLACE (CCM 2.0) - SUPABASE QUICK FIX PATCH
-- =========================================================================
-- Run this in your Supabase Dashboard -> SQL Editor -> Click 'Run'
-- This patch ensures all columns match the frontend code and configures
-- resilient Row Level Security (RLS) policies for conversations, messages, and orders.
-- =========================================================================

-- 1. CONVERSATIONS TABLE FIXES
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  buyer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  buyer_name TEXT,
  seller_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='conversations' AND column_name='updated_at') THEN
    ALTER TABLE public.conversations ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='conversations' AND column_name='buyer_name') THEN
    ALTER TABLE public.conversations ADD COLUMN buyer_name TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='conversations' AND column_name='seller_name') THEN
    ALTER TABLE public.conversations ADD COLUMN seller_name TEXT;
  END IF;
END $$;

-- 2. MESSAGES TABLE FIXES
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='messages' AND column_name='receiver_id') THEN
    ALTER TABLE public.messages ADD COLUMN receiver_id UUID;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='messages' AND column_name='is_read') THEN
    ALTER TABLE public.messages ADD COLUMN is_read BOOLEAN DEFAULT FALSE;
  END IF;
END $$;

-- 3. ORDERS TABLE FIXES
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  seller_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  quantity INT DEFAULT 1,
  price NUMERIC(10,2) DEFAULT 0,
  total_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('placed', 'confirmed', 'ready_for_pickup', 'completed', 'cancelled')),
  payment_method TEXT DEFAULT 'wallet' CHECK (payment_method IN ('upi', 'card', 'cash', 'wallet')),
  payment_status TEXT DEFAULT 'paid' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),
  pickup_location TEXT DEFAULT 'Campus Main Gate',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='quantity') THEN
    ALTER TABLE public.orders ADD COLUMN quantity INT DEFAULT 1;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='payment_method') THEN
    ALTER TABLE public.orders ADD COLUMN payment_method TEXT DEFAULT 'wallet';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='payment_status') THEN
    ALTER TABLE public.orders ADD COLUMN payment_status TEXT DEFAULT 'paid';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='pickup_location') THEN
    ALTER TABLE public.orders ADD COLUMN pickup_location TEXT DEFAULT 'Campus Main Gate';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='notes') THEN
    ALTER TABLE public.orders ADD COLUMN notes TEXT;
  END IF;
END $$;

-- 4. OFFERS TABLE FIXES
CREATE TABLE IF NOT EXISTS public.offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  original_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  offer_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  counter_price NUMERIC(10,2),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'countered')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ROW LEVEL SECURITY (RLS) POLICIES - PERMISSIVE FOR SMOOTH DEMO & TESTING
-- Conversations
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users read conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users access conversations" ON public.conversations;
CREATE POLICY "Users access conversations" ON public.conversations FOR ALL USING (true) WITH CHECK (true);

-- Messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users read messages" ON public.messages;
DROP POLICY IF EXISTS "Users access messages" ON public.messages;
CREATE POLICY "Users access messages" ON public.messages FOR ALL USING (true) WITH CHECK (true);

-- Orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users read orders" ON public.orders;
DROP POLICY IF EXISTS "Users insert orders" ON public.orders;
DROP POLICY IF EXISTS "Users update orders" ON public.orders;
DROP POLICY IF EXISTS "Users access orders" ON public.orders;
CREATE POLICY "Users access orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);

-- Offers
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users access offers" ON public.offers;
CREATE POLICY "Users access offers" ON public.offers FOR ALL USING (true) WITH CHECK (true);

-- 6. RELOAD POSTGREST SCHEMA CACHE
NOTIFY pgrst, 'reload schema';
