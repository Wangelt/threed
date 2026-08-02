"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { ProductModel } from "@/lib/data/mock-products";
import { ProductImage } from "./ProductImage";

interface ProductCardProps {
  product: ProductModel;
  onClick?: () => void;
  index?: number;
  compact?: boolean;
}

export function ProductCard({ product, onClick, index = 0, compact = false }: ProductCardProps) {
  const [pressed, setPressed] = useState(false);

  return (
    <motion.button
      type="button"
      onClick={onClick}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      initial={{ opacity: 0, y: 14, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: pressed ? 0.97 : 1 }}
      transition={{
        duration: 0.48,
        delay: (index % 8) * 0.055,
        ease: [0.33, 1, 0.68, 1],
      }}
      className={`flex w-full flex-col rounded-2xl border border-border/60 bg-white text-left shadow-[0_8px_20px_rgba(0,0,0,0.1),0_2px_6px_rgba(0,0,0,0.04)] transition-shadow ${
        compact ? "p-2" : "p-2.5"
      }`}
    >
      <div className={`relative w-full overflow-hidden rounded-xl ${compact ? "aspect-[4/5]" : "aspect-[4/5]"}`}>
        <ProductImage src={product.image} alt={product.name} />
      </div>
      <p className={`mt-2 truncate font-semibold text-text-primary ${compact ? "text-xs" : "text-[13px]"}`}>
        {product.name}
      </p>
      <p className={`font-bold text-text-primary ${compact ? "text-xs" : "text-[13px]"}`}>{product.price}</p>
    </motion.button>
  );
}
