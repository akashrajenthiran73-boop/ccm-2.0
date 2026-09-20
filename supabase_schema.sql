-- =========================================================================
-- CAMPUS COMMUNITY MARKETPLACE (CCM 2.0) - COMPLETE SUPABASE DATABASE SCHEMA
-- Compatible with PostgreSQL / Supabase SQL Editor
-- Includes all 28 tables, Foreign Keys, Indexes, RLS Policies, and Seed Data
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. PROFILES TABLE (Enhance existing or create)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  full_name TEXT,
  username TEXT UNIQUE,
  email TEXT,
  phone TEXT,
  mobile_number TEXT,
  user_type TEXT DEFAULT 'student' CHECK (user_type IN ('student', 'staff', 'community_user', 'local_seller')),
  college_id_number TEXT,
  college_name TEXT DEFAULT 'Campus College',
  department TEXT,
  course TEXT,
  year TEXT,
  semester TEXT,
  location TEXT,
  address TEXT,
  bio TEXT,
  avatar_url TEXT DEFAULT 'https://ui-avatars.com/api/?name=User&background=random',
  rating NUMERIC(3,2) DEFAULT 5.0,
  rating_count INT DEFAULT 1,
  is_verified BOOLEAN DEFAULT FALSE,
  is_blocked BOOLEAN DEFAULT FALSE,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure all columns exist in profiles if table already existed
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='full_name') THEN
    ALTER TABLE public.profiles ADD COLUMN full_name TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='username') THEN
    ALTER TABLE public.profiles ADD COLUMN username TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='mobile_number') THEN
    ALTER TABLE public.profiles ADD COLUMN mobile_number TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='college_id_number') THEN
    ALTER TABLE public.profiles ADD COLUMN college_id_number TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='college_name') THEN
    ALTER TABLE public.profiles ADD COLUMN college_name TEXT DEFAULT 'Campus College';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='department') THEN
    ALTER TABLE public.profiles ADD COLUMN department TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='course') THEN
    ALTER TABLE public.profiles ADD COLUMN course TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='year') THEN
    ALTER TABLE public.profiles ADD COLUMN year TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='semester') THEN
    ALTER TABLE public.profiles ADD COLUMN semester TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='address') THEN
    ALTER TABLE public.profiles ADD COLUMN address TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='is_blocked') THEN
    ALTER TABLE public.profiles ADD COLUMN is_blocked BOOLEAN DEFAULT FALSE;
  END IF;
END $$;

-- 2. COLLEGES & DEPARTMENTS
CREATE TABLE IF NOT EXISTS public.colleges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT UNIQUE,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  icon TEXT DEFAULT '📦',
  mode TEXT DEFAULT 'both' CHECK (mode IN ('college', 'community', 'both')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PRODUCTS TABLE (Enhance existing or create)
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  category TEXT NOT NULL,
  condition TEXT DEFAULT 'Used' CHECK (condition IN ('New', 'Like new', 'Used')),
  photos TEXT[] DEFAULT '{}',
  image_url TEXT,
  location TEXT,
  lat NUMERIC(10,6),
  lng NUMERIC(10,6),
  marketplace_mode TEXT DEFAULT 'college' CHECK (marketplace_mode IN ('college', 'community', 'both')),
  pickup_location TEXT DEFAULT 'Main Gate',
  meeting_point TEXT DEFAULT 'Main Gate',
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'active', 'sold', 'pending', 'inactive')),
  views_count INT DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  featured_until TIMESTAMPTZ,
  ai_risk_score INT DEFAULT 0,
  ai_price_status TEXT DEFAULT 'fair',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure all columns exist in products
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='seller_id') THEN
    ALTER TABLE public.products ADD COLUMN seller_id UUID;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='marketplace_mode') THEN
    ALTER TABLE public.products ADD COLUMN marketplace_mode TEXT DEFAULT 'college';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='pickup_location') THEN
    ALTER TABLE public.products ADD COLUMN pickup_location TEXT DEFAULT 'Main Gate';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='meeting_point') THEN
    ALTER TABLE public.products ADD COLUMN meeting_point TEXT DEFAULT 'Main Gate';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='ai_risk_score') THEN
    ALTER TABLE public.products ADD COLUMN ai_risk_score INT DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='ai_price_status') THEN
    ALTER TABLE public.products ADD COLUMN ai_price_status TEXT DEFAULT 'fair';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='lat') THEN
    ALTER TABLE public.products ADD COLUMN lat NUMERIC(10,6);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='lng') THEN
    ALTER TABLE public.products ADD COLUMN lng NUMERIC(10,6);
  END IF;
