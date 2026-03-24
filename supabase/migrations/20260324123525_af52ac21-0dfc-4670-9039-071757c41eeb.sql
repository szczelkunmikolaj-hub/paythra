
CREATE TABLE public.gmail_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  access_token text NOT NULL,
  refresh_token text NOT NULL,
  token_expires_at timestamp with time zone NOT NULL,
  email text,
  connected_at timestamp with time zone NOT NULL DEFAULT now(),
  last_scan_at timestamp with time zone,
  UNIQUE(user_id)
);

ALTER TABLE public.gmail_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own gmail connection"
  ON public.gmail_connections FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own gmail connection"
  ON public.gmail_connections FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own gmail connection"
  ON public.gmail_connections FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own gmail connection"
  ON public.gmail_connections FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
