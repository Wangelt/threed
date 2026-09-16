"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, SlidersHorizontal } from "lucide-react";
import type { ProductModel } from "@/lib/data/mock-products";
import { ProductGrid } from "@/components/product/ProductGrid";
import { FilterSheet } from "@/components/modals/FilterSheet";
import { fadeUp } from "@/lib/motion";
import { api } from "@/lib/api";

interface ApiProduct {
  _id?: string;
  slug?: string;
  title: string;
  shortDesc?: string;
  description?: string;
  images?: string[];
  averageRating?: number;
  reviewCount?: number;
  variants?: { material?: string; color?: string; price?: number }[];
}

function toProductModel(source: ApiProduct): ProductModel {
  const gallery = source.images?.length ? source.images : ["/images/p1.jpg"];
  const firstVariant = source.variants?.[0];
  return {
    id: source.slug || source._id || source.title,
    name: source.title,
    brand: "Threedus",
    price: `₹${firstVariant?.price?.toLocaleString("en-IN") || "0"}`,
    rating: source.averageRating || 0,
    reviews: source.reviewCount || 0,
    description: source.shortDesc || source.description || "",
    image: gallery[0],
    gallery,
    materials: [...new Set(source.variants?.map((variant) => variant.material).filter(Boolean) as string[])],
    colors: [...new Set(source.variants?.map((variant) => variant.color).filter(Boolean) as string[])],
  };
}

function SearchResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const [results, setResults] = useState<ProductModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    api.products.list({ q: query || undefined, limit: 100 })
      .then(({ products }) => {
        if (active) setResults((products as ApiProduct[]).map(toProductModel));
      })
      .catch(() => {
        if (active) setResults([]);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => { active = false; };
  }, [query]);

  function handleProductTap(product: ProductModel) {
    router.push(`/product/${product.id}`);
  }

  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 lg:px-8">
      <motion.header
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="sticky top-0 z-40 flex items-center gap-2 border-b border-border bg-white py-3"
      >
        <button type="button" onClick={() => router.back()} className="p-2">
          <ArrowLeft size={22} className="text-black" />
        </button>
        <h1 className="min-w-0 flex-1 truncate text-[15px] font-semibold">
          {isLoading ? "Loading" : results.length} For &ldquo;{query}&rdquo;
        </h1>
        <button type="button" onClick={() => setFilterOpen(true)} className="p-2" aria-label="Filter">
          <SlidersHorizontal size={22} className="text-black" />
        </button>
      </motion.header>

      <div className="mx-auto w-full py-4">
        {isLoading ? (
          <p className="py-12 text-center text-text-secondary">Loading products...</p>
        ) : results.length ? (
          <ProductGrid products={results} onProductTap={handleProductTap} />
        ) : (
          <p className="py-12 text-center text-text-secondary">No products found</p>
        )}
      </div>

      <FilterSheet open={filterOpen} onClose={() => setFilterOpen(false)} />
    </div>
  );
}

export default function SearchResultsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <SearchResultsContent />
    </Suspense>
  );
}
