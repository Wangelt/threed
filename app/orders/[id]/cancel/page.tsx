import { notFound } from "next/navigation";
import { MockOrders } from "@/lib/data/mock-orders";
import { ReasonSelectView } from "@/components/order/ReasonSelectView";

interface CancelPageProps {
  params: Promise<{ id: string }>;
}

export default async function CancelOrderPage({ params }: CancelPageProps) {
  const { id } = await params;
  const order = MockOrders.orders.find((o) => o.id === decodeURIComponent(id));
  if (!order) notFound();

  return (
    <ReasonSelectView
      title="Cancel Order"
      subtitle="Please tell us why you want to cancel."
      reasons={MockOrders.cancelReasons}
      successMessage={`Order ${order.id} cancelled`}
    />
  );
}
