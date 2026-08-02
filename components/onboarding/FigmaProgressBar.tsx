interface FigmaProgressBarProps {
  total: number;
  current: number;
}

export function FigmaProgressBar({ total, current }: FigmaProgressBarProps) {
  return (
    <div className="flex h-2 w-full">
      {Array.from({ length: total }).map((_, i) => {
        const isActive = i <= current;
        return (
          <div
            key={i}
            className="h-2 transition-all duration-350 ease-out"
            style={{
              flex: isActive ? 280 : 95,
              background: isActive
                ? "linear-gradient(to right, #000000, #E5E5E5)"
                : "rgba(92, 118, 255, 0.274)",
              boxShadow: isActive ? "0 4px 16px rgba(85, 128, 251, 0.5)" : undefined,
            }}
          />
        );
      })}
    </div>
  );
}
