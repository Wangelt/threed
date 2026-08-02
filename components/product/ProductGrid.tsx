"use client";

import type { ProductModel } from "@/lib/data/mock-products";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: ProductModel[];
  onProductTap: (product: ProductModel) => void;
  className?: string;
}

export function ProductGrid({ products, onProductTap, className = "" }: ProductGridProps) {
  return (
    <div
      className={`grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 ${className}`}
    >
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          index={index}
          onClick={() => onProductTap(product)}
        />
      ))}
    </div>
  );
}
