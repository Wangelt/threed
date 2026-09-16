"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, ShoppingBag, User } from "lucide-react";
import { AppLogo } from "@/components/ui/AppLogo";
import { useAppSelector } from "@/store/hooks";
import Image from "next/image";

export function SiteHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const cartCount = useAppSelector((s) =>
    s.cart.items.reduce((sum, item) => sum + item.quantity, 0),
  );
  const [query, setQuery] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  function submitSearch(e?: FormEvent) {
    e?.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      router.push("/search");
      return;
    }
    router.push(`/search/results?q=${encodeURIComponent(trimmed)}`);
    setMobileSearchOpen(false);
  }

  const cartActive = pathname === "/cart" || pathname.startsWith("/cart/");
  const profileActive = pathname === "/profile" || pathname.startsWith("/profile/");

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-white/95 backdrop-blur-sm">
      <div className="flex w-full items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/home" className="flex shrink-0 items-center gap-2.5">
         <Image
           alt="App Logo"
           src="/images/logo.png"  
           width={500}
           height={500}
           className="h-20 w-25 "
         />
        </Link>

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

        <form
          onSubmit={submitSearch}
          className="mx-auto hidden min-w-0 flex-1 max-w-2xl md:block"
        >
          <div className="flex h-11 items-center gap-2.5 rounded-xl border border-border bg-surface px-3.5 focus-within:border-black">
            <Search size={18} className="shrink-0 text-text-muted" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products"
              className="w-full bg-transparent text-sm outline-none placeholder:text-text-muted"
            />
          </div>
        </form>

        <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={() => setMobileSearchOpen((open) => !open)}
            className="rounded-lg p-2 hover:bg-surface md:hidden"
            aria-label="Search"
          >
            <Search size={22} className="text-black" />
          </button>

          <Link
            href="/cart"
            className={`relative rounded-lg p-2 hover:bg-surface ${cartActive ? "bg-surface" : ""}`}
            aria-label="Cart"
          >
            <ShoppingBag size={22} className="text-black" />
            {cartCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[10px] font-semibold text-white">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          <Link
            href="/profile"
            className={`rounded-lg p-2 hover:bg-surface ${profileActive ? "bg-surface" : ""}`}
            aria-label="Profile"
          >
            <User size={22} className="text-black" />
          </Link>
        </div>
      </div>

      {mobileSearchOpen && (
        <form onSubmit={submitSearch} className="border-t border-border/60 px-4 pb-3 pt-2 md:hidden">
          <div className="flex h-11 items-center gap-2.5 rounded-xl border border-border bg-surface px-3.5 focus-within:border-black">
            <Search size={18} className="shrink-0 text-text-muted" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products"
              autoFocus
              className="w-full bg-transparent text-sm outline-none placeholder:text-text-muted"
            />
          </div>
        </form>
      )}
    </header>
  );
}
