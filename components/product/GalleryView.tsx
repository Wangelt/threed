"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import type { ProductModel } from "@/lib/data/mock-products";
import { AppColors } from "@/lib/colors";
import { SafeImage } from "@/components/ui/SafeImage";

interface GalleryViewProps {
  product: ProductModel;
}

function GalleryContent({ product }: GalleryViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialIndex = Math.min(
    Math.max(Number(searchParams.get("index") ?? 0), 0),
    product.gallery.length - 1,
  );
  const [index, setIndex] = useState(initialIndex);
  const gallery = product.gallery;

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <header className="flex items-center gap-2 px-2 py-3">
        <button type="button" onClick={() => router.back()} className="p-2">
          <X size={22} className="text-white" />
        </button>
        <h1 className="flex-1 text-center text-[15px] text-white pr-10">
          {index + 1} / {gallery.length}
        </h1>
      </header>

      <div className="relative min-h-[60vh] flex-1">
        <SafeImage
          src={gallery[index]}
          alt={`${product.name} ${index + 1}`}
          fill
          className="object-contain"
        />
      </div>

      <div className="flex justify-center gap-2 p-4">
        {gallery.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setIndex(i)}
            className="relative overflow-hidden rounded-lg transition-all duration-250"
            style={{
              width: index === i ? 48 : 40,
              height: 40,
              border: `2px solid ${index === i ? AppColors.white : AppColors.greyMid}`,
            }}
          >
            <SafeImage src={src} alt="" fill className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

export function GalleryView({ product }: GalleryViewProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <GalleryContent product={product} />
    </Suspense>
  );
}
