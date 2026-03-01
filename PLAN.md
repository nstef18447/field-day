# Field Day — Infrastructure Layer: Supabase + Stripe + Cart

## Status: COMPLETED

## What was done

### Dependencies installed
- `@supabase/supabase-js`, `stripe`, `@stripe/stripe-js`

### New files created
- `app/types/index.ts` — Shared types (Product, CartItem, Order, OrderItem, ContactSubmission)
- `.env.local.example` — Placeholder env vars (6 keys)
- `lib/supabase.ts` — Browser + admin client (null-safe without keys)
- `lib/stripe.ts` — Server-side Stripe instance (null-safe, API version 2026-02-25.clover)
- `lib/products.ts` — Data access layer (returns local array, swappable to Supabase later)
- `supabase/schema.sql` — Tables: products, orders, order_items, contact_submissions
- `app/api/checkout/route.ts` — Stripe Checkout session endpoint (returns 503 without keys)
- `app/api/webhooks/stripe/route.ts` — Webhook stub (signature verification + checkout.session.completed handler)
- `app/context/CartContext.tsx` — Cart provider with useReducer, useCart hook (ADD, REMOVE, UPDATE_QUANTITY, CLEAR)

### Files modified
- `app/data/products.ts` — Product interface moved to types, re-exported for backward compat
- `app/layout.tsx` — Wrapped children with `<CartProvider>`
- `app/components/Navbar.tsx` — Added cart bag icon with count badge (olive icon, rust badge)
- `app/components/ProductCard.tsx` — "View Details" → "Add to Cart", disabled for "Coming Soon"
- `app/components/ShopSection.tsx` — Import path updated
- `app/globals.css` — Added .cart-icon-wrap, .cart-count, disabled button styles

### Deployment
- Pushed to GitHub: https://github.com/nstef18447/field-day.git
- Root directory for Vercel: `site`
- No env vars needed yet — all Supabase/Stripe code is null-safe

## Next steps
- Connect Vercel project to the GitHub repo (Import → set root to `site`)
- Set up Supabase project and add env vars in Vercel
- Set up Stripe account and add keys
- Wire up live data (swap lib/products.ts to query Supabase)
- Add cart drawer/page UI
- Add checkout flow triggering the /api/checkout endpoint
