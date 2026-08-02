import { notFound } from "next/navigation";
import { MockOrders } from "@/lib/data/mock-orders";
import { ReasonSelectView } from "@/components/order/ReasonSelectView";

interface RefundPageProps {
  params: Promise<{ id: string }>;
}

export default async function RefundPage({ params }: RefundPageProps) {
  const { id } = await params;
  const order = MockOrders.orders.find((o) => o.id === decodeURIComponent(id));
  if (!order) notFound();

  return (
    <ReasonSelectView
      title="Refund Reasons"
      reasons={MockOrders.refundReasons}
      successMessage="Refund request submitted"
    />
  );
}
