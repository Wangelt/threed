"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { pageFadeTransition, tabSlideTransition } from "@/lib/motion";

/** Full-page routes — Hillride-style fade with reduced-motion support */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className="min-h-full flex flex-1 flex-col">{children}</div>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={pageFadeTransition}
        className="min-h-full flex flex-1 flex-col"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/** Bottom-nav / shell tabs — keep slide + fade */
export function TabTransition({ children, routeKey }: { children: React.ReactNode; routeKey: string }) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className="h-full">{children}</div>;
  }

  return (
    <motion.div
      key={routeKey}
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={tabSlideTransition}
      className="h-full"
    >
      {children}
    </motion.div>
  );
}

/** Light fade for nested views */
export function FadeTransition({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className="min-h-full flex flex-1 flex-col">{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="min-h-full flex flex-1 flex-col"
    >
      {children}
    </motion.div>
  );
}
