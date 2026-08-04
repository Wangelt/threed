"use client";

import { motion } from "framer-motion";
import type { ProductModel } from "@/lib/data/mock-products";
import { ProductImage } from "./ProductImage";
import { scaleIn } from "@/lib/motion";

interface ProductCardProps {
  product: ProductModel;
  onClick?: () => void;
  index?: number;
  compact?: boolean;
}

export function ProductCard({ product, onClick, compact = false }: ProductCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      variants={scaleIn}
      whileTap={{ scale: 0.97 }}
      className="flex w-full flex-col bg-white text-left transition-opacity hover:opacity-95"
    >
      <div className="relative w-full overflow-hidden bg-card aspect-[4/5]">
        <ProductImage src={product.image} alt={product.name} />
      </div>
      <p
        className={`mt-2.5 truncate font-medium text-text-primary ${
          compact ? "text-xs" : "text-[13px]"
        }`}
      >
        {product.name}
      </p>
      <p
        className={`mt-0.5 font-bold text-text-primary ${
          compact ? "text-xs" : "text-[13px]"
        }`}
      >
        {product.price}
      </p>
    </motion.button>
  );
}
