"use client";

interface NumericKeypadProps {
  onKeyTap: (key: string) => void;
  onBackspace: () => void;
}

const rows = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["", "0", "⌫"],
];

export function NumericKeypad({ onKeyTap, onBackspace }: NumericKeypadProps) {
  return (
    <div className="bg-surface px-2 pt-2 pb-4">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="mb-1.5 flex">
          {row.map((key, keyIndex) => {
            if (key === "") {
              return <div key={keyIndex} className="flex-1" />;
            }
            const isBackspace = key === "⌫";
            return (
              <div key={keyIndex} className="flex-1 px-1">
                <button
                  type="button"
                  onClick={() => (isBackspace ? onBackspace() : onKeyTap(key))}
                  className="h-12 w-full rounded-lg bg-white text-text-primary font-medium transition-colors active:bg-surface"
                  style={{ fontSize: isBackspace ? 20 : 24 }}
                >
                  {key}
                </button>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
