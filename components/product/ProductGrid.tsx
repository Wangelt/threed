"use client";

import { motion } from "framer-motion";
import type { ProductModel } from "@/lib/data/mock-products";
import { ProductCard } from "./ProductCard";
import { stagger, viewport } from "@/lib/motion";

interface ProductGridProps {
  products: ProductModel[];
  onProductTap: (product: ProductModel) => void;
  className?: string;
}

export function ProductGrid({ products, onProductTap, className = "" }: ProductGridProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={stagger}
      className={`grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 ${className}`}
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onClick={() => onProductTap(product)}
        />
      ))}
    </motion.div>
  );
}
