"use client";

import { useRouter } from "next/navigation";
import { MockProducts } from "@/lib/data/mock-products";
import { ProductGrid } from "@/components/product/ProductGrid";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { ShopByType } from "@/components/home/ShopByType";
import { ProductRow } from "@/components/home/ProductRow";
import { BrandStory } from "@/components/home/BrandStory";
import type { ProductModel } from "@/lib/data/mock-products";
import { motion } from "framer-motion";
import { fadeUp, viewport } from "@/lib/motion";

export default function HomePage() {
  const router = useRouter();
  const products = MockProducts.items;
  const arrivals = products.slice(0, 8);

  function handleProductTap(product: ProductModel) {
    router.push(`/product/${product.id}`);
  }

  return (
    <div className="w-full px-4 pb-12 sm:px-6 lg:px-8">
      <HeroCarousel slides={MockProducts.heroSlides} />
      <ShopByType categories={MockProducts.categories} />
      <ProductRow title="New Arrivals" products={arrivals} />
      <BrandStory />

      <div className="mt-10 flex items-center justify-between">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={fadeUp}
          className="text-lg font-bold sm:text-xl"
        >
          All Products
        </motion.h2>
        <button
          type="button"
          onClick={() => router.push("/search/results?q=All+Products")}
          className="text-[13px] text-text-secondary hover:text-black"
        >
          See All
        </button>
      </div>

      <div className="mt-4">
        <ProductGrid products={products} onProductTap={handleProductTap} />
      </div>
    </div>
  );
}