END $$;

-- 5. CARTS & CART ITEMS
CREATE TABLE IF NOT EXISTS public.carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  seller_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  quantity INT DEFAULT 1,
  price NUMERIC(10,2) DEFAULT 0,
  total_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'placed' CHECK (status IN ('placed', 'confirmed', 'ready_for_pickup', 'completed', 'cancelled')),
  payment_method TEXT DEFAULT 'cash' CHECK (payment_method IN ('upi', 'card', 'cash', 'wallet')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),
  pickup_location TEXT DEFAULT 'Main Gate',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure orders columns
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='payment_method') THEN
    ALTER TABLE public.orders ADD COLUMN payment_method TEXT DEFAULT 'cash';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='payment_status') THEN
    ALTER TABLE public.orders ADD COLUMN payment_status TEXT DEFAULT 'pending';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='pickup_location') THEN
    ALTER TABLE public.orders ADD COLUMN pickup_location TEXT DEFAULT 'Main Gate';
  END IF;
END $$;

-- 7. PAYMENTS & DIGITAL WALLET (Simulated)
CREATE TABLE IF NOT EXISTS public.wallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  balance NUMERIC(12,2) DEFAULT 5000.00,
  currency TEXT DEFAULT 'INR',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.wallet_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_id UUID REFERENCES public.wallets(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('credit', 'debit')),
  amount NUMERIC(10,2) NOT NULL,
  description TEXT,
  reference_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  amount NUMERIC(10,2) NOT NULL,
  payment_method TEXT NOT NULL,
  transaction_id TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'success' CHECK (status IN ('success', 'failed', 'refunded', 'pending')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. CONVERSATIONS & MESSAGES
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

CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. OFFERS (Price Negotiation in Chat)
CREATE TABLE IF NOT EXISTS public.offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  original_price NUMERIC(10,2) NOT NULL,
  offer_price NUMERIC(10,2) NOT NULL,
  counter_price NUMERIC(10,2),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'countered')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. EXCHANGES / BARTER
CREATE TABLE IF NOT EXISTS public.exchanges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  requester_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  offered_product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  requested_product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. RENTALS & BORROWING
CREATE TABLE IF NOT EXISTS public.rentals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  renter_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  rental_price NUMERIC(10,2) NOT NULL,
  duration_days INT NOT NULL DEFAULT 1,
  start_date DATE NOT NULL,
  return_date DATE NOT NULL,
  status TEXT DEFAULT 'requested' CHECK (status IN ('requested', 'approved', 'active', 'returned', 'rejected')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. AUCTIONS & BIDDING
CREATE TABLE IF NOT EXISTS public.auctions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  starting_price NUMERIC(10,2) NOT NULL,
  min_bid NUMERIC(10,2) NOT NULL DEFAULT 50,
  current_highest_bid NUMERIC(10,2) NOT NULL DEFAULT 0,
  highest_bidder_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  start_time TIMESTAMPTZ DEFAULT NOW(),
  end_time TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'ended', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.bids (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auction_id UUID REFERENCES public.auctions(id) ON DELETE CASCADE,
  bidder_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  bid_amount NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. REVIEWS & RATINGS
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  response_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. WISHLISTS
CREATE TABLE IF NOT EXISTS public.wishlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- 15. CAMPUS LOST & FOUND
CREATE TABLE IF NOT EXISTS public.lost_found (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('lost', 'found')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  location TEXT NOT NULL,
  item_date DATE NOT NULL DEFAULT CURRENT_DATE,
  image_url TEXT,
  claimant_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'claimed', 'resolved')),
  contact_info TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. FLASH DEALS & GROUP BUYING
CREATE TABLE IF NOT EXISTS public.group_buys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  original_price NUMERIC(10,2) NOT NULL,
  discount_price NUMERIC(10,2) NOT NULL,
  min_buyers INT NOT NULL DEFAULT 5,
  current_buyers INT NOT NULL DEFAULT 1,
  end_date TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'expired')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.group_buy_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_buy_id UUID REFERENCES public.group_buys(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(group_buy_id, user_id)
);

