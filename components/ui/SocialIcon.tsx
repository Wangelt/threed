interface SocialIconProps {
  label: string;
}

export function SocialIcon({ label }: SocialIconProps) {
  return (
    <div className="w-[52px] h-[52px] rounded-xl border border-border flex items-center justify-center text-lg font-bold text-black">
      {label}
    </div>
  );
}
