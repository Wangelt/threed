"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MockProducts } from "@/lib/data/mock-products";
import type { ProductModel } from "@/lib/data/mock-products";
import { ProductGrid } from "@/components/product/ProductGrid";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { ShopByType } from "@/components/home/ShopByType";
import { ProductRow } from "@/components/home/ProductRow";
import { BrandStory } from "@/components/home/BrandStory";
import { motion } from "framer-motion";
import { fadeUp, viewport } from "@/lib/motion";
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
  const firstVariant = source.variants?.[0];
  return {
    id: source.slug || source._id || source.title,
    name: source.title,
    brand: "Threedus",
    price: `₹${firstVariant?.price?.toLocaleString("en-IN") || "0"}`,
    rating: source.averageRating || 0,
    reviews: source.reviewCount || 0,
    description: source.shortDesc || source.description || "",
    image: gallery[0],
    gallery,
    materials: [...new Set(source.variants?.map((variant) => variant.material).filter(Boolean) as string[])],
    colors: [...new Set(source.variants?.map((variant) => variant.color).filter(Boolean) as string[])],
  };
}

export default function HomePage() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    api.products.list({ limit: 100 })
      .then(({ products: apiProducts }) => setProducts((apiProducts as ApiProduct[]).map(toProductModel)))
      .catch(() => setProducts([]))
      .finally(() => setIsLoading(false));
  }, []);
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
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square animate-pulse rounded-[14px] bg-surface" />
            ))}
          </div>
        ) : (
          <ProductGrid products={products} onProductTap={handleProductTap} />
        )}
      </div>
    </div>
  );
}
