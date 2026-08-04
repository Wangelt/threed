"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { ProductModel } from "@/lib/data/mock-products";
import { ProductCard } from "@/components/product/ProductCard";
import { fadeUp, stagger, viewport } from "@/lib/motion";

interface ProductRowProps {
  title: string;
  products: ProductModel[];
  seeAllHref?: string;
}

export function ProductRow({
  title,
  products,
  seeAllHref = "/search/results?q=All+Products",
}: ProductRowProps) {
  const router = useRouter();

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={stagger}
      className="mt-10"
    >
      <div className="flex items-end justify-between gap-3">
        <motion.h2 variants={fadeUp} className="text-lg font-bold sm:text-xl">
          {title}
        </motion.h2>
        <button
          type="button"
          onClick={() => router.push(seeAllHref)}
          className="text-[13px] text-text-secondary hover:text-black"
        >
          See All
        </button>
      </div>
      <div className="mt-4 flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {products.map((product) => (
          <div key={product.id} className="w-[148px] shrink-0 sm:w-[168px]">
            <ProductCard
              product={product}
              compact
              onClick={() => router.push(`/product/${product.id}`)}
            />
          </div>
        ))}
      </div>
    </motion.section>
  );
}
