-- Create orders table
CREATE TABLE public.orders (
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
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Anyone can insert orders (customers placing orders)
CREATE POLICY "Anyone can place orders"
  ON public.orders FOR INSERT
  WITH CHECK (true);

-- Anyone can read orders (for tracking by phone)
CREATE POLICY "Anyone can view orders"
  ON public.orders FOR SELECT
  USING (true);

-- Anyone can update orders (admin updates status)
CREATE POLICY "Anyone can update orders"
  ON public.orders FOR UPDATE
  USING (true);

-- Anyone can delete orders (admin deletes)
CREATE POLICY "Anyone can delete orders"
  ON public.orders FOR DELETE
  USING (true);

-- Enable realtime for orders
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;

-- Create offers table
CREATE TABLE public.offers (
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

-- Enable RLS
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view offers"
  ON public.offers FOR SELECT USING (true);

CREATE POLICY "Anyone can create offers"
  ON public.offers FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update offers"
  ON public.offers FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete offers"
  ON public.offers FOR DELETE USING (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.offers;