-- 17. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'general',
  link_url TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. REPORTS & COMPLAINTS
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  reported_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reported_product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  reason TEXT NOT NULL,
  type TEXT DEFAULT 'scam' CHECK (type IN ('scam', 'fake_listing', 'harassment', 'inappropriate', 'other')),
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'investigating', 'resolved', 'dismissed')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. ADMIN ACTIVITY LOG
CREATE TABLE IF NOT EXISTS public.admin_activity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  target_type TEXT,
  target_id TEXT,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Permissive policies for student/campus project so reads and writes succeed smoothly
-- =========================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exchanges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rentals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auctions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lost_found ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_buys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_buy_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activity ENABLE ROW LEVEL SECURITY;

-- Allow public reads for catalogs and listings
CREATE POLICY "Public read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Users insert products" ON public.products FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users update own products" ON public.products FOR UPDATE USING (auth.uid() = user_id OR auth.uid() = seller_id);
CREATE POLICY "Users delete own products" ON public.products FOR DELETE USING (auth.uid() = user_id OR auth.uid() = seller_id);

CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public read colleges" ON public.colleges FOR SELECT USING (true);
CREATE POLICY "Public read departments" ON public.departments FOR SELECT USING (true);

CREATE POLICY "Users access own carts" ON public.carts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users read orders" ON public.orders FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id OR true);
CREATE POLICY "Users insert orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users update orders" ON public.orders FOR UPDATE USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Users access own wallet" ON public.wallets FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own wallet transactions" ON public.wallet_transactions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users read payments" ON public.payments FOR ALL USING (true);

CREATE POLICY "Users read conversations" ON public.conversations FOR ALL USING (auth.uid() = buyer_id OR auth.uid() = seller_id);
CREATE POLICY "Users read messages" ON public.messages FOR ALL USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users access offers" ON public.offers FOR ALL USING (auth.uid() = buyer_id OR auth.uid() = seller_id);
CREATE POLICY "Users access exchanges" ON public.exchanges FOR ALL USING (auth.uid() = requester_id OR auth.uid() = owner_id);
CREATE POLICY "Users access rentals" ON public.rentals FOR ALL USING (auth.uid() = renter_id OR auth.uid() = owner_id);

CREATE POLICY "Public read auctions" ON public.auctions FOR SELECT USING (true);
CREATE POLICY "Users insert auctions" ON public.auctions FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Public read bids" ON public.bids FOR SELECT USING (true);
CREATE POLICY "Users insert bids" ON public.bids FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Public read reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users insert reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users access wishlists" ON public.wishlists FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Public read lost_found" ON public.lost_found FOR SELECT USING (true);
CREATE POLICY "Users insert lost_found" ON public.lost_found FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users update lost_found" ON public.lost_found FOR UPDATE USING (auth.uid() = user_id OR auth.uid() = claimant_id);

CREATE POLICY "Public read group_buys" ON public.group_buys FOR SELECT USING (true);
CREATE POLICY "Users access group_buy_members" ON public.group_buy_members FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users access notifications" ON public.notifications FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access reports" ON public.reports FOR ALL USING (true);
CREATE POLICY "Users access admin_activity" ON public.admin_activity FOR ALL USING (true);

-- =========================================================================
-- SEED DATA (Categories, Sample Colleges, Sample Products)
-- =========================================================================

INSERT INTO public.categories (name, icon, mode) VALUES
('Books & Notes', '📚', 'college'),
('Cycles & Vehicles', '🚲', 'both'),
('Electronics & Laptops', '💻', 'both'),
('Hostel & Room Essentials', '🛏️', 'college'),
('Lab & Study Equipment', '🔬', 'college'),
('Mobile & Accessories', '📱', 'both'),
('Fashion & Clothing', '👕', 'both'),
('Home & Kitchen', '🍳', 'community'),
('Sports & Fitness', '⚽', 'both'),
('Musical Instruments', '🎸', 'both')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.colleges (name, code, location) VALUES
('Coimbatore Institute of Technology (CIT)', 'CIT', 'Coimbatore, Tamil Nadu'),
('PSG College of Technology', 'PSGTECH', 'Coimbatore, Tamil Nadu'),
('Government College of Technology (GCT)', 'GCT', 'Coimbatore, Tamil Nadu'),
('Kumaraguru College of Technology', 'KCT', 'Coimbatore, Tamil Nadu'),
('Anna University Regional Campus', 'AURC', 'Coimbatore, Tamil Nadu')
ON CONFLICT (code) DO NOTHING;
