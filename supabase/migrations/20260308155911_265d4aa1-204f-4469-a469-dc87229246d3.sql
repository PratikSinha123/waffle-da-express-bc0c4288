CREATE TABLE public.deleted_orders (
  id text NOT NULL,
  customer_name text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL DEFAULT '',
  notes text NOT NULL DEFAULT '',
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  payment_method text NOT NULL DEFAULT 'Cash On Delivery',
  order_type text NOT NULL DEFAULT 'Delivery',
  status text NOT NULL DEFAULT 'Order Received',
  subtotal numeric NOT NULL DEFAULT 0,
  delivery_fee numeric NOT NULL DEFAULT 0,
  total numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

ALTER TABLE public.deleted_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view deleted orders" ON public.deleted_orders FOR SELECT USING (true);
CREATE POLICY "Anyone can insert deleted orders" ON public.deleted_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete deleted orders" ON public.deleted_orders FOR DELETE USING (true);