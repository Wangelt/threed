"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { fadeUp, stagger, viewport } from "@/lib/motion";

interface CategoryItem {
  name: string;
  icon: LucideIcon;
}

interface ShopByTypeProps {
  categories: CategoryItem[];
}

export function ShopByType({ categories }: ShopByTypeProps) {
  const router = useRouter();

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={stagger}
      className="mt-8"
    >
      <motion.p
        variants={fadeUp}
        className="text-[11px] font-bold tracking-[1.8px] text-text-primary"
      >
        SHOP BY TYPE
      </motion.p>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map(({ name, icon: Icon }) => (
          <motion.button
            key={name}
            type="button"
            variants={fadeUp}
            whileTap={{ scale: 0.98 }}
            onClick={() =>
              router.push(`/search/results?q=${encodeURIComponent(name)}`)
            }
            className="flex flex-col items-start gap-3 border border-border/70 bg-surface p-4 text-left hover:border-black"
          >
            <Icon size={22} className="text-text-primary" />
            <span className="text-[13px] font-semibold text-text-primary">{name}</span>
          </motion.button>
        ))}
      </div>
    </motion.section>
  );
}
