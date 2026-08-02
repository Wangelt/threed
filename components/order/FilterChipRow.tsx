interface FilterChipRowProps {
  labels: string[];
  selected: number;
  onSelected: (index: number) => void;
}

export function FilterChipRow({ labels, selected, onSelected }: FilterChipRowProps) {
  return (
    <div className="overflow-x-auto px-4">
      <div className="flex gap-2">
        {labels.map((label, i) => {
          const active = selected === i;
          return (
            <button
              key={label}
              type="button"
              onClick={() => onSelected(i)}
              className={`shrink-0 rounded-full border px-4 py-2 text-[13px] font-medium transition-colors duration-200 ${
                active
                  ? "border-black bg-black text-white"
                  : "border-border bg-surface text-text-primary"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
