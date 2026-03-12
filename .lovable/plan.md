

# SubSense — Subscription Intelligence Platform

## Overview
A modern SaaS subscription management platform with a fintech-inspired purple/indigo design. Users can track, manage, and optimize their recurring digital spending.

## Phase 1: Foundation & Landing Page

### Design System
- Purple/indigo primary palette with soft gradients
- Clean, minimal typography inspired by Stripe/Linear
- Light mode default

### Landing Page (6 sections)
1. **Hero** — "See Every Subscription. Save Every Month." with CTA buttons and dashboard preview mockup
2. **Problem Section** — 3 cards: Blind Spots, Silent Free Trials, Inflation Fog
3. **Target Users** — "Built for the subscription generation" section
4. **Features** — 5 feature cards (Detection, Dashboard, Trial Guardian, Insights, Optimization)
5. **Statistics** — €700/year average, 85% unused subscriptions, €100 underestimate
6. **Final CTA** — "Take control of your subscriptions today"

## Phase 2: Authentication (Supabase)
- Sign up / Login pages with email + password
- Password reset flow with `/reset-password` page
- User profiles table linked to `auth.users`
- Protected routes for dashboard pages

## Phase 3: Database Schema
- **profiles** — id, user_id, display_name, avatar_url
- **subscriptions** — id, user_id, name, price, billing_cycle, start_date, next_billing_date, category, is_trial, trial_end_date, status (active/paused/cancelled), is_unused, logo_url
- **notifications** — id, user_id, subscription_id, type, message, is_read, created_at

## Phase 4: Dashboard
- Summary cards: Monthly cost, Yearly cost, Active count, Unused alerts
- Monthly spending line/bar chart (Recharts)
- Upcoming charges list
- Subscription cards with service name, price, cycle, next date, and manage actions

## Phase 5: Subscription Manager
- **Manual entry** form: name, price, billing cycle, start date, category, trial toggle
- **Simulated auto-detection**: mock recurring transaction suggestions users can confirm/reject
- CRUD operations: Add, Edit, Delete, Pause, Mark as unused
- Category options: Streaming, Gaming, Software, Productivity, Other

## Phase 6: Free Trial Guardian
- Mark subscriptions as free trials with expiration date
- Dashboard alerts for trials ending in 3 days and 1 day
- Visual indicators on trial subscription cards

## Phase 7: Analytics & Insights Page
- Monthly spending trend chart
- Category breakdown pie/donut chart
- Projected yearly spending calculation
- Optimization suggestions (unused detection, duplicate services, above-average spending)

## Phase 8: Notifications Center
- Notification bell icon in navigation
- Alert types: upcoming charges, trial endings, unused subscriptions, price increases
- Mark as read functionality
- Notification dropdown/panel

## Navigation
- **Public**: Landing page, Login, Sign Up
- **Authenticated**: Dashboard, Subscriptions, Analytics, Notifications, Settings

