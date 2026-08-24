import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import type { ProductModel } from "@/lib/data/mock-products";
import { ProductDetailView } from "@/components/product/ProductDetailView";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  let apiProduct: unknown;
  try {
    ({ product: apiProduct } = await api.products.bySlug(id));
  } catch {
    notFound();
  }
  const source = apiProduct as {
    _id?: string; title: string; shortDesc?: string; description: string;
    images?: string[]; averageRating?: number; reviewCount?: number;
    variants?: { material?: string; color?: string; price?: number }[];
  };
  const firstVariant = source.variants?.[0];
  const product: ProductModel = {
    id: source._id || id, name: source.title, brand: "Threedus",
    price: firstVariant ? `₹${firstVariant.price?.toLocaleString("en-IN") || "0"}` : "₹0",
    rating: source.averageRating || 0, reviews: source.reviewCount || 0,
    description: source.shortDesc || source.description,
    image: source.images?.[0] || "/images/p1.jpg",
    gallery: source.images?.length ? source.images : ["/images/p1.jpg"],
    materials: [...new Set(source.variants?.map((variant) => variant.material).filter(Boolean) as string[])],
    colors: [...new Set(source.variants?.map((variant) => variant.color).filter(Boolean) as string[])],
  };

  if (!product) {
    notFound();
  }

  return <ProductDetailView product={product} />;
}
