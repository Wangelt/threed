"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X, ChevronRight, TrendingUp } from "lucide-react";
import { MockProducts } from "@/lib/data/mock-products";
import { SafeImage } from "@/components/ui/SafeImage";

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  function search(term: string) {
    const trimmed = term.trim();
    if (!trimmed) return;
    router.push(`/search/results?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <div className="mx-auto flex h-full max-w-lg flex-col lg:max-w-5xl">
      <div className="p-4">
        <div
          className={`flex h-12 items-center gap-2.5 rounded-xl bg-surface px-3.5 transition-all duration-250 ${
            focused ? "border-[1.4px] border-black" : "border border-transparent"
          }`}
        >
          <Search size={20} className="shrink-0 text-text-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={(e) => e.key === "Enter" && search(query)}
            placeholder="Search a Product"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-text-muted"
          />
          {query && (
            <button type="button" onClick={() => setQuery("")} aria-label="Clear search">
              <X size={18} className="text-text-muted" />
            </button>
          )}
        </div>
      </div>

      {!focused ? (
        <>
          <h2 className="px-4 pb-3 pt-2 text-base font-semibold">Categories</h2>
          <div className="grid grid-cols-3 gap-3 px-4 sm:grid-cols-4 md:grid-cols-6">
            {MockProducts.categories.map(({ name, icon: Icon }) => (
              <div
                key={name}
                className="flex aspect-[1.1] flex-col items-center justify-center rounded-[14px] bg-surface"
              >
                <Icon size={28} className="text-text-primary" />
                <span className="mt-1.5 text-xs font-medium">{name}</span>
              </div>
            ))}
          </div>

          <h2 className="mt-6 px-4 text-base font-semibold">Trending Now</h2>
          <div className="mt-3 flex-1 overflow-y-auto px-4 pb-4">
            {MockProducts.items.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => search(product.name)}
                className="flex w-full items-center gap-3 py-3 text-left"
              >
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-[10px]">
                  <SafeImage src={product.image} alt={product.name} fill className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{product.name}</p>
                  <p className="text-[13px] font-semibold">{product.price}</p>
                </div>
                <ChevronRight size={18} className="shrink-0 text-text-muted" />
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <h2 className="px-4 pb-3 pt-2 text-sm font-semibold">Recent Searches</h2>
          <div className="flex flex-wrap gap-2 px-4">
            {MockProducts.recentSearches.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => search(term)}
                className="rounded-full bg-surface px-3.5 py-2 text-[13px]"
              >
                {term}
              </button>
            ))}
          </div>

          <h2 className="mt-6 px-4 text-sm font-semibold">Trending Search</h2>
          <div className="mt-2 flex-1 overflow-y-auto px-4 pb-4">
            {MockProducts.trendingSearches.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => search(term)}
                className="flex w-full items-center gap-3 py-3 text-left"
              >
                <TrendingUp size={20} className="text-text-secondary" />
                <span className="text-sm">{term}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
