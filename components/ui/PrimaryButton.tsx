"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";

interface PrimaryButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  icon?: LucideIcon;
  height?: number;
  className?: string;
}

export function PrimaryButton({
  label,
  onClick,
  disabled = false,
  icon: Icon,
  height = 52,
  className = "",
}: PrimaryButtonProps) {
  const [pressed, setPressed] = useState(false);
  const enabled = !disabled && !!onClick;

  return (
    <button
      type="button"
      disabled={!enabled}
      onClick={onClick}
      onMouseDown={() => enabled && setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      style={{ height }}
      className={`w-full rounded-xl font-semibold text-base text-white transition-all duration-200 flex items-center justify-center gap-2 ${
        enabled ? "bg-black cursor-pointer" : "bg-text-muted cursor-not-allowed"
      } ${pressed && enabled ? "scale-[0.96]" : "scale-100"} ${className}`}
    >
      {Icon && <Icon size={20} />}
      {label}
    </button>
  );
}
