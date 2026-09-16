import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import type { ProductModel } from "@/lib/data/mock-products";
import { GalleryView } from "@/components/product/GalleryView";

interface GalleryPageProps {
  params: Promise<{ id: string }>;
}

export default async function GalleryPage({ params }: GalleryPageProps) {
  const { id } = await params;
  let source: { _id?: string; slug?: string; title: string; images?: string[]; variants?: { material?: string; color?: string; price?: number }[] };
  try {
    const result = await api.products.bySlug(id) as { product: typeof source };
    source = result.product;
  } catch {
    notFound();
  }
  const gallery = source.images?.length ? source.images : ["/images/p1.jpg"];
  const variant = source.variants?.[0];
  const product: ProductModel = {
    id: source.slug || id,
    name: source.title,
    brand: "Threedus",
    price: `₹${variant?.price?.toLocaleString("en-IN") || "0"}`,
    rating: 0,
    reviews: 0,
    description: "",
    image: gallery[0],
    gallery,
    materials: variant?.material ? [variant.material] : [],
    colors: variant?.color ? [variant.color] : [],
  };

  return <GalleryView product={product} />;
}
