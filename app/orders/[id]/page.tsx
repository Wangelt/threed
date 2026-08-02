import { notFound } from "next/navigation";
import { MockOrders } from "@/lib/data/mock-orders";
import { OrderSummaryView } from "@/components/order/OrderSummaryView";

interface OrderPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { id } = await params;
  const order = MockOrders.orders.find((o) => o.id === decodeURIComponent(id));

  if (!order) notFound();

  return <OrderSummaryView order={order} />;
}
