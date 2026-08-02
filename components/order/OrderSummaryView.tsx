"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, CreditCard, Star } from "lucide-react";
import type { OrderModel } from "@/lib/data/mock-orders";
import { MockOrders, OrderStatus, orderStatusLabel, orderTotal } from "@/lib/data/mock-orders";
import { StatusPill } from "@/components/order/StatusPill";
import { ShippingProgressBar } from "@/components/order/ShippingProgressBar";
import { SectionCard } from "@/components/order/SectionCard";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SafeImage } from "@/components/ui/SafeImage";

interface OrderSummaryViewProps {
  order: OrderModel;
}

function OrderSummaryContent({ order }: OrderSummaryViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const showRate = searchParams.get("rate") === "true";
  const [rating, setRating] = useState(0);
  const basePath = `/orders/${encodeURIComponent(order.id)}`;

  useEffect(() => {
    if (searchParams.get("track") === "true") {
      router.replace(`${basePath}/track`);
    }
  }, [searchParams, router, basePath]);

  return (
    <div className="min-h-screen bg-white pb-8">
      <header className="flex items-center gap-2 border-b border-border px-2 py-3">
        <button type="button" onClick={() => router.back()} className="p-2">
          <ArrowLeft size={22} />
        </button>
        <h1 className="flex-1 text-center text-[17px] font-semibold pr-10">Orders Summary</h1>
      </header>

      <div className="space-y-4 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">{order.id}</span>
          <StatusPill label={orderStatusLabel(order.status)} />
        </div>
        <p className="text-xs text-text-secondary">
          {order.date} · {order.time}
        </p>

        {order.items.length > 0 && (
          <div className="flex gap-3 overflow-x-auto pb-1">
            {order.items.map((item) => (
              <button
                key={item.productId}
                type="button"
                onClick={() => router.push(`${basePath}/items/${item.productId}`)}
                className="relative h-40 w-40 shrink-0 overflow-hidden rounded-[14px]"
              >
                <SafeImage src={item.image} alt={item.name} fill className="object-cover" />
              </button>
            ))}
          </div>
        )}

        {order.items.map((item) => (
          <button
            key={item.productId}
            type="button"
            onClick={() => router.push(`${basePath}/items/${item.productId}`)}
            className="flex w-full items-center gap-3 rounded-xl border border-border p-3 text-left"
          >
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
              <SafeImage src={item.image} alt={item.name} fill className="object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{item.name}</p>
              <p className="text-xs text-text-secondary">Qty: {item.quantity}</p>
            </div>
            <span className="font-bold">{item.price}</span>
          </button>
        ))}

        {(order.status === OrderStatus.Shipped || order.status === OrderStatus.Delivered) && (
          <>
            <ShippingProgressBar currentStep={order.shippingStep} steps={MockOrders.shippingSteps} />
            <PrimaryButton label="Track Package" onClick={() => router.push(`${basePath}/track`)} />
          </>
        )}

        {(order.status === OrderStatus.Delivered || showRate) && (
          <SectionCard title="Rate Product">
            <div className="flex justify-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <button key={i} type="button" onClick={() => setRating(i + 1)}>
                  <Star
                    size={32}
                    className={i < rating ? "fill-black text-black" : "text-border"}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="mt-2 text-center text-[13px] text-text-secondary">
                You rated {rating} / 5
              </p>
            )}
          </SectionCard>
        )}

        <SectionCard title="Payment Information">
          <div className="flex items-center gap-2">
            <CreditCard size={20} />
            <span className="text-sm">
              {order.paymentMethod} ···· {order.cardLast4}
            </span>
          </div>
          <div className="mt-3 space-y-1.5 text-[13px]">
            <Row label="Subtotal" value={`₹${order.subtotal.toFixed(0)}`} />
            <Row label="Tax" value={`₹${order.tax.toFixed(0)}`} />
            <Row label="Shipping Fee" value={`₹${order.shipping.toFixed(0)}`} />
            <div className="my-2 h-px bg-border" />
            <Row label="Total" value={`₹${orderTotal(order).toFixed(0)}`} bold />
          </div>
        </SectionCard>

        <SectionCard title="Shipping Address">
          <p className="whitespace-pre-line text-[13px] leading-[1.5] text-text-secondary">
            {order.shippingAddress}
          </p>
        </SectionCard>

        <SectionCard title="Billing Address">
          <p className="whitespace-pre-line text-[13px] leading-[1.5] text-text-secondary">
            {order.billingAddress}
          </p>
        </SectionCard>

        {order.status === OrderStatus.Paid && (
          <PrimaryButton label="Cancel Order" onClick={() => router.push(`${basePath}/cancel`)} />
        )}
        {order.status === OrderStatus.Delivered && (
          <PrimaryButton label="Request Refund" onClick={() => router.push(`${basePath}/refund`)} />
        )}
        {order.status === OrderStatus.Returned && (
          <button type="button" className="w-full rounded-xl border border-border py-3.5 font-semibold">
            Messages
          </button>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, bold = false }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className={bold ? "font-bold text-text-primary" : "text-text-secondary"}>{label}</span>
      <span className={bold ? "font-bold" : "font-medium"}>{value}</span>
    </div>
  );
}

export function OrderSummaryView({ order }: OrderSummaryViewProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <OrderSummaryContent order={order} />
    </Suspense>
  );
}
