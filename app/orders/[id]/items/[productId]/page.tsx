import { notFound } from "next/navigation";
import { MockOrders } from "@/lib/data/mock-orders";
import { OrderItemDetailView } from "@/components/order/OrderItemDetailView";

interface OrderItemPageProps {
  params: Promise<{ id: string; productId: string }>;
}

export default async function OrderItemPage({ params }: OrderItemPageProps) {
  const { id, productId } = await params;
  const order = MockOrders.orders.find((o) => o.id === decodeURIComponent(id));
  if (!order) notFound();

  const item = order.items.find((i) => i.productId === productId);
  if (!item) notFound();

  return <OrderItemDetailView order={order} item={item} />;
}
