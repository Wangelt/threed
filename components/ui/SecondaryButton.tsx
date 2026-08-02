"use client";

import { ScanFace } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface SecondaryButtonProps {
  label: string;
  onClick?: () => void;
  icon?: LucideIcon;
}

export function SecondaryButton({ label, onClick, icon: Icon = ScanFace }: SecondaryButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full h-[52px] rounded-xl border border-border text-black font-medium text-[15px] flex items-center justify-center gap-2 hover:bg-surface transition-colors"
    >
      <Icon size={20} />
      {label}
    </button>
  );
}
