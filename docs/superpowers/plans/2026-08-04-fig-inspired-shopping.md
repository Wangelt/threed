# FIG-Inspired Shopping Showcase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure the shopping home and product presentation to feel like FIG Living’s editorial ecommerce layout, while keeping existing monochrome colors and `lib/motion.ts` unchanged.

**Architecture:** Add focused `components/home/*` section components composed by `app/(main)/home/page.tsx`. Lightly evolve `SiteHeader` for desktop nav. Restyle `ProductCard` / `ProductDetailView` for image-led hierarchy. Apply a minimal spacing/heading pass on search, store, and cart so they don’t clash. Do not change `lib/colors.ts`, `app/globals.css` color tokens, or `lib/motion.ts`.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS v4, Framer Motion (existing), Redux Toolkit (cart unchanged), TypeScript

**Spec:** `docs/superpowers/specs/2026-08-04-fig-inspired-shopping-design.md`

**Verification note:** This repo has no unit-test runner. Each task verifies with `npx tsc --noEmit` and/or `npm run lint`, plus a short manual UI checklist. Do not add a test framework in this plan.

---

## File map

| File | Responsibility |
|------|----------------|
| `lib/data/mock-products.ts` | Add `heroSlides` for the home carousel (reuse existing image paths) |
| `components/home/HeroCarousel.tsx` | Full-bleed hero carousel with CTA + dots |
| `components/home/ShopByType.tsx` | `SHOP BY TYPE` category tiles |
| `components/home/ProductRow.tsx` | Horizontal scroll row of products |
| `components/home/BrandStory.tsx` | Short brand strip + Shop All |
| `app/(main)/home/page.tsx` | Compose FIG-like section stack |
| `components/layout/SiteHeader.tsx` | Desktop text nav (Home / Shop) |
| `components/product/ProductCard.tsx` | Lighter chrome, image-first card |
| `components/product/ProductDetailView.tsx` | Highlights + Buy now + less inset image |
| `app/(main)/search/page.tsx` | Light heading/spacing consistency |
| `app/search/results/page.tsx` | Light heading/spacing consistency |
| `components/cart/CartView.tsx` | Light heading/spacing consistency |
| `components/store/StoreFrontTab.tsx` | Light heading/spacing if needed |
| `components/store/StoreProductsTab.tsx` | Ensure updated cards look fine |

**Do not modify:** `lib/colors.ts`, `lib/motion.ts`, `app/globals.css` color tokens, auth/onboarding/orders flows.

---

### Task 1: Hero slide data

**Files:**
- Modify: `lib/data/mock-products.ts`

- [ ] **Step 1: Add `HeroSlide` type and `heroSlides` to `MockProducts`**

Near the top of `lib/data/mock-products.ts` (after `ProductModel`), add:

```ts
export interface HeroSlide {
  id: string;
  image: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  href: string;
}
```

Inside `MockProducts`, after `bannerImage`, add:

```ts
  heroSlides: [
    {
      id: "hero-1",
      image: "/images/banner.jpg",
      eyebrow: "FEATURED",
      title: "Precision prints for modern spaces",
      subtitle: "Discover models, cases, and custom pieces",
      href: "/search/results?q=Featured",
    },
    {
      id: "hero-2",
      image: "/images/onboard1.jpg",
      eyebrow: "NEW",
      title: "Workshop-grade detail",
      subtitle: "Lattice structures and display pieces",
      href: "/search/results?q=Models",
    },
    {
      id: "hero-3",
      image: "/images/p1.jpg",
      eyebrow: "SHOP",
      title: "Build your collection",
      subtitle: "Browse bestsellers and limited drops",
      href: "/search/results?q=All+Products",
    },
  ] satisfies HeroSlide[],
```

Do not change existing `items`, categories, or colors.

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`  
Expected: exit 0 (or only pre-existing unrelated errors — fix any new errors from this file)

- [ ] **Step 3: Commit**

```bash
git add lib/data/mock-products.ts
git commit -m "Add hero carousel slide data for home showcase"
```

---

### Task 2: HeroCarousel component

**Files:**
- Create: `components/home/HeroCarousel.tsx`

- [ ] **Step 1: Create `HeroCarousel`**

```tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { HeroSlide } from "@/lib/data/mock-products";
import { SafeImage } from "@/components/ui/SafeImage";
import { fadeUp, scaleIn } from "@/lib/motion";

interface HeroCarouselProps {
  slides: HeroSlide[];
}

