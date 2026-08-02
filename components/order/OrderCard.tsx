import type { OrderModel } from "@/lib/data/mock-orders";
import { orderStatusLabel } from "@/lib/data/mock-orders";
import { StatusPill } from "./StatusPill";
import { SafeImage } from "@/components/ui/SafeImage";

interface OrderCardProps {
  order: OrderModel;
  secondaryLabel: string;
  onDetails?: () => void;
  onSecondary?: () => void;
}

export function OrderCard({ order, secondaryLabel, onDetails, onSecondary }: OrderCardProps) {
  return (
    <div className="rounded-[14px] border border-border p-3.5">
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-semibold">{order.id}</span>
        <StatusPill label={orderStatusLabel(order.status)} />
      </div>

      <div className="mt-3 space-y-2">
        {order.items.map((item) => (
          <div key={item.productId + item.name} className="flex items-center gap-2.5">
            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg">
              <SafeImage src={item.image} alt={item.name} fill className="object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium">{item.name}</p>
              <p className="text-xs font-semibold">{item.price}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-2 flex gap-2">
        <button
          type="button"
          onClick={onDetails}
          className="flex-1 rounded-[10px] border border-border py-2.5 text-[13px] text-black"
        >
          Order Details
        </button>
        <button
          type="button"
          onClick={onSecondary}
          className="flex-1 rounded-[10px] border border-border py-2.5 text-[13px] text-black"
        >
          {secondaryLabel}
        </button>
      </div>
    </div>
  );
}
