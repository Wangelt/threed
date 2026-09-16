"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Copy } from "lucide-react";
import type { OrderModel } from "@/lib/data/mock-orders";
import { MockOrders } from "@/lib/data/mock-orders";
import { SectionCard } from "@/components/order/SectionCard";
import { ShippingProgressBar } from "@/components/order/ShippingProgressBar";
import { TrackingTimeline } from "@/components/order/TrackingTimeline";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { fadeUp, stagger } from "@/lib/motion";
import { api } from "@/lib/api";
import { toOrderModel } from "@/lib/order-model";

interface TrackPackageViewProps {
  order?: OrderModel;
  orderId?: string;
}

export function TrackPackageView({ order: initialOrder, orderId }: TrackPackageViewProps) {
  const router = useRouter();
  const [order, setOrder] = useState(initialOrder);

  useEffect(() => {
    if (!initialOrder && orderId) {
      api.orders.byId(orderId).then((result) => {
        setOrder(toOrderModel((result as { order: Parameters<typeof toOrderModel>[0] }).order));
      }).catch(() => router.replace("/orders"));
    }
  }, [initialOrder, orderId, router]);

  if (!order) return <div className="min-h-screen bg-white" />;

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
        <h1 className="flex-1 text-center text-[17px] font-semibold pr-10">Track Package</h1>
      </motion.header>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="space-y-4 px-4 py-4 sm:px-6 lg:px-8"
      >
        <motion.div variants={fadeUp}>
          <SectionCard title="Delivery Method">
            <p className="text-sm font-medium">Standard Economy</p>
          </SectionCard>
        </motion.div>

        <motion.div variants={fadeUp}>
          <SectionCard title="Tracking Code">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold tracking-wide">{order.trackingCode}</span>
              <Copy size={18} className="text-text-secondary" />
            </div>
          </SectionCard>
        </motion.div>

        <motion.div variants={fadeUp}>
          <ShippingProgressBar currentStep={order.shippingStep} steps={MockOrders.shippingSteps} />
        </motion.div>

        <motion.h2 variants={fadeUp} className="text-base font-semibold">
          Tracking History
        </motion.h2>
        <motion.div variants={fadeUp}>
          <TrackingTimeline events={MockOrders.trackingEvents} />
        </motion.div>

        <motion.div variants={fadeUp}>
          <PrimaryButton label="Contact Delivery" onClick={() => {}} />
        </motion.div>
      </motion.div>
    </div>
  );
}
