"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, X, ChevronRight, TrendingUp } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import { fadeUp, scaleIn, stagger, viewport } from "@/lib/motion";
import { api } from "@/lib/api";
import type { ProductModel } from "@/lib/data/mock-products";

interface Category {
  _id?: string;
  name: string;
  slug?: string;
  icon?: React.ComponentType<any>;
}

interface TrendingProduct {
  _id?: string;
  slug?: string;
  title: string;
  images?: string[];
  variants?: { price?: number }[];
}

function toTrendingProduct(source: TrendingProduct): ProductModel {
  const variant = source.variants?.[0];
  return {
    id: source.slug || source._id || source.title,
    name: source.title,
    brand: "Threedus",
    price: `₹${variant?.price?.toLocaleString("en-IN") || "0"}`,
    rating: 0,
    reviews: 0,
    description: "",
    image: source.images?.[0] || "/images/p1.jpg",
    gallery: source.images?.length ? source.images : ["/images/p1.jpg"],
    materials: [],
    colors: [],
  };
}

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<ProductModel[]>([]);

  useEffect(() => {
    api.categories.list()
      .then((result) => setCategories(((result as { categories?: Category[] }).categories || []).slice(0, 8)))
      .catch(() => setCategories([]));
    api.products.list({ sort: "popular", limit: 8 })
      .then(({ products }) => setTrendingProducts(((products as TrendingProduct[]) || []).map(toTrendingProduct)))
      .catch(() => setTrendingProducts([]));
  }, []);

  function search(term: string) {
    const trimmed = term.trim();
    if (!trimmed) return;
    router.push(`/search/results?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <div className="flex h-full w-full flex-col px-4 sm:px-6 lg:px-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="py-4"
      >
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
      </motion.div>

      {!focused ? (
        <>
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={fadeUp}
            className="pb-3 pt-2 text-base font-semibold"
          >
            Categories
          </motion.h2>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={stagger}
            className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8"
          >
            {categories.map(({ name }) => (
              <motion.div
                key={name}
                variants={scaleIn}
                className="flex aspect-[1.1] flex-col items-center justify-center rounded-[14px] bg-surface"
              >
                <span className="text-2xl">📦</span>
                <span className="mt-1.5 text-xs font-medium">{name}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={fadeUp}
            className="mt-6 text-base font-semibold"
          >
            Trending Now
          </motion.h2>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={stagger}
            className="mt-3 flex-1 overflow-y-auto pb-4"
          >
            {trendingProducts.map((product) => (
              <motion.button
                key={product.id}
                type="button"
                variants={fadeUp}
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
              </motion.button>
            ))}
          </motion.div>
        </>
      ) : (
        <>
          <motion.h2
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="pb-3 pt-2 text-sm font-semibold"
          >
            Recent Searches
          </motion.h2>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="flex flex-wrap gap-2"
          >
            {["3D Printed Models", "Phone Cases", "Gift Bottles", "Custom Parts"].map((term) => (
              <motion.button
                key={term}
                type="button"
                variants={fadeUp}
                onClick={() => search(term)}
                className="rounded-full bg-surface px-3.5 py-2 text-[13px]"
              >
                {term}
              </motion.button>
            ))}
          </motion.div>

          <motion.h2
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mt-6 text-sm font-semibold"
          >
            Trending Search
          </motion.h2>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="mt-2 grid flex-1 grid-cols-1 gap-x-8 overflow-y-auto pb-4 md:grid-cols-2 lg:grid-cols-3"
          >
            {["Popular this week", "Bestsellers", "New arrivals", "On sale", "Customer favorites", "Trending now"].map((term) => (
              <motion.button
                key={term}
                type="button"
                variants={fadeUp}
                onClick={() => search(term)}
                className="flex w-full items-center gap-3 py-3 text-left"
              >
                <TrendingUp size={20} className="text-text-secondary" />
                <span className="text-sm">{term}</span>
              </motion.button>
            ))}
          </motion.div>
        </>
      )}
    </div>
  );
}
