"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Store,
  Receipt,
  Heart,
  Settings,
  ChevronRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { fadeUp, heroStagger, stagger } from "@/lib/motion";

export function ProfileView() {
  const router = useRouter();

  return (
    <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
      <div className="h-3" />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={heroStagger}
        className="flex flex-col items-center"
      >
        <motion.div
          variants={fadeUp}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-black"
        >
          <span className="text-[28px] font-bold text-white">W</span>
        </motion.div>
        <motion.h1 variants={fadeUp} className="mt-3 text-xl font-bold">
          Wangel
        </motion.h1>
        <motion.p variants={fadeUp} className="text-[13px] text-text-secondary">
          wangel@3dgame.com
        </motion.p>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="mt-8 space-y-2.5"
      >
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
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="mt-6"
      >
        <PrimaryButton label="Sign Out" onClick={() => {}} />
      </motion.div>
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
    <motion.button
      type="button"
      variants={fadeUp}
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
    </motion.button>
  );
}
