"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, SlidersHorizontal } from "lucide-react";
import { MockProducts } from "@/lib/data/mock-products";
import type { ProductModel } from "@/lib/data/mock-products";
import { ProductGrid } from "@/components/product/ProductGrid";
import { FilterSheet } from "@/components/modals/FilterSheet";

function SearchResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const results = MockProducts.items;
  const [filterOpen, setFilterOpen] = useState(false);

  function handleProductTap(product: ProductModel) {
    router.push(`/product/${product.id}`);
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-40 flex items-center gap-2 border-b border-border bg-white px-2 py-3">
        <button type="button" onClick={() => router.back()} className="p-2">
          <ArrowLeft size={22} className="text-black" />
        </button>
        <h1 className="min-w-0 flex-1 truncate text-[15px] font-semibold">
          {results.length * 96} For &ldquo;{query}&rdquo;
        </h1>
        <button type="button" onClick={() => setFilterOpen(true)} className="p-2" aria-label="Filter">
          <SlidersHorizontal size={22} className="text-black" />
        </button>
      </header>

      <div className="mx-auto max-w-lg px-4 py-4 lg:max-w-5xl">
        <ProductGrid products={results} onProductTap={handleProductTap} />
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
