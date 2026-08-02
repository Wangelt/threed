interface ShippingProgressBarProps {
  currentStep: number;
  steps: string[];
}

export function ShippingProgressBar({ currentStep, steps }: ShippingProgressBarProps) {
  return (
    <div className="flex">
      {steps.map((step, i) => {
        const done = i <= currentStep;
        const active = i === currentStep;
        return (
          <div key={step} className="flex-1">
            <div className="flex items-center">
              {i > 0 && (
                <div className={`h-0.5 flex-1 ${done ? "bg-black" : "bg-border"}`} />
              )}
              <div
                className={`h-2.5 w-2.5 shrink-0 rounded-full border ${
                  done ? "bg-black border-black" : "bg-white border-border"
                } ${active ? "border-2 border-black" : ""}`}
              />
              {i < steps.length - 1 && (
                <div className={`h-0.5 flex-1 ${i < currentStep ? "bg-black" : "bg-border"}`} />
              )}
            </div>
            <p
              className={`mt-1.5 text-center text-[9px] ${
                active ? "font-semibold text-black" : "font-normal text-text-muted"
              }`}
            >
              {step}
            </p>
          </div>
        );
      })}
    </div>
  );
}
