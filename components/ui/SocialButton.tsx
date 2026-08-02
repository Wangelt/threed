import type { LucideIcon } from "lucide-react";

interface SocialButtonProps {
  icon: LucideIcon;
}

export function SocialButton({ icon: Icon }: SocialButtonProps) {
  return (
    <div className="w-[52px] h-[52px] rounded-xl border border-border flex items-center justify-center">
      <Icon size={24} className="text-black" />
    </div>
  );
}
