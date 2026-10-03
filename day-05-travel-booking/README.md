# Day 05 — Roamly Travel Booking Experience

A premium, editorial travel-discovery and booking experience built for Muhammad Abdullah's React 30-Day Portfolio challenge.

## Visual direction

The design intentionally avoids a generic OTA/dashboard look. The direction is **editorial travel magazine × conversion-focused booking product**: immersive photography, expressive serif display type, quiet forest/cream palette, compact discovery controls, and generous whitespace.

Reference research completed before implementation across current Dribbble, Behance, Pinterest travel-planning research and Awwwards-style premium web patterns. The implementation is original rather than a clone. Patterns studied included image-first discovery, receipt-clear booking summaries, compact search, curated choice architecture, trust cues, and mobile-first booking flows.

## Current feature set

- Immersive responsive hero and booking search
- Curated destination catalog with category filters and live text search
- Save/wishlist interactions
- Journey detail modal with pricing and experience highlights
- Empty/reset state
- Editorial brand/story section and travel journal
- Mobile navigation and purpose-built tablet/mobile layouts
- Keyboard-visible focus states and semantic controls
- Supabase-ready client integration
- Postgres schema for profiles, journeys, saved journeys and bookings
- Row Level Security policies scoped to authenticated users

## Stack

React 18 · Vite · Supabase · PostgreSQL · Lucide React · CSS design system

## Local setup

```bash
npm install
cp .env.example .env
npm run dev
```

Add the project's Supabase URL and **publishable key** to `.env`. Never place a service-role key in the browser.

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
```

Production check:

```bash
npm run build
npm run preview
```

## Backend

`supabase/migrations/001_initial_schema.sql` defines the database contract. Public visitors can read active journeys. Profiles, saved journeys and bookings are protected by RLS and are limited to the authenticated owner. The Auth user trigger creates a profile automatically.

## Quality gate

This project is not marked complete until the connected Supabase project is migrated/seeded, authenticated save + booking flows are tested, production build passes, desktop/tablet/mobile QA is captured, README screenshots are added, and a 30+ second real working-project showcase is generated.
