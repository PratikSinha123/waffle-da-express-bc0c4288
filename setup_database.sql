-- ========================================================
-- WAFFLE DA EXPRESS - COMPLETE DATABASE SETUP SCRIPT
-- Copy & paste this entire script into your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql/new
-- ========================================================

-- 1. CREATE ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  items JSONB NOT NULL DEFAULT '[]',
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  payment_method TEXT NOT NULL DEFAULT 'Cash On Delivery',
  order_type TEXT NOT NULL DEFAULT 'Delivery',
  status TEXT NOT NULL DEFAULT 'Order Received',
  subtotal NUMERIC NOT NULL DEFAULT 0,
  delivery_fee NUMERIC NOT NULL DEFAULT 0,
  total NUMERIC NOT NULL DEFAULT 0,
  seen BOOLEAN NOT NULL DEFAULT false,
  delivered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can place orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can view orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can update orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can delete orders" ON public.orders;

CREATE POLICY "Anyone can place orders" ON public.orders FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can view orders" ON public.orders FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can update orders" ON public.orders FOR UPDATE TO anon, authenticated USING (true);
CREATE POLICY "Anyone can delete orders" ON public.orders FOR DELETE TO anon, authenticated USING (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;

-- 2. CREATE OFFERS TABLE
CREATE TABLE IF NOT EXISTS public.offers (
  id TEXT PRIMARY KEY DEFAULT 'offer-' || extract(epoch from now())::bigint::text,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  discount_percent NUMERIC,
  discount_flat NUMERIC,
  code TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  valid_until TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view offers" ON public.offers;
DROP POLICY IF EXISTS "Anyone can create offers" ON public.offers;
DROP POLICY IF EXISTS "Anyone can update offers" ON public.offers;
DROP POLICY IF EXISTS "Anyone can delete offers" ON public.offers;

CREATE POLICY "Anyone can view offers" ON public.offers FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can create offers" ON public.offers FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can update offers" ON public.offers FOR UPDATE TO anon, authenticated USING (true);
CREATE POLICY "Anyone can delete offers" ON public.offers FOR DELETE TO anon, authenticated USING (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.offers;

-- 3. CREATE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view settings" ON public.settings;
DROP POLICY IF EXISTS "Anyone can update settings" ON public.settings;
DROP POLICY IF EXISTS "Anyone can insert settings" ON public.settings;

CREATE POLICY "Anyone can view settings" ON public.settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can update settings" ON public.settings FOR UPDATE TO anon, authenticated USING (true);
CREATE POLICY "Anyone can insert settings" ON public.settings FOR INSERT TO anon, authenticated WITH CHECK (true);

INSERT INTO public.settings (key, value) VALUES ('delivery_fee', '25'), ('shop_status', 'open') ON CONFLICT (key) DO NOTHING;

ALTER PUBLICATION supabase_realtime ADD TABLE public.settings;

-- 4. CREATE MENU ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.menu_items (
  id TEXT NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price NUMERIC NOT NULL DEFAULT 0,
  price2 NUMERIC,
  price_label TEXT,
  price_label2 TEXT,
  category TEXT NOT NULL DEFAULT '',
  is_veg BOOLEAN NOT NULL DEFAULT true,
  available BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view menu items" ON public.menu_items;
DROP POLICY IF EXISTS "Anyone can insert menu items" ON public.menu_items;
DROP POLICY IF EXISTS "Anyone can update menu items" ON public.menu_items;
DROP POLICY IF EXISTS "Anyone can delete menu items" ON public.menu_items;

CREATE POLICY "Anyone can view menu items" ON public.menu_items FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can insert menu items" ON public.menu_items FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can update menu items" ON public.menu_items FOR UPDATE TO anon, authenticated USING (true);
CREATE POLICY "Anyone can delete menu items" ON public.menu_items FOR DELETE TO anon, authenticated USING (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.menu_items;

-- 5. SEED DEFAULT MENU CATALOG
INSERT INTO public.menu_items (id, name, description, price, price2, price_label, price_label2, category, is_veg, sort_order) VALUES
('w1', 'Classic Chocolate', 'Rich chocolate waffle with classic toppings', 90, NULL, NULL, NULL, 'Waffles', true, 1),
('w2', 'Milkyway', 'Smooth milky chocolate waffle', 90, NULL, NULL, NULL, 'Waffles', true, 2),
('w3', 'Dark Temptation', 'Intense dark chocolate waffle', 90, NULL, NULL, NULL, 'Waffles', true, 3),
('w4', 'Red Velvet', 'Signature red velvet flavored waffle', 90, NULL, NULL, NULL, 'Waffles', true, 4),
('w5', 'Belgian Chocolate', 'Premium Belgian chocolate drizzle', 90, NULL, NULL, NULL, 'Waffles', true, 5),
('w6', 'Eat Me Now', 'Irresistible loaded chocolate waffle', 90, NULL, NULL, NULL, 'Waffles', true, 6),
('w7', 'Americano', 'Coffee-infused chocolate waffle', 90, NULL, NULL, NULL, 'Waffles', true, 7),
('w8', 'Red Velvet Cream Cheese', 'Red velvet with cream cheese topping', 90, NULL, NULL, NULL, 'Waffles', true, 8),
('w9', 'Butterscotch Crunch', 'Crunchy butterscotch waffle', 90, NULL, NULL, NULL, 'Waffles', true, 9),
('w10', 'Maple Butter', 'Classic maple butter glazed waffle', 90, NULL, NULL, NULL, 'Waffles', true, 10),
('w16', 'Nutella', 'Loaded with creamy Nutella', 90, NULL, NULL, NULL, 'Waffles', true, 16),
('w17', 'Oreo Cookie', 'Crushed Oreo cookie waffle', 90, NULL, NULL, NULL, 'Waffles', true, 17),
('vp1', 'Margherita', 'Classic margherita pizza', 90, 160, 'Regular', 'Large', 'Veg Pizza', true, 101),
('vp2', 'Classic Farm House', 'Farm fresh veggie pizza', 100, 180, 'Regular', 'Large', 'Veg Pizza', true, 102),
('sh2', 'Cold Coffee', 'Iced cold coffee', 90, NULL, NULL, NULL, 'Shakes', true, 144)
ON CONFLICT (id) DO NOTHING;
