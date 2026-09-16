import { OrderSummaryView } from "@/components/order/OrderSummaryView";

interface OrderPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { id } = await params;
  return <OrderSummaryView orderId={decodeURIComponent(id)} />;
}
