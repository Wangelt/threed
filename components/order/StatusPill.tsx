interface StatusPillProps {
  label: string;
}

export function StatusPill({ label }: StatusPillProps) {
  return (
    <span className="rounded-md bg-black px-2.5 py-1 text-[11px] font-semibold text-white">
      {label}
    </span>
  );
}
