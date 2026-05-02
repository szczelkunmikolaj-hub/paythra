-- 1) Tighten role on existing public-role policies to 'authenticated'

-- profiles
ALTER POLICY "Users can view own profile" ON public.profiles TO authenticated;
ALTER POLICY "Users can insert own profile" ON public.profiles TO authenticated;
ALTER POLICY "Users can update own profile" ON public.profiles TO authenticated;

-- subscriptions
ALTER POLICY "Users can view own subscriptions" ON public.subscriptions TO authenticated;
ALTER POLICY "Users can insert own subscriptions" ON public.subscriptions TO authenticated;
ALTER POLICY "Users can update own subscriptions" ON public.subscriptions TO authenticated;
ALTER POLICY "Users can delete own subscriptions" ON public.subscriptions TO authenticated;

-- transactions
ALTER POLICY "Users can view own transactions" ON public.transactions TO authenticated;
ALTER POLICY "Users can insert own transactions" ON public.transactions TO authenticated;
ALTER POLICY "Users can update own transactions" ON public.transactions TO authenticated;
ALTER POLICY "Users can delete own transactions" ON public.transactions TO authenticated;

-- notifications
ALTER POLICY "Users can view own notifications" ON public.notifications TO authenticated;
ALTER POLICY "Users can insert own notifications" ON public.notifications TO authenticated;
ALTER POLICY "Users can update own notifications" ON public.notifications TO authenticated;
ALTER POLICY "Users can delete own notifications" ON public.notifications TO authenticated;

-- user_categories
ALTER POLICY "Users can view own categories" ON public.user_categories TO authenticated;
ALTER POLICY "Users can insert own categories" ON public.user_categories TO authenticated;
ALTER POLICY "Users can delete own categories" ON public.user_categories TO authenticated;

-- 2) Prevent self-promotion on user_plans:
-- Drop the broad UPDATE policy and replace with one that disallows
-- changing plan/discount_code from the client. Only service_role
-- (used by edge functions) can change those.
DROP POLICY IF EXISTS "Users can update own plan" ON public.user_plans;

-- Users can no longer UPDATE user_plans directly from the client.
-- All plan changes must go through server-side edge functions using service role.

-- Also restrict INSERT so users can only create a row with plan='free'
-- (prevents inserting a brand new row with plan='business' on first write)
DROP POLICY IF EXISTS "Users can insert own plan" ON public.user_plans;
CREATE POLICY "Users can insert own free plan"
  ON public.user_plans
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND plan = 'free'
    AND discount_code IS NULL
  );

-- 3) Revoke direct EXECUTE on the SECURITY DEFINER trigger function
-- (it's only meant to be invoked by the auth trigger).
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM authenticated;