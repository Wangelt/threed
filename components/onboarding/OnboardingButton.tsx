interface OnboardingButtonProps {
  isLast: boolean;
  onClick: () => void;
}

export function OnboardingButton({ isLast, onClick }: OnboardingButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full h-12 rounded-xl font-medium text-lg transition-all duration-300 shadow-[0_5px_10px_rgba(0,0,0,0.25)] ${
        isLast
          ? "bg-black text-white"
          : "bg-white text-black border border-black"
      }`}
    >
      {isLast ? "Get Started" : "Next"}
    </button>
  );
}
