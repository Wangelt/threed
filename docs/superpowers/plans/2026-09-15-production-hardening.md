# Production Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Harden the Threedus Next.js app for production by adding auth middleware, error boundaries, security headers, zod input validation, cookie hardening, logout token revocation, and loading states.

**Architecture:** Changes are layered across routing (middleware.ts), UI (error.tsx, not-found.tsx, loading states), config (next.config.ts security headers), auth (logout revocation, cookie hardening), and validation (lib/schemas.ts + consuming components). Each task produces a standalone commit. No test framework is configured in this project — each task is verified by running `npm run build` at the end.

**Tech Stack:** Next.js 16, React 19, Firebase Admin SDK, Zod, TypeScript

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `package.json` | Modify | Add zod dependency |
| `lib/schemas.ts` | **Create** | Zod schemas for phone, otp, address |
| `middleware.ts` | **Create** | Redirect unauthenticated users on protected routes |
| `app/error.tsx` | **Create** | Root React error boundary |
| `app/not-found.tsx` | **Create** | 404 page |
| `next.config.ts` | Modify | Add security headers (CSP, X-Frame-Options, etc.) |
| `app/api/auth/session/route.ts` | Modify | Harden cookie: sameSite strict |
| `app/api/auth/logout/route.ts` | Modify | Revoke Firebase refresh tokens on logout |
| `components/cart/CartView.tsx` | Modify | Remove duplicate state calls; add zod address validation |
| `app/auth/page.tsx` | Modify | Replace manual phone check with zod |
| `app/otp/page.tsx` | Modify | Add zod OTP validation before verification |
| `app/(main)/home/page.tsx` | Modify | Add loading skeleton while products fetch |
| `app/wishlist/page.tsx` | Modify | Add loading skeleton while wishlist fetches |

---

### Task 1: Install zod

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install zod**

```bash
npm install zod
```

Expected: `zod` appears in `dependencies` in `package.json`.

- [ ] **Step 2: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install zod for input validation"
```

---

### Task 2: Create validation schemas

**Files:**
- Create: `lib/schemas.ts`

- [ ] **Step 1: Create `lib/schemas.ts`**

```typescript
import { z } from "zod";

export const phoneSchema = z
  .string()
  .regex(/^\d{10}$/, "Phone number must be exactly 10 digits");

export const otpSchema = z
  .string()
  .regex(/^\d{6}$/, "Please enter all 6 digits");

export const addressSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().regex(/^\d{10}$/, "Valid 10-digit phone number required"),
  line1: z.string().min(5, "Address line 1 is required"),
  line2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().regex(/^\d{6}$/, "Valid 6-digit pincode required"),
});

export type AddressInput = z.infer<typeof addressSchema>;
```

- [ ] **Step 2: Commit**

```bash
git add lib/schemas.ts
git commit -m "feat: add zod validation schemas for phone, otp, and address"
```

---

### Task 3: Add security headers to next.config.ts

**Files:**
- Modify: `next.config.ts`

- [ ] **Step 1: Replace `next.config.ts` with the following**

```typescript
import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://www.gstatic.com https://apis.google.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://res.cloudinary.com https://images.unsplash.com",
  "font-src 'self' data:",
  "connect-src 'self' https://*.firebaseapp.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://www.googleapis.com https://api.razorpay.com https://lumberjack.razorpay.com",
  "frame-src https://checkout.razorpay.com https://*.firebaseapp.com https://accounts.google.com",
  "object-src 'none'",
  "base-uri 'self'",
].join("; ");

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "Content-Security-Policy", value: csp },
        ],
      },
    ];
  },
};

