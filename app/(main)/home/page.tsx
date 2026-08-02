"use client";

import { useRouter } from "next/navigation";
import { Menu, User } from "lucide-react";
import { MockProducts } from "@/lib/data/mock-products";
import { SafeImage } from "@/components/ui/SafeImage";
import { ProductGrid } from "@/components/product/ProductGrid";
import type { ProductModel } from "@/lib/data/mock-products";

export default function HomePage() {
  const router = useRouter();
  const products = MockProducts.items;

  function handleProductTap(product: ProductModel) {
    router.push(`/product/${product.id}`);
  }

  return (
    <div className="mx-auto w-full max-w-lg lg:max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-0">
        <button
          type="button"
          onClick={() => router.push("/store")}
          className="rounded-lg p-2 hover:bg-surface"
          aria-label="Open store"
        >
          <Menu size={24} className="text-black" />
        </button>
        <div className="text-center">
          <p className="text-base font-bold">3D Game</p>
          <p className="text-[11px] text-text-secondary">Premium 3D Prints</p>
        </div>
        <button
          type="button"
          onClick={() => router.push("/orders")}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-surface"
          aria-label="Orders"
        >
          <User size={20} className="text-text-muted" />
        </button>
      </div>

      {/* Banner */}
      <div className="p-4">
        <button
          type="button"
          onClick={() => router.push("/search/results?q=Featured")}
          className="relative block h-40 w-full overflow-hidden rounded-2xl text-left"
        >
          <SafeImage src={MockProducts.bannerImage} alt="Best deals banner" fill className="object-cover brightness-[0.45]" />
          <div className="absolute inset-0 flex flex-col justify-center p-5">
            <p className="text-xs font-semibold tracking-[1.2px] text-white">BEST DEALS</p>
            <p className="mt-1.5 text-2xl font-extrabold text-white">UP TO 70% OFF</p>
            <p className="mt-1 text-[13px] text-white/80">On selected 3D prints</p>
          </div>
        </button>
      </div>

      {/* Categories */}
      <div className="h-[90px] overflow-x-auto px-4">
        <div className="flex gap-3">
          {MockProducts.categories.map(({ name, icon: Icon }) => (
            <div key={name} className="flex shrink-0 flex-col items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface shadow-[0_3px_8px_rgba(0,0,0,0.06)]">
                <Icon size={24} className="text-text-primary" />
              </div>
              <span className="mt-1.5 text-[11px] text-text-secondary">{name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="h-5" />

      {/* Flash Sales header */}
      <div className="flex items-center justify-between px-4">
        <h2 className="text-lg font-bold">Flash Sales</h2>
        <button
          type="button"
          onClick={() => router.push("/search/results?q=All+Products")}
          className="text-[13px] text-text-secondary"
        >
          See All
        </button>
      </div>

      <div className="h-3" />

      {/* Product grid */}
      <div className="px-4 pb-8">
        <ProductGrid products={products} onProductTap={handleProductTap} />
      </div>
    </div>
  );
}
