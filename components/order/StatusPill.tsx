type StatusVariant = "paid" | "shipped" | "delivered" | "returned" | "default";

interface StatusPillProps {
  label: string;
  variant?: StatusVariant;
}

const variantClasses: Record<StatusVariant, string> = {
  paid: "bg-black text-white",
  shipped: "bg-blue-600 text-white",
  delivered: "bg-green-600 text-white",
  returned: "bg-amber-500 text-white",
  default: "bg-black text-white",
};

export function StatusPill({ label, variant = "default" }: StatusPillProps) {
  return (
    <span className={`rounded-md px-2.5 py-1 text-[11px] font-semibold ${variantClasses[variant]}`}>
      {label}
    </span>
  );
}