export function HeroCarousel({ slides }: HeroCarouselProps) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const slide = slides[index] ?? slides[0];

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 5000);
    return () => window.clearInterval(id);
  }, [slides.length]);

  if (!slide) return null;

  function go(delta: number) {
    setIndex((i) => (i + delta + slides.length) % slides.length);
  }

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={scaleIn}
      className="relative -mx-4 h-[52vw] max-h-[420px] min-h-[220px] overflow-hidden sm:-mx-6 lg:-mx-8 lg:h-[380px]"
      aria-roledescription="carousel"
      aria-label="Featured"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="absolute inset-0"
        >
          <SafeImage
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover brightness-[0.45]"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-8 lg:p-10">
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <p className="text-[11px] font-semibold tracking-[1.6px] text-white/80">
            {slide.eyebrow}
          </p>
          <h1 className="mt-1.5 max-w-xl text-2xl font-extrabold leading-tight text-white sm:text-3xl lg:text-4xl">
            {slide.title}
          </h1>
          <p className="mt-1.5 max-w-md text-[13px] text-white/80 sm:text-base">
            {slide.subtitle}
          </p>
          <button
            type="button"
            onClick={() => router.push(slide.href)}
            className="mt-4 inline-flex h-11 items-center justify-center bg-white px-6 text-[13px] font-semibold tracking-wide text-black hover:bg-white/90"
          >
            SHOP NOW
          </button>
        </motion.div>
      </div>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => go(-1)}
            className="absolute left-2 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/90 p-2 sm:left-4 lg:flex"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => go(1)}
            className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/90 p-2 sm:right-4 lg:flex"
          >
            <ChevronRight size={20} />
          </button>
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-5 bg-white" : "w-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </motion.section>
  );
}
```

Notes:
- Negative horizontal margins cancel page padding so the hero is edge-to-edge within the content column.
- Uses existing `SafeImage` and motion helpers only.

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`  
Expected: clean for this file

- [ ] **Step 3: Commit**

```bash
git add components/home/HeroCarousel.tsx
git commit -m "Add full-bleed home hero carousel"
```

---

### Task 3: ShopByType, ProductRow, BrandStory

**Files:**
- Create: `components/home/ShopByType.tsx`
- Create: `components/home/ProductRow.tsx`
- Create: `components/home/BrandStory.tsx`

- [ ] **Step 1: Create `ShopByType.tsx`**

```tsx
"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { fadeUp, stagger, viewport } from "@/lib/motion";

interface CategoryItem {
  name: string;
  icon: LucideIcon;
}

interface ShopByTypeProps {
  categories: CategoryItem[];
}

export function ShopByType({ categories }: ShopByTypeProps) {
  const router = useRouter();

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={stagger}
      className="mt-8"
    >
      <motion.p
        variants={fadeUp}
        className="text-[11px] font-bold tracking-[1.8px] text-text-primary"
      >
        SHOP BY TYPE
      </motion.p>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map(({ name, icon: Icon }) => (
          <motion.button
            key={name}
            type="button"
            variants={fadeUp}
            whileTap={{ scale: 0.98 }}
            onClick={() =>
              router.push(`/search/results?q=${encodeURIComponent(name)}`)
            }
            className="flex flex-col items-start gap-3 border border-border/70 bg-surface p-4 text-left hover:border-black"
          >
            <Icon size={22} className="text-text-primary" />
            <span className="text-[13px] font-semibold text-text-primary">{name}</span>
          </motion.button>
        ))}
      </div>
    </motion.section>
  );
}
```

- [ ] **Step 2: Create `ProductRow.tsx`**

```tsx
"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { ProductModel } from "@/lib/data/mock-products";
import { ProductCard } from "@/components/product/ProductCard";
import { fadeUp, stagger, viewport } from "@/lib/motion";

interface ProductRowProps {
  title: string;
  products: ProductModel[];
  seeAllHref?: string;
}

export function ProductRow({
  title,
  products,
  seeAllHref = "/search/results?q=All+Products",
}: ProductRowProps) {
  const router = useRouter();

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={stagger}
      className="mt-10"
    >
      <div className="flex items-end justify-between gap-3">
        <motion.h2 variants={fadeUp} className="text-lg font-bold sm:text-xl">
          {title}
        </motion.h2>
        <button
          type="button"
          onClick={() => router.push(seeAllHref)}
          className="text-[13px] text-text-secondary hover:text-black"
        >
          See All
        </button>
      </div>
      <div className="mt-4 flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {products.map((product) => (
          <div key={product.id} className="w-[148px] shrink-0 sm:w-[168px]">
            <ProductCard
              product={product}
              compact
              onClick={() => router.push(`/product/${product.id}`)}
            />
          </div>
        ))}
      </div>
    </motion.section>
  );
}
```

