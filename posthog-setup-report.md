<wizard-report>
# PostHog post-wizard report

The wizard has completed a full client-side integration of PostHog into Paythra. `posthog-js` was installed and initialized in `src/main.tsx` with autocapture, pageview tracking, and exception autocapture enabled. User identification is wired into `AuthContext` so every identified event is tied to the correct Supabase user ID. Eleven business events cover the full user journey from signup through subscription management and premium conversion.

## Environment variables

Added to `.env` (never committed):

| Variable | Purpose |
|---|---|
| `VITE_POSTHOG_KEY` | PostHog project token |
| `VITE_POSTHOG_HOST` | PostHog ingestion host |

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_signed_up` | User creates a new account via email | `src/pages/Signup.tsx` |
| `user_logged_in` | User signs in via email/password | `src/pages/Login.tsx` |
| `subscription_added` | User adds a new subscription | `src/hooks/useSubscriptions.ts` |
| `subscription_updated` | User edits an existing subscription | `src/hooks/useSubscriptions.ts` |
| `subscription_deleted` | User removes a subscription | `src/hooks/useSubscriptions.ts` |
| `checkout_initiated` | User clicks "Choose Premium" and is sent to Stripe | `src/pages/Pricing.tsx` |
| `premium_upgrade_completed` | Payment verified and plan upgraded to premium | `src/pages/Success.tsx` |
| `gmail_connected` | User connects a Gmail account for auto-detection | `src/components/dashboard/GmailGSIDetect.tsx` |
| `gmail_scan_completed` | Gmail inbox scan finishes with detected service count | `src/components/dashboard/GmailGSIDetect.tsx` |
| `detected_subscription_added` | User confirms a Gmail-detected subscription | `src/components/dashboard/GmailGSIDetect.tsx` |
| `business_quote_requested` | User submits the Business plan contact form | `src/pages/Pricing.tsx` |

## User identification

`posthog.identify(userId, { email })` is called in `AuthContext` whenever a Supabase session is established (login, signup, page reload). `posthog.reset()` is called on sign-out to clear the identity.

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](/dashboard/1615345)
- [New signups over time](/insights/tEGpDlUs)
- [Subscriptions added over time](/insights/tMw9eWxm)
- [Premium upgrade conversion funnel](/insights/VvrrN43y) — signup → checkout → premium
- [Premium upgrades over time](/insights/mE66NqPB)
- [Gmail auto-detection adoption](/insights/YBGnOXUC) — Gmail connections vs scans completed

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
