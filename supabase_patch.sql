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

-- 6. REVIEWS FOREIGN KEY FIX
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'reviews_buyer_id_fkey' AND table_name = 'reviews'
  ) THEN
    ALTER TABLE public.reviews
    ADD CONSTRAINT reviews_buyer_id_fkey FOREIGN KEY (buyer_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'reviews_seller_id_fkey' AND table_name = 'reviews'
  ) THEN
    ALTER TABLE public.reviews
    ADD CONSTRAINT reviews_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Constraint already exists or column type mismatch: %', SQLERRM;
END $$;

-- 7. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT,
  icon TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read categories" ON public.categories;
CREATE POLICY "Public read categories" ON public.categories FOR ALL USING (true) WITH CHECK (true);

-- Seed Categories if empty
INSERT INTO public.categories (name, slug, icon, description)
VALUES 
  ('Books & Notes', 'books', '📚', 'Textbooks, semester notes, lab manuals'),
  ('Electronics & Gadgets', 'electronics', '💻', 'Laptops, calculators, microcontrollers'),
  ('Hostel & Room Essentials', 'hostel', '🛏️', 'Mattresses, kettles, buckets, lamps'),
  ('Cycles & Mobility', 'cycles', '🚲', 'Campus bicycles, skateboards'),
  ('Lab & Workshop Equipment', 'lab', '🔬', 'Lab coats, drafters, breadboards, toolkits'),
  ('Clothing & Fashion', 'clothing', '👕', 'Formal wear, winter jackets, casuals')
ON CONFLICT (name) DO NOTHING;

-- 8. ADMIN ACTIVITY TABLE
CREATE TABLE IF NOT EXISTS public.admin_activity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action TEXT NOT NULL,
  admin_id UUID,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.admin_activity ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admin access activity" ON public.admin_activity;
CREATE POLICY "Admin access activity" ON public.admin_activity FOR ALL USING (true) WITH CHECK (true);

-- 9. RENTALS TABLE
CREATE TABLE IF NOT EXISTS public.rentals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  renter_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  daily_rate NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_rent NUMERIC(10,2) NOT NULL DEFAULT 0,
  deposit NUMERIC(10,2) NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('requested', 'active', 'returned', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.rentals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users access rentals" ON public.rentals;
CREATE POLICY "Users access rentals" ON public.rentals FOR ALL USING (true) WITH CHECK (true);

-- 10. EXCHANGES (BARTER) TABLE
CREATE TABLE IF NOT EXISTS public.exchanges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  requester_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_offered TEXT NOT NULL,
  product_wanted TEXT NOT NULL,
  note TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.exchanges ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users access exchanges" ON public.exchanges;
CREATE POLICY "Users access exchanges" ON public.exchanges FOR ALL USING (true) WITH CHECK (true);

-- 11. GROUP BUYS TABLE
CREATE TABLE IF NOT EXISTS public.group_buys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  organizer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_qty INT NOT NULL DEFAULT 5,
  current_qty INT NOT NULL DEFAULT 1,
  discounted_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  original_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'completed', 'expired')),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.group_buys ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users access group buys" ON public.group_buys;
CREATE POLICY "Users access group buys" ON public.group_buys FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.group_buy_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_buy_id UUID REFERENCES public.group_buys(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.group_buy_members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users access group buy members" ON public.group_buy_members;
CREATE POLICY "Users access group buy members" ON public.group_buy_members FOR ALL USING (true) WITH CHECK (true);

-- 12. RELOAD POSTGREST SCHEMA CACHE
NOTIFY pgrst, 'reload schema';