- [ ] **Step 3: Create `BrandStory.tsx`**

```tsx
"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { fadeUp, viewport } from "@/lib/motion";

export function BrandStory() {
  const router = useRouter();

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={fadeUp}
      className="mt-12 border-y border-border bg-background px-1 py-10 text-center sm:py-14"
    >
      <p className="text-[11px] font-semibold tracking-[1.8px] text-text-secondary">
        WELCOME TO
      </p>
      <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl">
        Threedus
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-text-secondary sm:text-[15px]">
        We design and print pieces meant for the hours after work — display models,
        custom cases, and workshop-grade details that turn a desk or shelf into a
        space you actually want to return to.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => router.push("/search/results?q=All+Products")}
          className="h-11 bg-black px-6 text-[13px] font-semibold tracking-wide text-white hover:bg-grey-dark"
        >
          SHOP ALL
        </button>
      </div>
    </motion.section>
  );
}
```

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`  
Expected: exit 0 for new files

- [ ] **Step 5: Commit**

```bash
git add components/home/ShopByType.tsx components/home/ProductRow.tsx components/home/BrandStory.tsx
git commit -m "Add home shop-by-type, product row, and brand story"
```

---

### Task 4: Rebuild home page section stack

**Files:**
- Modify: `app/(main)/home/page.tsx`

- [ ] **Step 1: Replace home page body**

Replace the entire contents of `app/(main)/home/page.tsx` with:

```tsx
"use client";

import { useRouter } from "next/navigation";
import { MockProducts } from "@/lib/data/mock-products";
import { ProductGrid } from "@/components/product/ProductGrid";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { ShopByType } from "@/components/home/ShopByType";
import { ProductRow } from "@/components/home/ProductRow";
import { BrandStory } from "@/components/home/BrandStory";
import type { ProductModel } from "@/lib/data/mock-products";
import { motion } from "framer-motion";
import { fadeUp, viewport } from "@/lib/motion";

