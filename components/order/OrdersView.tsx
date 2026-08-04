"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import {
  MockOrders,
  OrderStatus,
} from "@/lib/data/mock-orders";
import type { OrderModel } from "@/lib/data/mock-orders";
import { FilterChipRow } from "@/components/order/FilterChipRow";
import { OrderCard } from "@/components/order/OrderCard";
import { fadeUp, stagger } from "@/lib/motion";

const FILTERS = ["All", "Paid", "Shipped", "Delivered", "Returned"];

function filterToStatus(index: number): OrderStatus | null {
  switch (index) {
    case 1:
      return OrderStatus.Paid;
    case 2:
      return OrderStatus.Shipped;
    case 3:
      return OrderStatus.Delivered;
    case 4:
      return OrderStatus.Returned;
    default:
      return null;
  }
}

function secondaryLabel(order: OrderModel): string {
  switch (order.status) {
    case OrderStatus.Shipped:
      return "Track Package";
    case OrderStatus.Delivered:
      return "Rate Product";
    default:
      return "Messages";
  }
}

function OrdersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialFilter = Number(searchParams.get("filter") ?? 0);
  const [filter, setFilter] = useState(
    initialFilter >= 0 && initialFilter < FILTERS.length ? initialFilter : 0,
  );

  const orders = MockOrders.byStatus(filterToStatus(filter));
  const orderPath = (id: string) => `/orders/${encodeURIComponent(id)}`;

  return (
    <div className="min-h-screen bg-white">
      <motion.header
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="flex items-center gap-2 border-b border-border px-2 py-3 sm:px-4 lg:px-6"
      >
        <button type="button" onClick={() => router.back()} className="p-2">
          <ArrowLeft size={22} />
        </button>
        <h1 className="flex-1 text-center text-[17px] font-semibold pr-10">
          {filter === 0 ? "Orders" : `Orders ${FILTERS[filter]}`}
        </h1>
      </motion.header>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="mt-2 px-2 sm:px-4 lg:px-6"
      >
        <FilterChipRow
          labels={FILTERS}
          selected={filter}
          onSelected={(i) => {
            setFilter(i);
            router.replace(`/orders?filter=${i}`, { scroll: false });
          }}
        />
      </motion.div>

      <div className="px-4 py-4 sm:px-6 lg:px-8">
        {orders.length === 0 ? (
          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="py-12 text-center text-text-secondary"
          >
            No orders found
          </motion.p>
        ) : (
          <motion.div
            key={filter}
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="grid gap-3 md:grid-cols-2 xl:grid-cols-3"
          >
            {orders.map((order) => (
              <motion.div key={order.id} variants={fadeUp}>
                <OrderCard
                  order={order}
                  secondaryLabel={secondaryLabel(order)}
                  onDetails={() => router.push(orderPath(order.id))}
                  onSecondary={() => {
                    if (order.status === OrderStatus.Shipped) {
                      router.push(`${orderPath(order.id)}/track`);
                    } else if (order.status === OrderStatus.Delivered) {
                      router.push(`${orderPath(order.id)}?rate=true`);
                    }
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export function OrdersView() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <OrdersContent />
    </Suspense>
  );
}
