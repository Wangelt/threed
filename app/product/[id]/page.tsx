import { notFound } from "next/navigation";
import { MockProducts } from "@/lib/data/mock-products";
import { ProductDetailView } from "@/components/product/ProductDetailView";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = MockProducts.items.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  return <ProductDetailView product={product} />;
}
