import { notFound } from "next/navigation";
import { MockProducts } from "@/lib/data/mock-products";
import { GalleryView } from "@/components/product/GalleryView";

interface GalleryPageProps {
  params: Promise<{ id: string }>;
}

export default async function GalleryPage({ params }: GalleryPageProps) {
  const { id } = await params;
  const product = MockProducts.items.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  return <GalleryView product={product} />;
}