export default nextConfig;
```

- [ ] **Step 2: Commit**

```bash
git add next.config.ts
git commit -m "feat: add security headers (CSP, X-Frame-Options, nosniff) to next.config.ts"
```

---

### Task 4: Create auth middleware

**Files:**
- Create: `middleware.ts` (project root, same level as `next.config.ts`)

- [ ] **Step 1: Create `middleware.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PATHS = ["/cart", "/orders", "/profile", "/wishlist"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );

  if (isProtected && !request.cookies.get("firebaseSession")?.value) {
    const loginUrl = new URL("/auth", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/cart", "/orders/:path*", "/profile", "/wishlist"],
};
```

- [ ] **Step 2: Commit**

```bash
git add middleware.ts
git commit -m "feat: add middleware to protect cart, orders, profile, and wishlist routes"
```

---

### Task 5: Create root error boundary and 404 page

**Files:**
- Create: `app/error.tsx`
- Create: `app/not-found.tsx`

- [ ] **Step 1: Create `app/error.tsx`**

```tsx
"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h2 className="text-xl font-bold">Something went wrong</h2>
      <p className="max-w-sm text-sm text-text-secondary">
        An unexpected error occurred. You can try again or return to the home page.
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white"
        >
          Try again
        </button>
        <a
          href="/"
          className="rounded-xl border border-border px-6 py-3 text-sm font-semibold"
        >
          Go home
        </a>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `app/not-found.tsx`**

```tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h2 className="text-2xl font-bold">Page not found</h2>
      <p className="text-sm text-text-secondary">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white"
      >
        Go home
      </Link>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add app/error.tsx app/not-found.tsx
git commit -m "feat: add root error boundary and 404 page"
```

---

### Task 6: Harden session cookie

**Files:**
- Modify: `app/api/auth/session/route.ts`

- [ ] **Step 1: Change sameSite from `"lax"` to `"strict"`**

Find this line in `app/api/auth/session/route.ts`:
```typescript
      sameSite: "lax",
```
Replace with:
```typescript
      sameSite: "strict",
```

- [ ] **Step 2: Commit**

```bash
git add app/api/auth/session/route.ts
git commit -m "fix: harden session cookie with sameSite=strict"
```

---

### Task 7: Fix logout to revoke Firebase tokens

**Files:**
- Modify: `app/api/auth/logout/route.ts`

- [ ] **Step 1: Replace the entire file with token revocation logic**

```typescript
import { adminAuth } from "@/lib/firebase-admin";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("firebaseSession");

    if (session?.value) {
      try {
        const decoded = await adminAuth.verifyIdToken(session.value, true);
        await adminAuth.revokeRefreshTokens(decoded.uid);
      } catch {
        // Token already expired or invalid — still proceed to clear the cookie
      }
    }

    cookieStore.delete("firebaseSession");
    return NextResponse.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Failed to logout" }, { status: 500 });
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add app/api/auth/logout/route.ts
git commit -m "fix: revoke Firebase refresh tokens on logout"
```

---

### Task 8: Fix CartView — remove duplicate calls and add address validation

**Files:**
- Modify: `components/cart/CartView.tsx`

- [ ] **Step 1: Add the zod import at the top of the file**

After the existing imports, add:
```typescript
import { addressSchema } from "@/lib/schemas";
```

- [ ] **Step 2: Remove the duplicate state calls**

Find this block inside `handleCheckout` (lines 125–129 in the original file):
```typescript
    setIsCheckingOut(true);
    setCheckoutError("");

    setIsCheckingOut(true);
    setCheckoutError("");
```
Replace with:
```typescript
    setIsCheckingOut(true);
    setCheckoutError("");
```

- [ ] **Step 3: Replace the manual address check with zod**

Find:
```typescript
      if (!address || !address.fullName || !address.phone || !address.line1 || !address.city || !address.state || !address.pincode) {
        router.push("/profile?checkout=address-required");
        return;
      }
```
Replace with:
```typescript
      const addressResult = addressSchema.safeParse(address);
      if (!addressResult.success) {
        router.push("/profile?checkout=address-required");
        return;
      }
      const validAddress = addressResult.data;
```

- [ ] **Step 4: Use `validAddress` in the order creation call**

Find:
```typescript
        shippingAddress: {
          fullName: address.fullName,
          phone: address.phone,
          line1: address.line1,
          line2: address.line2 || "",
          city: address.city,
          state: address.state,
          pincode: address.pincode,
        },
```
Replace with:
```typescript
        shippingAddress: {
          fullName: validAddress.fullName,
          phone: validAddress.phone,
          line1: validAddress.line1,
          line2: validAddress.line2 ?? "",
          city: validAddress.city,
          state: validAddress.state,
          pincode: validAddress.pincode,
        },
```

- [ ] **Step 5: Commit**

```bash
git add components/cart/CartView.tsx
git commit -m "fix: remove duplicate state calls and add zod address validation in checkout"
```

---

### Task 9: Add phone validation to auth page

**Files:**
- Modify: `app/auth/page.tsx`

- [ ] **Step 1: Add the zod import**

Add after the existing imports:
```typescript
import { phoneSchema } from "@/lib/schemas";
```

- [ ] **Step 2: Replace the manual phone check with zod**

Find:
```typescript
      if (digits.length < 10) {
        throw new Error("Phone number must be at least 10 digits");
      }

      // Format to E.164 format with country code
      const fullPhone = formatPhoneNumber(digits, "91"); // Using India +91

      if (!isValidPhoneNumber(fullPhone)) {
        throw new Error("Invalid phone number format");
      }
```
Replace with:
```typescript
      const phoneResult = phoneSchema.safeParse(digits);
      if (!phoneResult.success) {
        throw new Error(phoneResult.error.issues[0]?.message ?? "Invalid phone number");
      }

      const fullPhone = formatPhoneNumber(digits, "91");

      if (!isValidPhoneNumber(fullPhone)) {
        throw new Error("Invalid phone number format");
      }
```

- [ ] **Step 3: Commit**

```bash
git add app/auth/page.tsx
git commit -m "feat: replace manual phone length check with zod schema"
```

---

### Task 10: Add OTP validation to OTP page

**Files:**
- Modify: `app/otp/page.tsx`

- [ ] **Step 1: Add the zod import**

Add after the existing imports:
```typescript
import { otpSchema } from "@/lib/schemas";
```

- [ ] **Step 2: Add validation at the start of `handleVerifyOtp`**

Find:
```typescript
      const otp = otpDigits.join("");
      const confirmation = getOtpConfirmation();
```
Replace with:
```typescript
      const otp = otpDigits.join("");

      const otpResult = otpSchema.safeParse(otp);
      if (!otpResult.success) {
        setError(otpResult.error.issues[0]?.message ?? "Invalid OTP");
        return;
      }

      const confirmation = getOtpConfirmation();
```

- [ ] **Step 3: Commit**

```bash
git add app/otp/page.tsx
git commit -m "feat: add zod OTP validation before Firebase verification"
```

---

### Task 11: Add loading skeletons to home and wishlist pages

**Files:**
- Modify: `app/(main)/home/page.tsx`
- Modify: `app/wishlist/page.tsx`

- [ ] **Step 1: Add loading state to `app/(main)/home/page.tsx`**

Find:
```typescript
export default function HomePage() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductModel[]>([]);
  useEffect(() => {
    api.products.list({ limit: 100 })
      .then(({ products: apiProducts }) => setProducts((apiProducts as ApiProduct[]).map(toProductModel)))
      .catch(() => setProducts([]));
  }, []);
```
Replace with:
```typescript
export default function HomePage() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    api.products.list({ limit: 100 })
      .then(({ products: apiProducts }) => setProducts((apiProducts as ApiProduct[]).map(toProductModel)))
      .catch(() => setProducts([]))
      .finally(() => setIsLoading(false));
  }, []);
```

Find the "All Products" grid at the bottom of the JSX:
```typescript
      <div className="mt-4">
        <ProductGrid products={products} onProductTap={handleProductTap} />
      </div>
```
Replace with:
```typescript
      <div className="mt-4">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square animate-pulse rounded-[14px] bg-surface" />
            ))}
          </div>
        ) : (
          <ProductGrid products={products} onProductTap={handleProductTap} />
        )}
      </div>
```

- [ ] **Step 2: Add loading state to `app/wishlist/page.tsx`**

Find:
```typescript
export default function WishlistPage() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductModel[]>([]);

  useEffect(() => {
    api.wishlist.get()
      .then((result) => setProducts(((result as { products?: WishlistProduct[] }).products || []).map(toProductModel)))
      .catch(() => setProducts([]));
  }, []);
```
Replace with:
```typescript
export default function WishlistPage() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.wishlist.get()
      .then((result) => setProducts(((result as { products?: WishlistProduct[] }).products || []).map(toProductModel)))
      .catch(() => setProducts([]))
      .finally(() => setIsLoading(false));
  }, []);
```

Find the conditional rendering in the JSX:
```typescript
      {products.length ? (
        <div className="py-4">
          <ProductGrid products={products} onProductTap={(product) => router.push(`/product/${product.id}`)} />
        </div>
      ) : (
        <p className="py-12 text-center text-text-secondary">Your wishlist is empty</p>
      )}
```
Replace with:
```typescript
      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 py-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-square animate-pulse rounded-[14px] bg-surface" />
          ))}
        </div>
      ) : products.length ? (
        <div className="py-4">
          <ProductGrid products={products} onProductTap={(product) => router.push(`/product/${product.id}`)} />
        </div>
      ) : (
        <p className="py-12 text-center text-text-secondary">Your wishlist is empty</p>
      )}
```

- [ ] **Step 3: Commit**

```bash
git add "app/(main)/home/page.tsx" app/wishlist/page.tsx
git commit -m "feat: add loading skeleton to home and wishlist pages"
```

---

### Task 12: Verify build passes

- [ ] **Step 1: Run the production build**

```bash
npm run build
```

Expected: Build completes with no errors. Warnings about `any` types are acceptable.

- [ ] **Step 2: If build fails, check the error output and fix before proceeding**

Common issues:
- TypeScript: `validAddress` used before declaration → check Task 8 steps were applied in order
- Missing import: `addressSchema not found` → check `lib/schemas.ts` was created in Task 2
- Middleware matcher syntax error → verify `middleware.ts` `config.matcher` array is correct

---

## Post-deploy checklist (manual, not in code)

- [ ] Rotate the exposed Firebase service account key in Firebase Console → update `FIREBASE_PRIVATE_KEY`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PROJECT_ID` in your hosting environment's secrets manager
- [ ] Rotate the Razorpay key → update `NEXT_PUBLIC_RAZORPAY_KEY_ID` and any server-side Razorpay secret
- [ ] Add `NEXT_PUBLIC_API_URL` to your production environment (currently defaults to `http://localhost:5000/api`)
- [ ] Add your production API domain to the `connect-src` CSP directive in `next.config.ts` if it differs from the hardcoded domains
