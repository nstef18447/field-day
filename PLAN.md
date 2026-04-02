# Field Day — Project Plan

## What This Is
An e-commerce site for handmade keepsakes (pennants, ribbons, badges, etc.) built with Next.js 16, TypeScript, Supabase, and Stripe.

## Tech Stack
- **Framework**: Next.js 16 (App Router) + TypeScript
- **Styling**: Tailwind CSS v4 + custom CSS classes in globals.css
- **Database**: Supabase (PostgreSQL)
- **Payments**: Stripe (embedded checkout in cart drawer)
- **Hosting**: Vercel
- **Fonts**: Luckiest Guy (display), Nunito Sans (body)
- **Brand Colors**: cream `#f0efe0`, sage `#a4cea6`, sage-light `#c8e6c9`, navy `#04324b`, navy-dark `#032a3d`, blue-light `#bfdfea`, blue-muted `#d5eaf2`

## Deployment
- **Vercel**: `field-day-gamma.vercel.app`
- **Repo**: `nstef18447/field-day` (master branch)
- **Env vars**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `ADMIN_PASSWORD`

## Architecture

### Customer-Facing Pages
| Route | Purpose |
|-------|---------|
| `/` | Homepage: hero with plaid bg + floating logo, marquee, shop section (product grid), about section, tagline banner, contact form, footer. Uses `export const dynamic = "force-dynamic"` to prevent stale caching. |
| `/products/[id]` | Product detail page: if product has variants, shows full-width customizer layout (photo + character overlay left, swatches + character picker right). Otherwise two-column grid (large image left, info right). |

### Components
| Component | Location | Purpose |
|-----------|----------|---------|
| `Navbar` | `app/components/Navbar.tsx` | Fixed nav with logo, links (Home/Shop/About/Contact), cart icon with count, hamburger menu |
| `Hero` | `app/components/Hero.tsx` | Plaid background (field-day-plaid.png), floating logo (field-day-logo.png, 305px desktop / 240px mobile), tagline, "Shop the Collection" CTA |
| `Marquee` | `app/components/Marquee.tsx` | Scrolling text banner (navy bg, cream text, sage dots) |
| `ShopSection` | `app/components/ShopSection.tsx` | Server component: fetches products, falls back to variant photos for products without images |
| `ProductCard` | `app/components/ProductCard.tsx` | Display card with fallbackImage prop, wrapped in `<Link>` to `/products/[id]` |
| `ProductDetailActions` | `app/components/ProductDetailActions.tsx` | Client component: customization input (if Customizable) + Add to Cart button |
| `ProductCustomizer` | `app/components/ProductCustomizer.tsx` | Customer-facing customizer: fetches variants, dynamic Google Font loading, photo + character overlay, color scheme swatches, A-Z/0-9 character picker, animated pop-in, Add to Cart with variant data |
| `CartDrawer` | `app/components/CartDrawer.tsx` | Slide-out cart: item list with variant/character info, qty controls, embedded Stripe checkout. Widens to 480px in checkout mode. |
| `EmbeddedCheckoutForm` | `app/components/EmbeddedCheckoutForm.tsx` | Stripe `EmbeddedCheckoutProvider` + `EmbeddedCheckout` wrapper |
| `AboutSection` | `app/components/AboutSection.tsx` | About section with 3 values (Handmade, Personal, Timeless). Navy bg with scallop dividers. |
| `ContactSection` | `app/components/ContactSection.tsx` | Contact form (Name, Email, Message) |
| `TaglineBanner` | `app/components/TaglineBanner.tsx` | Decorative tagline section (sage, navy, blue-light colored items) |
| `Footer` | `app/components/Footer.tsx` | Footer (navy-dark bg) with brand, shop links, company links, social links |
| `ScrollReveal` | `app/components/ScrollReveal.tsx` | Intersection observer for fade-in animations |

### Context
| File | Purpose |
|------|---------|
| `app/context/CartContext.tsx` | useReducer-based cart with ADD_ITEM, REMOVE_ITEM, UPDATE_QUANTITY, CLEAR_CART. Variant-aware item matching (product_id + variant_id + selected_character + customization_text). |

### Library Files
| File | Purpose |
|------|---------|
| `lib/products.ts` | `getProducts()` — all active products from Supabase (falls back to local data). `getProductById(id)` — single product by ID. |
| `lib/variants.ts` | `getVariantsByProductId(productId)` — active variants for a product, ordered by sort_order. |
| `lib/stripe.ts` | Server-side Stripe client initialization |
| `lib/stripe-client.ts` | Client-side `loadStripe()` for embedded checkout |
| `lib/supabase.ts` | Supabase client + admin client |

