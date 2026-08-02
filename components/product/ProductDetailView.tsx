"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronDown, Heart, Star } from "lucide-react";
import type { ProductModel } from "@/lib/data/mock-products";
import { ProductImage } from "@/components/product/ProductImage";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { ProductVariantSheet } from "@/components/modals/ProductVariantSheet";

interface ProductDetailViewProps {
  product: ProductModel;
}

export function ProductDetailView({ product }: ProductDetailViewProps) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [variantOpen, setVariantOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Hero header */}
      <div className="sticky top-0 z-30 bg-white">
        <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-2 py-3">
          <button type="button" onClick={() => router.back()} className="rounded-full bg-white/90 p-2 shadow-sm">
            <ArrowLeft size={22} className="text-black" />
          </button>
          <button
            type="button"
            onClick={() => setLiked(!liked)}
            className="rounded-full bg-white/90 p-2 shadow-sm"
            aria-label={liked ? "Unlike" : "Like"}
          >
            <Heart size={22} className={liked ? "fill-black text-black" : "text-black"} />
          </button>
        </div>
        <button
          type="button"
          onClick={() => router.push(`/product/${product.id}/gallery`)}
          className="relative block h-80 w-full"
        >
          <ProductImage src={product.image} alt={product.name} className="h-80" />
        </button>
      </div>

      <div className="px-5 py-5">
        <h1 className="text-[22px] font-bold">{product.name}</h1>

        <div className="mt-2 flex items-center gap-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={16}
              className={i < Math.floor(product.rating) ? "fill-black text-black" : "text-border"}
            />
          ))}
          <span className="ml-1 text-[13px] text-text-secondary">
            {product.rating} ({product.reviews} reviews)
          </span>
        </div>

        <p className="mt-3 text-2xl font-extrabold">{product.price}</p>

        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="mt-5 flex w-full items-center justify-between"
        >
          <span className="text-base font-semibold">Product Details</span>
          <ChevronDown
            size={22}
            className={`transition-transform duration-250 ${expanded ? "rotate-180" : ""}`}
          />
        </button>

        {expanded && (
          <p className="mt-3 text-sm leading-[1.6] text-text-secondary">{product.description}</p>
        )}

        <div className="mt-5 flex gap-2.5 overflow-x-auto pb-1">
          {product.gallery.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => router.push(`/product/${product.id}/gallery?index=${i}`)}
              className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-[10px]"
            >
              <ProductImage src={src} alt={`${product.name} ${i + 1}`} />
            </button>
          ))}
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-transparent bg-white p-4 shadow-[0_-2px_12px_rgba(0,0,0,0.06)]">
        <div className="mx-auto max-w-lg">
          <PrimaryButton label="Add to Cart" onClick={() => setVariantOpen(true)} />
        </div>
      </div>

      <ProductVariantSheet
        product={product}
        open={variantOpen}
        onClose={() => setVariantOpen(false)}
      />
    </div>
  );
}
