"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import type { OrderModel, OrderItem } from "@/lib/data/mock-orders";
import { MockOrders, OrderStatus, orderTotal } from "@/lib/data/mock-orders";
import { ShippingProgressBar } from "@/components/order/ShippingProgressBar";
import { SectionCard } from "@/components/order/SectionCard";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SafeImage } from "@/components/ui/SafeImage";
import { fadeUp, scaleIn, stagger } from "@/lib/motion";

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
      <motion.header
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="flex items-center gap-2 border-b border-border px-2 py-3"
      >
        <button type="button" onClick={() => router.back()} className="p-2">
          <ArrowLeft size={22} />
        </button>
        <h1 className="flex-1 text-center text-[17px] font-semibold pr-10">Item Detail</h1>
      </motion.header>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="space-y-4 px-4 py-4 sm:px-6 lg:px-8"
      >
        <motion.div
          variants={scaleIn}
          className="relative h-60 w-full overflow-hidden rounded-2xl"
        >
          <SafeImage src={item.image} alt={item.name} fill className="object-cover" />
        </motion.div>
        <motion.h2 variants={fadeUp} className="text-lg font-bold">
          {item.name}
        </motion.h2>
        <motion.p variants={fadeUp} className="text-base font-bold">
          {item.price}
        </motion.p>

        <motion.button
          type="button"
          variants={fadeUp}
          onClick={() => router.push(`/product/${item.productId}`)}
          className="w-full rounded-xl border border-border py-3 text-black"
        >
          View Product
        </motion.button>

        {(order.status === OrderStatus.Shipped || order.status === OrderStatus.Delivered) && (
          <motion.div variants={fadeUp}>
            <ShippingProgressBar currentStep={order.shippingStep} steps={MockOrders.shippingSteps} />
          </motion.div>
        )}

        <motion.div variants={fadeUp}>
          <SectionCard title="Delivery Service">
            <p className="text-[13px] text-text-secondary">{deliveryLabel(order.status)}</p>
          </SectionCard>
        </motion.div>

        <motion.div variants={fadeUp}>
          <SectionCard title="Payment Information">
            <p className="text-[13px]">
              {order.paymentMethod} ···· {order.cardLast4}
            </p>
            <p className="mt-1 text-[13px] font-semibold">Total: ₹{orderTotal(order).toFixed(0)}</p>
          </SectionCard>
        </motion.div>

        <motion.div variants={fadeUp}>
          <SectionCard title="Order Information">
            <InfoRow label="Order ID" value={order.id} />
            <InfoRow label="Date" value={order.date} />
            <InfoRow label="Time" value={order.time} />
            <InfoRow label="Quantity" value={String(item.quantity)} />
          </SectionCard>
        </motion.div>

        <motion.div variants={fadeUp}>
          <PrimaryButton label="Messages" onClick={() => {}} />
        </motion.div>

        {order.status === OrderStatus.Paid && (
          <motion.button
            type="button"
            variants={fadeUp}
            onClick={() => router.push(`${basePath}/cancel`)}
            className="w-full rounded-xl border border-border py-3.5 font-semibold"
          >
            Cancel Item
          </motion.button>
        )}
      </motion.div>
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
