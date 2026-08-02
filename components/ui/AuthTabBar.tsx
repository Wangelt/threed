"use client";

interface AuthTabBarProps {
  selectedIndex: number;
  onChange: (index: number) => void;
}

export function AuthTabBar({ selectedIndex, onChange }: AuthTabBarProps) {
  const tabs = ["Login", "Sign Up"];

  return (
    <div className="relative h-9">
      <div
        className="absolute bottom-0 h-0.5 bg-black transition-all duration-280 ease-out"
        style={{ width: "50%", left: `${selectedIndex * 50}%` }}
      />
      <div className="flex h-full">
        {tabs.map((label, index) => {
          const selected = selectedIndex === index;
          return (
            <button
              key={label}
              type="button"
              onClick={() => onChange(index)}
              className={`flex-1 pb-3.5 text-base transition-colors duration-200 ${
                selected ? "font-semibold text-text-primary" : "font-normal text-text-muted"
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