### API Routes
| Endpoint | Methods | Purpose |
|----------|---------|---------|
| `/api/checkout` | POST | Creates Stripe embedded checkout session with variant/character in line item names and metadata |
| `/api/webhooks/stripe` | POST | Handles `checkout.session.completed` — updates order status to "paid" |
| `/api/variants` | GET | Public endpoint: active variants by product_id, ordered by sort_order |
| `/api/admin/login` | POST | Password auth, sets httpOnly cookie |
| `/api/admin/logout` | POST | Clears session cookie |
| `/api/admin/products` | GET, POST | List/create products |
| `/api/admin/products/[id]` | PUT, DELETE | Update/delete product |
| `/api/admin/products/upload` | POST | Image upload to Supabase Storage |
| `/api/admin/orders` | GET | List orders with nested items |
| `/api/admin/orders/[id]` | PUT | Update order status |
| `/api/admin/contacts` | GET, POST | List/create contact submissions |
| `/api/admin/variants` | GET, POST | List/create product variants |
| `/api/admin/variants/[id]` | PUT, DELETE | Update/delete variant |

### Admin Dashboard (`/admin/*`)
- **Auth**: Password gate via middleware + cookie (`ADMIN_PASSWORD` env var)
- **Pages**:
  - `/admin/products` — CRUD with modal form, image upload, active toggle, "Color Schemes" button per product
  - `/admin/orders` — Expandable rows with order items (including variant/character info), status dropdown
  - `/admin/contacts` — Read-only, click to expand messages
- **Variant Manager**: Card grid for each product's color schemes. Each variant has photo, Google Font selection (6 fonts), character color/stroke/position/size settings with live preview.
- **Layout**: Sidebar (240px navy-dark) + header with logout

### Types (`app/types/index.ts`)
- `Product` — id (number), name, description, price_cents, badge?, images?, max_custom_chars?
- `ProductVariant` — id, product_id, name, photo?, character_font, character_color, character_stroke_color?, character_stroke_width?, character_position_x/y, character_size, is_active?, sort_order
- `CartItem` — product, quantity, customization_text?, variant_id?, variant_name?, selected_character?
- `Order` — id, stripe_session_id, customer_email, total_cents, status
- `OrderItem` — id, order_id, product_id, quantity, price_cents, customization_text?, variant_id?, variant_name?, selected_character?
- `ContactSubmission` — id, name, email, message

### Database Tables
| Table | Purpose |
|-------|---------|
| `products` | id, name, description, price_cents, badge, images[], max_custom_chars, is_active |
| `product_variants` | id, product_id, name, photo, character_font, character_color, character_stroke_color, character_stroke_width, character_position_x/y, character_size, is_active, sort_order |
| `orders` | stripe_session_id, customer_email, total_cents, status (pending/paid/fulfilled/cancelled) |
| `order_items` | order_id, product_id, quantity, price_cents, customization_text, variant_id, variant_name, selected_character |
| `contact_submissions` | name, email, message |

### Supabase Storage
- **Bucket**: `product-images` (public access enabled)

### Local Fallback Data
- `app/data/products.ts` — 6 hardcoded products used when Supabase is not configured

## Completed Features
- [x] Initial site (Hero, Shop, About, Contact, Footer)
- [x] Infrastructure layer (Supabase + Stripe + Cart context)
- [x] Admin dashboard — password-protected at `/admin` with products, orders, contacts
- [x] Product detail pages — `/products/[id]` with two-column layout, customization support
- [x] Product cards as link cards — links to detail page, variant photo fallback
- [x] Embedded Stripe checkout — payment handled inside cart drawer, no redirect
- [x] Cart drawer with checkout mode — widens to 480px, shows Stripe form inline
- [x] Product customizer — admin-managed color scheme variants with live character overlay preview
- [x] Supabase Storage bucket `product-images` created with public access
- [x] Force-dynamic rendering on homepage to prevent stale data caching
- [x] Visual rebrand — sage/navy/blue palette, Luckiest Guy font, new logo + plaid PNG

## Next Steps
- [ ] Connect Vercel custom domain
- [ ] Wire up Stripe webhook endpoint in Stripe Dashboard
