"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { MockProducts } from "@/lib/data/mock-products";
import { MockStore } from "@/lib/data/mock-store";
import { SafeImage } from "@/components/ui/SafeImage";
import { fadeUp, scaleIn, stagger, viewport } from "@/lib/motion";

export function StoreProductsTab() {
  const router = useRouter();
  const hero = MockProducts.byId(MockStore.heroProductId);
  const products = MockProducts.items;

  return (
    <div className="space-y-5 px-4 py-4 pb-6 sm:px-6 lg:px-8">
      <motion.button
        type="button"
        initial="hidden"
        animate="visible"
        variants={scaleIn}
        onClick={() => router.push(`/product/${hero.id}`)}
        className="relative block h-[210px] w-full overflow-hidden rounded-2xl text-left"
      >
        <SafeImage src={hero.image} alt={hero.name} fill className="object-cover" />
        <div className="absolute inset-0 bg-black/28" />
        <div className="absolute inset-x-4 bottom-4">
          <p className="text-[11px] font-semibold tracking-[1.2px] text-white">FEATURED</p>
          <p className="mt-1 text-lg font-extrabold text-white">{hero.name.toUpperCase()}</p>
          <p className="text-sm font-semibold text-white/90">{hero.price}</p>
        </div>
      </motion.button>

      <motion.h2
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="text-base font-bold"
      >
        All Products ({products.length})
      </motion.h2>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={stagger}
        className="space-y-3"
      >
        {products.map((p) => (
          <motion.button
            key={p.id}
            type="button"
            variants={scaleIn}
            onClick={() => router.push(`/product/${p.id}`)}
            className="flex w-full items-center gap-3 rounded-[14px] border border-border/60 bg-white p-3 shadow-[0_5px_14px_rgba(0,0,0,0.08)]"
          >
            <div className="relative h-[68px] w-[68px] shrink-0 overflow-hidden rounded-[10px]">
              <SafeImage src={p.image} alt={p.name} fill className="object-cover" />
            </div>
            <div className="min-w-0 flex-1 text-left">
              <p className="truncate text-sm font-semibold">{p.name}</p>
              <p className="mt-1 text-xs text-text-secondary">{p.brand}</p>
              <p className="mt-1.5 text-sm font-bold">{p.price}</p>
            </div>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-black shadow-[0_3px_6px_rgba(0,0,0,0.2)]">
              <Plus size={18} className="text-white" />
            </div>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
