import { notFound } from "next/navigation";
import { MockOrders } from "@/lib/data/mock-orders";
import { TrackPackageView } from "@/components/order/TrackPackageView";

interface TrackPageProps {
  params: Promise<{ id: string }>;
}

export default async function TrackPage({ params }: TrackPageProps) {
  const { id } = await params;
  const order = MockOrders.orders.find((o) => o.id === decodeURIComponent(id));
  if (!order) notFound();

  return <TrackPackageView order={order} />;
}
