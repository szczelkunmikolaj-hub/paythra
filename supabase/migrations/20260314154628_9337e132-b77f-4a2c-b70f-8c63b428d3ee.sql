
-- Service pricing database
CREATE TABLE public.service_pricing (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name text NOT NULL,
  service_domain text NOT NULL,
  category text NOT NULL DEFAULT 'other',
  standard_price numeric NOT NULL DEFAULT 0,
  student_price numeric,
  family_price numeric,
  cheapest_plan_name text,
  cheapest_plan_price numeric,
  country text NOT NULL DEFAULT 'EU',
  last_updated timestamp with time zone NOT NULL DEFAULT now()
);

-- Allow all authenticated users to read service pricing
ALTER TABLE public.service_pricing ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read service pricing"
ON public.service_pricing
FOR SELECT
TO authenticated
USING (true);

-- Subscription price history
CREATE TABLE public.subscription_price_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id uuid NOT NULL REFERENCES public.subscriptions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  old_price numeric NOT NULL,
  new_price numeric NOT NULL,
  date_changed timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.subscription_price_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own price history"
ON public.subscription_price_history
FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own price history"
ON public.subscription_price_history
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Add monthly_income and is_student to profiles
ALTER TABLE public.profiles
ADD COLUMN monthly_income numeric,
ADD COLUMN is_student boolean NOT NULL DEFAULT false;

-- Add notifications foreign key for subscription_id (if not exists, re-add)
-- Add logo_url based on domain matching
