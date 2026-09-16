"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ProductModel } from "@/lib/data/mock-products";
import { SafeImage } from "@/components/ui/SafeImage";
import { ProductGrid } from "@/components/product/ProductGrid";
import { fadeUp, scaleIn, stagger } from "@/lib/motion";
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
  const variant = source.variants?.[0];
  return {
    id: source.slug || source._id || source.title,
    name: source.title,
    brand: "Threedus",
    price: `₹${variant?.price?.toLocaleString("en-IN") || "0"}`,
    rating: source.averageRating || 0,
    reviews: source.reviewCount || 0,
    description: source.shortDesc || source.description || "",
    image: gallery[0],
    gallery,
    materials: variant?.material ? [variant.material] : [],
    colors: variant?.color ? [variant.color] : [],
  };
}

export function StoreFrontTab() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductModel[]>([]);

  useEffect(() => {
    api.products.list({ sort: "popular", limit: 100 })
      .then(({ products: apiProducts }) => setProducts((apiProducts as ApiProduct[]).map(toProductModel)))
      .catch(() => setProducts([]));
  }, []);

  const featured = products[0];
  const popular = products.slice(1, 7);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="space-y-5 px-4 py-4 pb-6 sm:px-6 lg:px-8"
    >
      <motion.div
        variants={scaleIn}
        className="relative h-100 overflow-hidden rounded-2xl"
      >
        <SafeImage src="/images/banner.png" alt="Featured collection" fill className="object-cover brightness-[0.6]" />
        <div className="absolute inset-x-5 bottom-5">
          <p className="text-[11px] font-semibold tracking-[1.4px] text-white">LOREM IPSUM DOLOR</p>
          <p className="mt-1.5 text-[22px] font-extrabold text-white">Featured Collection</p>
        </div>
      </motion.div>

      {featured && <motion.button
        type="button"
        variants={fadeUp}
        onClick={() => router.push(`/product/${featured.id}`)}
        className="flex w-full items-center gap-3 rounded-[14px] border border-border/60 bg-white p-3 shadow-[0_6px_16px_rgba(0,0,0,0.08)]"
      >
        <div className="relative h-18 w-18 shrink-0 overflow-hidden rounded-[10px]">
          <SafeImage src={featured.image} alt={featured.name} fill className="object-cover" />
        </div>
        <div className="min-w-0 flex-1 text-left">
          <p className="text-[11px] text-text-secondary">Featured Product</p>
          <p className="truncate text-sm font-semibold">{featured.name}</p>
          <p className="mt-1 text-sm font-bold">{featured.price}</p>
        </div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-black">
          <Plus size={18} className="text-white" />
        </div>
      </motion.button>}

      <motion.div variants={fadeUp} className="flex items-center justify-between">
        <h2 className="text-base font-bold">Popular product</h2>
        <span className="text-[13px] text-text-secondary">{popular.length} items</span>
      </motion.div>

      <ProductGrid
        products={popular}
        onProductTap={(p) => router.push(`/product/${p.id}`)}
      />
    </motion.div>
  );
}
