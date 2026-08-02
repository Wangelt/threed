"use client";

import { useRouter } from "next/navigation";
import {
  Store,
  Receipt,
  Heart,
  Settings,
  ChevronRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

export function ProfileView() {
  const router = useRouter();

  return (
    <div className="mx-auto w-full max-w-lg px-6 py-6 lg:max-w-5xl">
      <div className="h-3" />

      <div className="flex flex-col items-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-black">
          <span className="text-[28px] font-bold text-white">W</span>
        </div>
        <h1 className="mt-3 text-xl font-bold">Wangel</h1>
        <p className="text-[13px] text-text-secondary">wangel@3dgame.com</p>
      </div>

      <div className="mt-8 space-y-2.5">
        <ProfileTile
          icon={Store}
          title="Store"
          subtitle="Store Front · Products · Profile"
          onClick={() => router.push("/store")}
        />
        <ProfileTile
          icon={Receipt}
          title="My Orders"
          subtitle="Paid · Shipped · Delivered · Returned"
          onClick={() => router.push("/orders")}
        />
        <ProfileTile
          icon={Heart}
          title="Wishlist"
          subtitle="Saved products"
          onClick={() => {}}
        />
        <ProfileTile
          icon={Settings}
          title="Settings"
          subtitle="Account & preferences"
          onClick={() => {}}
        />
      </div>

      <div className="mt-6">
        <PrimaryButton label="Sign Out" onClick={() => {}} />
      </div>
    </div>
  );
}

function ProfileTile({
  icon: Icon,
  title,
  subtitle,
  onClick,
}: {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3.5 rounded-[14px] border border-border p-4 text-left transition-colors hover:bg-surface/50"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface">
        <Icon size={22} className="text-black" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-semibold">{title}</p>
        <p className="mt-0.5 text-xs text-text-secondary">{subtitle}</p>
      </div>
      <ChevronRight size={20} className="shrink-0 text-text-muted" />
    </button>
  );
}
