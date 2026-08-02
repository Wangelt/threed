"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Copy } from "lucide-react";
import type { OrderModel } from "@/lib/data/mock-orders";
import { MockOrders } from "@/lib/data/mock-orders";
import { SectionCard } from "@/components/order/SectionCard";
import { ShippingProgressBar } from "@/components/order/ShippingProgressBar";
import { TrackingTimeline } from "@/components/order/TrackingTimeline";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

interface TrackPackageViewProps {
  order: OrderModel;
}

export function TrackPackageView({ order }: TrackPackageViewProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white pb-8">
      <header className="flex items-center gap-2 border-b border-border px-2 py-3">
        <button type="button" onClick={() => router.back()} className="p-2">
          <ArrowLeft size={22} />
        </button>
        <h1 className="flex-1 text-center text-[17px] font-semibold pr-10">Track Package</h1>
      </header>

      <div className="space-y-4 p-4">
        <SectionCard title="Delivery Method">
          <p className="text-sm font-medium">Standard Economy</p>
        </SectionCard>

        <SectionCard title="Tracking Code">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold tracking-wide">{order.trackingCode}</span>
            <Copy size={18} className="text-text-secondary" />
          </div>
        </SectionCard>

        <ShippingProgressBar currentStep={order.shippingStep} steps={MockOrders.shippingSteps} />

        <h2 className="text-base font-semibold">Tracking History</h2>
        <TrackingTimeline events={MockOrders.trackingEvents} />

        <PrimaryButton label="Contact Delivery" onClick={() => {}} />
      </div>
    </div>
  );
}
