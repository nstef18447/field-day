# Field Day — Project Plan

## Status: Admin Dashboard COMPLETE

## Completed
- [x] Initial site (Hero, Shop, About, Contact, Footer)
- [x] Infrastructure layer (Supabase + Stripe + Cart)
- [x] Admin dashboard — password-protected at `/admin`

## Admin Dashboard Details
- **Auth**: Password gate via middleware + cookie (`ADMIN_PASSWORD` env var)
- **Login**: `/admin/login` → password `fieldday1995`
- **Pages**:
  - `/admin/products` — CRUD with modal form, image upload to Supabase Storage, active toggle
  - `/admin/orders` — Expandable rows with order items, status dropdown (pending/paid/fulfilled/cancelled)
  - `/admin/contacts` — Read-only, click to expand messages
- **Layout**: Sidebar (240px olive-dark) + header with logout
- **Styling**: Inline styles on all admin components (avoids Tailwind 4 CSS layer conflicts)
- **Key fix**: Sidebar uses `<div>` not `<nav>` to avoid global nav CSS (`position: fixed`) conflict

## Deployment
- **Vercel**: `field-day-gamma.vercel.app`
- **Repo**: `nstef18447/field-day` (master branch)
- **Root directory**: `./` (repo root)
- **Env vars needed**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD`

## Next Steps
- [ ] Create Supabase Storage bucket `product-images` (needed for image upload)
- [ ] Add products via admin dashboard
- [ ] Wire up Stripe keys for checkout
- [ ] Add cart drawer/page UI
- [ ] Connect Vercel custom domain
