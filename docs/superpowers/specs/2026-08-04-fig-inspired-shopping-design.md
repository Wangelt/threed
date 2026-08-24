# FIG-Inspired Shopping Showcase Design

**Date:** 2026-08-04  
**Status:** Approved for planning  
**Approach:** Homepage showcase first (option 2)  
**Reference:** [FIG Living](https://www.figliving.com/) — structure and composition only

## Goal

Make shopping surfaces feel like a premium lifestyle ecommerce site in the spirit of FIG Living, while keeping the existing monochrome palette, motion system, and 3D-prints brand.

## Decisions (locked)

| Topic | Choice |
|--------|--------|
| Fidelity | Inspired by FIG — not a visual/content clone |
| Shell | Hybrid — desktop top-nav ecommerce chrome; mobile keeps compact header (and bottom tabs if re-wired) |
| Scope this pass | Shopping showcase: home + product card/detail first; light pass on search/store/cart |
| Colors | **Unchanged** — keep `lib/colors.ts` / `app/globals.css` tokens |
| Motion | **Unchanged** — keep `lib/motion.ts` variants and usage patterns |
| Brand | Keep Threedus / 3D prints identity and mock product data |

## Out of scope

- Auth, onboarding, OTP, phone, terms
- Orders, track, cancel, refund, profile deep flows (profile link may remain in header)
- Palette rewrite, new accent colors, new font stack as a “theme swap”
- Motion rewrite or new animation library patterns
- Copying FIG Living product copy, coupons, or press logos

## Current baseline

- Next.js 16 app with Redux cart/auth, Framer Motion, Tailwind v4
- Shopping chrome: `components/layout/SiteHeader.tsx` via `AppChrome`
- Home: inset promo banner + icon categories + “Flash Sales” grid (`app/(main)/home/page.tsx`)
- Products: `ProductCard`, `ProductGrid`, `ProductDetailView`, mock data in `lib/data/mock-products.ts`
- Colors: monochrome Figma palette; fonts: Inter

## Design

### 1. Visual constraints

- Do **not** change CSS color variables or `AppColors`
- Do **not** change `lib/motion.ts` curves/variants; reuse `fadeUp`, `scaleIn`, `stagger`, `viewport`, etc.
- FIG influence is **layout, section hierarchy, and product presentation**, not a new theme

### 2. Site chrome (hybrid)

- **Desktop:** Evolve `SiteHeader` toward FIG-like ecommerce chrome: clearer brand lockup, optional text nav (Home / categories or Shop), search, cart, profile — sticky, full-width, monochrome
- **Mobile:** Keep compact header actions (search/cart/profile). If bottom tab bar is reintroduced for `(main)` routes, style it with existing tokens only; do not invent a new color system
- Auth-related routes continue to hide header via existing `HIDE_HEADER_PREFIXES`

### 3. Homepage (`app/(main)/home/page.tsx`)

Replace the current inset “BEST DEALS” card + icon row + Flash Sales block with this section stack (same colors/motion):

1. **Full-bleed hero carousel** — edge-to-edge (within page padding rules consistent with shell), primary CTA (“Shop Now”), dots/arrows; uses existing banner/product imagery from mocks
2. **Shop by type** — category tiles from `MockProducts.categories` (or a small curated subset), editorial label `SHOP BY TYPE`, larger tap targets than current icon circles
3. **New arrivals row** — horizontally scrollable product row (reuse `ProductCard` or a compact variant)
4. **Brand story strip** — short Threedus sanctuary/workshop blurb + "Shop All" linking to search results; not FIG copy
5. **Product grid** — existing grid of catalog items below

Keep page transitions and scroll reveals via current motion helpers.

### 4. Product card (`components/product/ProductCard.tsx`)

FIG-like presentation without new colors:

- Larger image ratio emphasis; reduce heavy shadow/card chrome where it fights editorial feel
- Optional small status line (e.g. “Bestseller”) when data allows; otherwise omit rather than invent fake badges everywhere
- Clear name + price hierarchy using the existing single `price` string (no MRP/sale fields in this pass)
- Tap/hover continues to use existing motion (`scaleIn`, `whileTap`)

### 5. Product detail (`components/product/ProductDetailView.tsx`)

- Image-led layout (already split on large screens) — push toward full-bleed / less rounded “inset photo” feel on mobile where practical
- Stronger price block; secondary “Buy now” alongside existing add-to-cart flow
- Short **Highlights** block derived from existing description/materials
- Keep `ProductVariantSheet` and gallery route behavior

### 6. Light pass — search, store, cart

- Apply spacing/typography hierarchy and any shared card updates so these screens don’t clash with the new home/product look
- No structural rewrite of store tabs, cart logic, or search results algorithms
- Touch files only as needed for consistency (e.g. padding, headings, using updated `ProductCard`)

## Component / file impact (expected)

| Area | Likely files |
|------|----------------|
| Home | `app/(main)/home/page.tsx`, possible new `components/home/*` section components |
| Chrome | `components/layout/SiteHeader.tsx`, optionally `(main)/layout` / bottom nav if wired |
| Product | `ProductCard.tsx`, `ProductDetailView.tsx`, maybe `ProductGrid.tsx` |
| Data | `mock-products.ts` only if carousel slides or MRP fields are needed |
| Tokens / motion | **No changes** to `globals.css` color tokens, `lib/colors.ts`, or `lib/motion.ts` unless a bugfix is required |

## Success criteria

- Home reads as editorial ecommerce (hero → shop by type → arrivals → story → grid), not a single promo card + icon strip
- Product card/detail feel closer to FIG product presentation while staying monochrome
- Search/store/cart still usable and visually consistent
- Side-by-side with before: same colors and motion language; clearly different layout

## Non-goals reminder

This is not a FIG Living rebrand, not a lighting catalog, and not a theme migration.