export default function HomePage() {
  const router = useRouter();
  const products = MockProducts.items;
  const arrivals = products.slice(0, 8);

  function handleProductTap(product: ProductModel) {
    router.push(`/product/${product.id}`);
  }

  return (
    <div className="w-full px-4 pb-12 sm:px-6 lg:px-8">
      <HeroCarousel slides={MockProducts.heroSlides} />
      <ShopByType categories={MockProducts.categories} />
      <ProductRow title="New Arrivals" products={arrivals} />
      <BrandStory />

      <div className="mt-10 flex items-center justify-between">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={fadeUp}
          className="text-lg font-bold sm:text-xl"
        >
          All Products
        </motion.h2>
        <button
          type="button"
          onClick={() => router.push("/search/results?q=All+Products")}
          className="text-[13px] text-text-secondary hover:text-black"
        >
          See All
        </button>
      </div>

      <div className="mt-4">
        <ProductGrid products={products} onProductTap={handleProductTap} />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Manual check + lint**

Run: `npm run lint`  
Expected: no new errors in home files

Manual: open `/home` — expect hero → shop by type → new arrivals row → brand story → grid.

- [ ] **Step 3: Commit**

```bash
git add app/(main)/home/page.tsx
git commit -m "Rebuild home with FIG-inspired section stack"
```

---

### Task 5: Desktop SiteHeader text nav

**Files:**
- Modify: `components/layout/SiteHeader.tsx`

- [ ] **Step 1: Add desktop nav links**

Inside the header row, after the logo `Link` and before the search `form`, insert:

```tsx
        <nav className="ml-4 hidden items-center gap-5 lg:flex" aria-label="Primary">
          <Link
            href="/home"
            className={`text-[13px] font-medium hover:text-black ${
              pathname === "/home" || pathname.startsWith("/home/")
                ? "text-black"
                : "text-text-secondary"
            }`}
          >
            Home
          </Link>
          <Link
            href="/search/results?q=All+Products"
            className={`text-[13px] font-medium hover:text-black ${
              pathname.startsWith("/search") ? "text-black" : "text-text-secondary"
            }`}
          >
            Shop
          </Link>
          <Link
            href="/store"
            className={`text-[13px] font-medium hover:text-black ${
              pathname.startsWith("/store") ? "text-black" : "text-text-secondary"
            }`}
          >
            Store
          </Link>
        </nav>
```

Keep existing search, cart, and profile controls. Do not change color tokens. Do not reintroduce bottom tabs (YAGNI for this pass; header already covers hybrid chrome).

- [ ] **Step 2: Visual check**

Manual: desktop width ≥1024 — Home / Shop / Store visible; mobile — nav hidden, icons remain.

- [ ] **Step 3: Commit**

```bash
git add components/layout/SiteHeader.tsx
git commit -m "Add desktop primary nav to site header"
```

---

### Task 6: ProductCard editorial restyle

**Files:**
- Modify: `components/product/ProductCard.tsx`

- [ ] **Step 1: Replace card markup for lighter chrome**

Replace the component implementation with:

```tsx
"use client";

import { motion } from "framer-motion";
import type { ProductModel } from "@/lib/data/mock-products";
import { ProductImage } from "./ProductImage";
import { scaleIn } from "@/lib/motion";

interface ProductCardProps {
  product: ProductModel;
  onClick?: () => void;
  index?: number;
  compact?: boolean;
}

export function ProductCard({ product, onClick, compact = false }: ProductCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      variants={scaleIn}
      whileTap={{ scale: 0.97 }}
      className={`flex w-full flex-col bg-white text-left transition-opacity hover:opacity-95 ${
        compact ? "" : ""
      }`}
    >
      <div
        className={`relative w-full overflow-hidden bg-card ${
          compact ? "aspect-[4/5]" : "aspect-[4/5]"
        }`}
      >
        <ProductImage src={product.image} alt={product.name} />
      </div>
      <p
        className={`mt-2.5 truncate font-medium text-text-primary ${
          compact ? "text-xs" : "text-[13px]"
        }`}
      >
        {product.name}
      </p>
      <p
        className={`mt-0.5 font-bold text-text-primary ${
          compact ? "text-xs" : "text-[13px]"
        }`}
      >
        {product.price}
      </p>
    </motion.button>
  );
}
```

Intent: drop border/heavy shadow; image-first; keep `scaleIn` / `whileTap`.

- [ ] **Step 2: Check home + search results**

Manual: cards in home grid and new-arrivals row look clean without heavy card chrome.

- [ ] **Step 3: Commit**

```bash
git add components/product/ProductCard.tsx
git commit -m "Restyle product cards for editorial image-first look"
```

---

### Task 7: Product detail highlights + Buy now

**Files:**
- Modify: `components/product/ProductDetailView.tsx`

- [ ] **Step 1: Soften image inset + add Highlights + dual CTAs**

In the main image button, change `rounded-2xl` to `rounded-none sm:rounded-xl` (or `rounded-none lg:rounded-lg`) so mobile feels closer to full-bleed.

After the price `<motion.p …>{product.price}</motion.p>`, insert Highlights:

```tsx
          <motion.div variants={fadeUp} className="mt-6 border-t border-border pt-5">
            <p className="text-[11px] font-bold tracking-[1.6px] text-text-primary">
              HIGHLIGHTS
            </p>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">
              {product.description}
            </p>
            <p className="mt-2 text-[13px] text-text-secondary">
              Materials: {product.materials.join(" · ")}
            </p>
          </motion.div>
```

Replace the desktop CTA block (`mt-8 hidden lg:block`) with:

```tsx
          <motion.div variants={fadeUp} className="mt-8 hidden gap-3 lg:flex">
            <div className="flex-1">
              <PrimaryButton label="Add to Cart" onClick={() => setVariantOpen(true)} />
            </div>
            <button
              type="button"
              onClick={() => setVariantOpen(true)}
              className="flex h-[52px] flex-1 items-center justify-center rounded-xl border border-border text-[15px] font-medium text-black hover:bg-surface"
            >
              Buy now
            </button>
          </motion.div>
```

Replace the fixed mobile bottom bar with dual actions:

```tsx
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-white px-4 py-3 sm:px-6 lg:hidden">
        <div className="flex gap-2.5">
          <div className="flex-1">
            <PrimaryButton label="Add to Cart" onClick={() => setVariantOpen(true)} />
          </div>
          <button
            type="button"
            onClick={() => setVariantOpen(true)}
            className="flex h-[52px] flex-1 items-center justify-center rounded-xl border border-border text-[15px] font-medium text-black hover:bg-surface"
          >
            Buy now
          </button>
        </div>
      </div>
```

Keep `ProductVariantSheet` and gallery navigation unchanged. Keep existing motion imports/variants.

- [ ] **Step 2: Manual check**

Open `/product/1` — Highlights visible; Add to Cart + Buy now on mobile and desktop; variant sheet still opens.

- [ ] **Step 3: Commit**

```bash
git add components/product/ProductDetailView.tsx
git commit -m "Add product highlights and dual purchase CTAs"
```

---

### Task 8: Light pass — search, cart, store

**Files:**
- Modify: `app/(main)/search/page.tsx` (heading weight/spacing only if a page title exists; otherwise ensure outer padding matches home: `px-4 sm:px-6 lg:px-8`)
- Modify: `app/search/results/page.tsx` — use same horizontal padding; ensure results use `ProductGrid` / `ProductCard` (already will pick up card restyle)
- Modify: `components/cart/CartView.tsx` — change cart title class to `text-lg font-bold` for hierarchy consistency; keep logic
- Modify: `components/store/StoreFrontTab.tsx` and/or `StoreProductsTab.tsx` — only if headings still say flash-sale style or padding fights home; align section label tracking to `tracking-[1.6px]` uppercase sparingly where a section label already exists

- [ ] **Step 1: Align search results page padding**

In `app/search/results/page.tsx`, ensure the root container includes:

```tsx
className="... px-4 sm:px-6 lg:px-8 ..."
```

(merge with existing classes; do not rewrite search logic)

- [ ] **Step 2: Cart title hierarchy**

In `components/cart/CartView.tsx`, change:

```tsx
<h1 className="text-[17px] font-semibold text-black">My Cart</h1>
```

to:

```tsx
<h1 className="text-lg font-bold text-black">My Cart</h1>
```

- [ ] **Step 3: Spot-check store product tab**

Open `/store` products tab — cards should already look editorial from Task 6. Only adjust grid gap/padding if cramped.

- [ ] **Step 4: Lint + typecheck**

Run:

```bash
npm run lint
npx tsc --noEmit
```

Expected: no new errors from touched files

- [ ] **Step 5: Commit**

```bash
git add app/(main)/search/page.tsx app/search/results/page.tsx components/cart/CartView.tsx components/store/StoreFrontTab.tsx components/store/StoreProductsTab.tsx
git commit -m "Light consistency pass on search, cart, and store"
```

(Only `git add` files that actually changed.)

---

### Task 9: End-to-end verification

**Files:** none (verification only)

- [ ] **Step 1: Build**

Run: `npm run build`  
Expected: successful Next.js build

- [ ] **Step 2: Manual checklist**

With `npm run dev`:

1. `/home` — full-bleed carousel, shop by type, new arrivals row, brand story, product grid
2. Desktop header — Home / Shop / Store links
3. Product card — no heavy shadow border chrome
4. `/product/1` — highlights + dual CTAs; variant sheet works
5. `/search`, `/search/results`, `/cart`, `/store` — usable, not visually broken
6. Confirm `lib/colors.ts`, `lib/motion.ts`, and `:root` colors in `globals.css` are unchanged (`git diff` those files empty)

- [ ] **Step 3: Final commit only if verification fixes were needed**

If fixes were required, commit them with a clear message (e.g. `fix: hero overflow on small screens`). Otherwise skip.

---

## Spec coverage self-check

| Spec item | Task |
|-----------|------|
| Keep colors/motion | Constraint in header + Task 9 check |
| Hybrid chrome / desktop nav | Task 5 (no bottom-nav rewire — YAGNI) |
| Hero carousel | Tasks 1–2, 4 |
| Shop by type | Tasks 3–4 |
| New arrivals row | Tasks 3–4 |
| Brand story | Tasks 3–4 |
| Product grid | Task 4 |
| Product card restyle | Task 6 |
| Product detail highlights + Buy now | Task 7 |
| Light search/store/cart | Task 8 |
| Out of scope auth/orders | Not tasked |

## Placeholder / consistency check

- No TBD/TODO left in steps
- `HeroSlide` / `heroSlides` named consistently across Tasks 1–4
- `ProductCard` `compact` prop used by `ProductRow`
- Buy now opens existing `ProductVariantSheet` (same as Add to Cart) — intentional YAGNI
