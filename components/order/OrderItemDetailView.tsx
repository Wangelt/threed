"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import type { OrderModel, OrderItem } from "@/lib/data/mock-orders";
import { MockOrders, OrderStatus, orderTotal } from "@/lib/data/mock-orders";
import { ShippingProgressBar } from "@/components/order/ShippingProgressBar";
import { SectionCard } from "@/components/order/SectionCard";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SafeImage } from "@/components/ui/SafeImage";

interface OrderItemDetailViewProps {
  order: OrderModel;
  item: OrderItem;
}

function deliveryLabel(status: OrderStatus): string {
  switch (status) {
    case OrderStatus.Paid:
      return "Preparing your order";
    case OrderStatus.Shipped:
      return "Standard Economy — In Transit";
    case OrderStatus.Delivered:
      return "Delivered";
    case OrderStatus.Returned:
      return "Returned";
    case OrderStatus.Refunded:
      return "Refunded";
  }
}

export function OrderItemDetailView({ order, item }: OrderItemDetailViewProps) {
  const router = useRouter();
  const basePath = `/orders/${encodeURIComponent(order.id)}`;

  return (
    <div className="min-h-screen bg-white pb-8">
      <header className="flex items-center gap-2 border-b border-border px-2 py-3">
        <button type="button" onClick={() => router.back()} className="p-2">
          <ArrowLeft size={22} />
        </button>
        <h1 className="flex-1 text-center text-[17px] font-semibold pr-10">Item Detail</h1>
      </header>

      <div className="space-y-4 p-4">
        <div className="relative h-60 w-full overflow-hidden rounded-2xl">
          <SafeImage src={item.image} alt={item.name} fill className="object-cover" />
        </div>
        <h2 className="text-lg font-bold">{item.name}</h2>
        <p className="text-base font-bold">{item.price}</p>

        <button
          type="button"
          onClick={() => router.push(`/product/${item.productId}`)}
          className="w-full rounded-xl border border-border py-3 text-black"
        >
          View Product
        </button>

        {(order.status === OrderStatus.Shipped || order.status === OrderStatus.Delivered) && (
          <ShippingProgressBar currentStep={order.shippingStep} steps={MockOrders.shippingSteps} />
        )}

        <SectionCard title="Delivery Service">
          <p className="text-[13px] text-text-secondary">{deliveryLabel(order.status)}</p>
        </SectionCard>

        <SectionCard title="Payment Information">
          <p className="text-[13px]">
            {order.paymentMethod} ···· {order.cardLast4}
          </p>
          <p className="mt-1 text-[13px] font-semibold">Total: ₹{orderTotal(order).toFixed(0)}</p>
        </SectionCard>

        <SectionCard title="Order Information">
          <InfoRow label="Order ID" value={order.id} />
          <InfoRow label="Date" value={order.date} />
          <InfoRow label="Time" value={order.time} />
          <InfoRow label="Quantity" value={String(item.quantity)} />
        </SectionCard>

        <PrimaryButton label="Messages" onClick={() => {}} />

        {order.status === OrderStatus.Paid && (
          <button
            type="button"
            onClick={() => router.push(`${basePath}/cancel`)}
            className="w-full rounded-xl border border-border py-3.5 font-semibold"
          >
            Cancel Item
          </button>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-1.5 flex justify-between text-[13px]">
      <span className="text-text-secondary">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
