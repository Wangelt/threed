import { TrackPackageView } from "@/components/order/TrackPackageView";

interface TrackPageProps {
  params: Promise<{ id: string }>;
}

export default async function TrackPage({ params }: TrackPageProps) {
  const { id } = await params;
  return <TrackPackageView orderId={decodeURIComponent(id)} />;
}
