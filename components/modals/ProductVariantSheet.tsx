"use client";

import { useEffect, useState } from "react";
import { Minus, Plus } from "lucide-react";
import type { ProductModel } from "@/lib/data/mock-products";
import { AppColors } from "@/lib/colors";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { BottomSheet } from "@/components/modals/BottomSheet";
import { ProductImage } from "@/components/product/ProductImage";
import { useAppDispatch } from "@/store/hooks";
import { addItem } from "@/store/slices/cartSlice";

interface ProductVariantSheetProps {
  product: ProductModel;
  open: boolean;
  onClose: () => void;
}

export function ProductVariantSheet({ product, open, onClose }: ProductVariantSheetProps) {
  const dispatch = useAppDispatch();
  const [selectedMaterial, setSelectedMaterial] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(1);

  function handleAddToCart() {
    dispatch(addItem({ product, quantity }));
    setQuantity(1);
    onClose();
  }

  useEffect(() => {
    if (open) {
      setSelectedMaterial(0);
      setSelectedColor(0);
      setQuantity(1);
    }
  }, [open, product.id]);

  return (
    <BottomSheet open={open} onClose={onClose} maxHeight="75vh">
      <BottomSheet.Handle />
      <div className="overflow-y-auto px-5 pb-6">
        <div className="h-4" />
        <div className="flex gap-3.5">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
            <ProductImage src={product.image} alt={product.name} />
          </div>
          <div>
            <p className="text-base font-semibold">{product.name}</p>
            <p className="mt-1 text-lg font-bold">{product.price}</p>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm font-semibold">Material</p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {product.materials.map((material, i) => (
              <button
                key={material}
                type="button"
                onClick={() => setSelectedMaterial(i)}
                className={`rounded-full px-4 py-2.5 text-[13px] transition-colors duration-200 ${
                  selectedMaterial === i ? "bg-black text-white" : "bg-surface text-text-primary"
                }`}
              >
                {material}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <p className="text-sm font-semibold">Color</p>
          <div className="mt-2.5 flex gap-3">
            {AppColors.swatches.map((swatch, i) => (
              <button
                key={swatch}
                type="button"
                onClick={() => setSelectedColor(i)}
                className="h-10 w-10 shrink-0 rounded-full transition-all duration-200"
                style={{
                  backgroundColor: swatch,
                  border: `${selectedColor === i ? 2.5 : 1}px solid ${
                    selectedColor === i ? AppColors.black : AppColors.border
                  }`,
                }}
                aria-label={`Color ${i + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm font-semibold">Quantity</p>
          <div className="flex items-center gap-4">
            <QtyButton
              icon={Minus}
              onClick={() => quantity > 1 && setQuantity((q) => q - 1)}
            />
            <span className="text-base font-semibold">{quantity}</span>
            <QtyButton icon={Plus} onClick={() => setQuantity((q) => q + 1)} />
          </div>
        </div>

        <div className="mt-6">
          <PrimaryButton label="Add to Cart" onClick={handleAddToCart} />
        </div>
      </div>
    </BottomSheet>
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
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-border"
    >
      <Icon size={16} />
    </button>
  );
}
