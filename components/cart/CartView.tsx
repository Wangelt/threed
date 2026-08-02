"use client";

import { Check, Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  toggleSelected,
  incrementQuantity,
  decrementQuantity,
  selectCartTotal,
} from "@/store/slices/cartSlice";
import { ProductImage } from "@/components/product/ProductImage";

interface CartViewProps {
  showBack?: boolean;
  onBack?: () => void;
}

export function CartView({ showBack = false, onBack }: CartViewProps) {
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.cart.items);
  const total = useAppSelector(selectCartTotal);

  return (
    <div className="flex h-full flex-col bg-white">
      <header className="flex items-center justify-between border-b border-border px-2 py-3">
        {showBack ? (
          <button type="button" onClick={onBack} className="p-2 text-sm text-black">
            ← Back
          </button>
        ) : (
          <div className="w-10" />
        )}
        <h1 className="text-[17px] font-semibold text-black">My Cart</h1>
        <button type="button" className="p-2" aria-label="Delete">
          <Trash2 size={22} className="text-black" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-4">
        {items.length === 0 ? (
          <p className="py-12 text-center text-text-secondary">Your cart is empty</p>
        ) : (
          <ul className="space-y-3">
            {items.map((item, index) => (
              <li
                key={item.product.id}
                className={`flex items-center gap-3 rounded-[14px] border p-3 transition-colors duration-250 ${
                  item.selected
                    ? "border-border bg-white"
                    : "border-border/50 bg-surface"
                }`}
              >
                <button
                  type="button"
                  onClick={() => dispatch(toggleSelected(index))}
                  className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-md border transition-colors duration-200 ${
                    item.selected
                      ? "border-black bg-black"
                      : "border-border bg-white"
                  }`}
                  aria-label={item.selected ? "Deselect item" : "Select item"}
                >
                  {item.selected && <Check size={14} className="text-white" />}
                </button>

                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[10px]">
                  <ProductImage src={item.product.image} alt={item.product.name} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-[11px] text-text-secondary">{item.product.brand}</p>
                  <p className="truncate text-[13px] font-semibold">{item.product.name}</p>
                  <p className="mt-1 font-bold">{item.product.price}</p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <QtyButton
                    icon={Minus}
                    onClick={() => dispatch(decrementQuantity(index))}
                  />
                  <span className="min-w-[20px] text-center text-sm">{item.quantity}</span>
                  <QtyButton
                    icon={Plus}
                    onClick={() => dispatch(incrementQuantity(index))}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="border-t border-transparent bg-white p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <div className="mx-auto flex max-w-lg items-center gap-4 lg:max-w-5xl">
          <div className="flex-1">
            <p className="text-xs text-text-secondary">Total</p>
            <p className="text-xl font-extrabold transition-transform duration-300">
              ₹{total.toFixed(0)}
            </p>
          </div>
          <button
            type="button"
            disabled={total <= 0}
            className={`flex items-center gap-2 rounded-xl px-7 py-4 font-semibold text-white transition-colors ${
              total > 0 ? "bg-black" : "cursor-not-allowed bg-text-muted"
            }`}
          >
            Checkout
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

function QtyButton({
  icon: Icon,
  onClick,
}: {
  icon: typeof Minus;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-[26px] w-[26px] items-center justify-center rounded-md border border-border"
    >
      <Icon size={14} />
    </button>
  );
}
