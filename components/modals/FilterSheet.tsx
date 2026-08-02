"use client";

import { useState } from "react";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { BottomSheet } from "@/components/modals/BottomSheet";
import { AppColors } from "@/lib/colors";

interface FilterSheetProps {
  open: boolean;
  onClose: () => void;
}

const MATERIALS = ["PLA", "ABS", "Resin", "PETG"];
const MODELS = ["Mechanical", "Lattice", "Miniature", "Functional"];

export function FilterSheet({ open, onClose }: FilterSheetProps) {
  const [priceRange, setPriceRange] = useState(5000);
  const [selectedMaterial, setSelectedMaterial] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);

  function handleReset() {
    setPriceRange(5000);
    setSelectedMaterial(0);
    setSelectedColor(0);
    onClose();
  }

  return (
    <BottomSheet open={open} onClose={onClose} maxHeight="95vh">
      <BottomSheet.Handle />
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <h2 className="text-xl font-bold">Filter</h2>
        <button type="button" onClick={handleReset} className="text-sm text-black">
          Reset
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-4">
        <SectionTitle title="Model" />
        <div className="flex flex-wrap gap-2">
          {MODELS.map((label) => (
            <span
              key={label}
              className="rounded-full bg-surface px-4 py-2.5 text-[13px] text-text-primary"
            >
              {label}
            </span>
          ))}
        </div>

        <div className="h-6" />
        <SectionTitle title="Material" />
        <div className="flex flex-wrap gap-2">
          {MATERIALS.map((material, i) => (
            <button
              key={material}
              type="button"
              onClick={() => setSelectedMaterial(i)}
              className={`rounded-full px-4 py-2.5 text-[13px] transition-colors duration-200 ${
                selectedMaterial === i
                  ? "bg-black text-white"
                  : "bg-surface text-text-primary"
              }`}
            >
              {material}
            </button>
          ))}
        </div>

        <div className="h-6" />
        <SectionTitle title="Color" />
        <div className="flex gap-3">
          {AppColors.swatches.map((swatch, i) => (
            <button
              key={swatch}
              type="button"
              onClick={() => setSelectedColor(i)}
              className="h-9 w-9 shrink-0 rounded-full transition-all duration-200"
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

        <div className="h-6" />
        <SectionTitle title="Price Range" />
        <p className="text-sm font-semibold">Up to ₹{Math.round(priceRange)}</p>
        <input
          type="range"
          min={500}
          max={10000}
          step={100}
          value={priceRange}
          onChange={(e) => setPriceRange(Number(e.target.value))}
          className="mt-2 w-full accent-black"
        />
        <div className="h-20" />
      </div>

      <div className="border-t border-border p-5">
        <PrimaryButton label="Apply" onClick={onClose} />
      </div>
    </BottomSheet>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <h3 className="mb-3 text-[15px] font-semibold">{title}</h3>;
}
