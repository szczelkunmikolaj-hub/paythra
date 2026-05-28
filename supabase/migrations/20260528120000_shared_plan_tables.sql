-- ============================================================
-- Extend notifications type check to include new types used
-- by price-change detection and the new shared-plan feature.
-- ============================================================
ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
ALTER TABLE public.notifications
  ADD CONSTRAINT notifications_type_check
  CHECK (type IN (
    'upcoming_charge',
    'trial_ending',
    'unused_subscription',
    'price_increase',
    'price_decrease',
    'subscription_added',
    'shared_plan_full'
  ));

-- ============================================================
-- shared_plan_requests — one row per sharing request created
-- ============================================================
CREATE TABLE public.shared_plan_requests (
  id                      UUID             NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id                 UUID             NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email              TEXT             NOT NULL,
  subscription_name       TEXT             NOT NULL,
  subscription_category   TEXT             NOT NULL DEFAULT 'other',
  max_members             INTEGER          NOT NULL DEFAULT 5
                            CHECK (max_members BETWEEN 2 AND 10),
  current_members         INTEGER          NOT NULL DEFAULT 1,
  status                  TEXT             NOT NULL DEFAULT 'waiting'
                            CHECK (status IN ('waiting', 'full', 'active')),
  monthly_cost_per_person NUMERIC(10,2)    NOT NULL CHECK (monthly_cost_per_person > 0),
  created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.shared_plan_requests ENABLE ROW LEVEL SECURITY;

-- Owners always see their own plans.
-- All authenticated users can browse 'waiting' plans to find ones to join.
-- Members can see plans they have joined (even after they become 'full').
CREATE POLICY "Users can view relevant plan requests"
  ON public.shared_plan_requests FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id
    OR status = 'waiting'
    OR id IN (
      SELECT plan_id FROM public.shared_plan_members
       WHERE user_id = auth.uid() AND status != 'left'
    )
  );

CREATE POLICY "Users can insert own plan requests"
  ON public.shared_plan_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own plan requests"
  ON public.shared_plan_requests FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own plan requests"
  ON public.shared_plan_requests FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================
-- shared_plan_members — one row per user per plan
-- ============================================================
CREATE TABLE public.shared_plan_members (
  id         UUID    NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_id    UUID    NOT NULL REFERENCES public.shared_plan_requests(id) ON DELETE CASCADE,
  user_id    UUID    NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT    NOT NULL,
  status     TEXT    NOT NULL DEFAULT 'pending'
               CHECK (status IN ('pending', 'confirmed', 'left')),
  joined_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (plan_id, user_id)
);

ALTER TABLE public.shared_plan_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own memberships and members of own plans"
  ON public.shared_plan_members FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id
    OR plan_id IN (
      SELECT id FROM public.shared_plan_requests WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own membership"
  ON public.shared_plan_members FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own membership"
  ON public.shared_plan_members FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own membership"
  ON public.shared_plan_members FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================
-- Trigger: keep current_members and status in sync whenever
-- a row is added, updated, or removed from shared_plan_members.
-- Runs SECURITY DEFINER so it can update any plan row regardless
-- of who triggered the change.
-- ============================================================
CREATE OR REPLACE FUNCTION public.sync_shared_plan_member_count()
RETURNS TRIGGER AS $$
DECLARE
  v_plan_id UUID;
  v_count   INTEGER;
  v_max     INTEGER;
BEGIN
  v_plan_id := COALESCE(NEW.plan_id, OLD.plan_id);

  SELECT COUNT(*) INTO v_count
    FROM public.shared_plan_members
   WHERE plan_id = v_plan_id AND status != 'left';

  SELECT max_members INTO v_max
    FROM public.shared_plan_requests
   WHERE id = v_plan_id;

  UPDATE public.shared_plan_requests
     SET current_members = v_count,
         status          = CASE WHEN v_count >= v_max THEN 'full' ELSE 'waiting' END,
         updated_at      = now()
   WHERE id = v_plan_id;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trg_sync_plan_member_count
  AFTER INSERT OR UPDATE OR DELETE ON public.shared_plan_members
  FOR EACH ROW EXECUTE FUNCTION public.sync_shared_plan_member_count();

-- ============================================================
-- Trigger: when a plan transitions to 'full', notify every
-- active member (including the plan owner) via the notifications
-- table. Runs SECURITY DEFINER to bypass per-user RLS on
-- notifications so all members receive the message.
-- ============================================================
CREATE OR REPLACE FUNCTION public.notify_shared_plan_full()
RETURNS TRIGGER AS $$
DECLARE
  v_member RECORD;
BEGIN
  IF NEW.status = 'full' AND (OLD.status IS DISTINCT FROM 'full') THEN
    FOR v_member IN (
      -- all active members plus the plan owner (UNION deduplicates)
      SELECT DISTINCT user_id
        FROM public.shared_plan_members
       WHERE plan_id = NEW.id AND status != 'left'
      UNION
      SELECT NEW.user_id
    ) LOOP
      INSERT INTO public.notifications (user_id, type, message)
      VALUES (
        v_member.user_id,
        'shared_plan_full',
        'Your ' || NEW.subscription_name ||
          ' shared plan is full! You will be contacted with next steps.'
      );
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trg_notify_shared_plan_full
  AFTER UPDATE ON public.shared_plan_requests
  FOR EACH ROW EXECUTE FUNCTION public.notify_shared_plan_full();

-- ============================================================
-- Indexes
-- ============================================================
CREATE INDEX idx_shared_plan_requests_user   ON public.shared_plan_requests(user_id);
CREATE INDEX idx_shared_plan_requests_status ON public.shared_plan_requests(status);
CREATE INDEX idx_shared_plan_members_plan    ON public.shared_plan_members(plan_id);
CREATE INDEX idx_shared_plan_members_user    ON public.shared_plan_members(user_id);
