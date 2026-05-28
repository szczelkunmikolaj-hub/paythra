-- ============================================================
-- paythra_email_requests — one row per user (UNIQUE on user_id)
-- ============================================================
CREATE TABLE public.paythra_email_requests (
  id               UUID    NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id          UUID    NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email       TEXT    NOT NULL,
  requested_name   TEXT    NOT NULL,
  suggested_email  TEXT    NOT NULL,
  status           TEXT    NOT NULL DEFAULT 'pending'
                     CHECK (status IN ('pending', 'created', 'sent')),
  created_at       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

ALTER TABLE public.paythra_email_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own email request"
  ON public.paythra_email_requests FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own email request"
  ON public.paythra_email_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_paythra_email_requests_user ON public.paythra_email_requests(user_id);

-- ============================================================
-- admin_notifications — visible only via service role.
-- Used for manual admin alerts (no email infra needed).
-- ============================================================
CREATE TABLE public.admin_notifications (
  id         UUID    NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type       TEXT    NOT NULL,
  payload    JSONB   NOT NULL DEFAULT '{}',
  is_read    BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- No RLS: regular users cannot read or write this table.
-- Admin access is via Supabase dashboard with service role only.

-- ============================================================
-- Trigger: on new email request, write an admin_notification
-- record so the admin sees it in the Supabase dashboard.
-- Runs SECURITY DEFINER so it can INSERT into admin_notifications
-- regardless of who triggered the request.
-- ============================================================
CREATE OR REPLACE FUNCTION public.notify_admin_new_email_request()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.admin_notifications (type, payload)
  VALUES (
    'paythra_email_request',
    jsonb_build_object(
      'user_email',      NEW.user_email,
      'suggested_email', NEW.suggested_email,
      'requested_name',  NEW.requested_name,
      'request_id',      NEW.id,
      'message',         'New PAYTHRA email request from ' || NEW.user_email ||
                         '. Requested address: ' || NEW.suggested_email ||
                         '. Go to Supabase dashboard, find the paythra_email_requests table, and update the status to ''created'' when done. Then email the user their new address at szczelkunmikolaj@gmail.com.'
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trg_notify_admin_email_request
  AFTER INSERT ON public.paythra_email_requests
  FOR EACH ROW EXECUTE FUNCTION public.notify_admin_new_email_request();
