-- Drop existing restrictive policies on orders
DROP POLICY IF EXISTS "Anyone can place orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can view orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can update orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can delete orders" ON public.orders;

-- Recreate as PERMISSIVE policies
CREATE POLICY "Anyone can place orders" ON public.orders FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can view orders" ON public.orders FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can update orders" ON public.orders FOR UPDATE TO anon, authenticated USING (true);
CREATE POLICY "Anyone can delete orders" ON public.orders FOR DELETE TO anon, authenticated USING (true);

-- Drop existing restrictive policies on offers
DROP POLICY IF EXISTS "Anyone can view offers" ON public.offers;
DROP POLICY IF EXISTS "Anyone can create offers" ON public.offers;
DROP POLICY IF EXISTS "Anyone can update offers" ON public.offers;
DROP POLICY IF EXISTS "Anyone can delete offers" ON public.offers;

-- Recreate as PERMISSIVE policies
CREATE POLICY "Anyone can view offers" ON public.offers FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can create offers" ON public.offers FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can update offers" ON public.offers FOR UPDATE TO anon, authenticated USING (true);
CREATE POLICY "Anyone can delete offers" ON public.offers FOR DELETE TO anon, authenticated USING (true);