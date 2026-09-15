"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";
import type { ProductModel } from "@/lib/data/mock-products";
import { ProductGrid } from "@/components/product/ProductGrid";

interface WishlistProduct {
  _id?: string;
  slug?: string;
  title: string;
  shortDesc?: string;
  images?: string[];
  averageRating?: number;
  reviewCount?: number;
  variants?: { material?: string; color?: string; price?: number }[];
}

function toProductModel(source: WishlistProduct): ProductModel {
  const gallery = source.images?.length ? source.images : ["/images/p1.jpg"];
  const variant = source.variants?.[0];
  return {
    id: source.slug || source._id || source.title,
    name: source.title,
    brand: "Threedus",
    price: `₹${variant?.price?.toLocaleString("en-IN") || "0"}`,
    rating: source.averageRating || 0,
    reviews: source.reviewCount || 0,
    description: source.shortDesc || "",
    image: gallery[0],
    gallery,
    materials: variant?.material ? [variant.material] : [],
    colors: variant?.color ? [variant.color] : [],
  };
}

export default function WishlistPage() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.wishlist.get()
      .then((result) => setProducts(((result as { products?: WishlistProduct[] }).products || []).map(toProductModel)))
      .catch(() => setProducts([]))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 lg:px-8">
      <header className="flex items-center gap-2 border-b border-border py-3">
        <button type="button" onClick={() => router.back()} className="p-2" aria-label="Back">
          <ArrowLeft size={22} />
        </button>
        <h1 className="flex-1 text-center pr-10 text-[17px] font-semibold">Wishlist</h1>
      </header>
      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 py-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-square animate-pulse rounded-[14px] bg-surface" />
          ))}
        </div>
      ) : products.length ? (
        <div className="py-4">
          <ProductGrid products={products} onProductTap={(product) => router.push(`/product/${product.id}`)} />
        </div>
      ) : (
        <p className="py-12 text-center text-text-secondary">Your wishlist is empty</p>
      )}
    </div>
  );
}