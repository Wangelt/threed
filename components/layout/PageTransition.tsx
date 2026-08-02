"use client";

import { motion } from "framer-motion";

/** Mirrors Flutter SlideFadeRoute — 380ms easeOutCubic slide + fade */
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.38, ease: [0.33, 1, 0.68, 1] }}
      className="min-h-full flex flex-1 flex-col"
    >
      {children}
    </motion.div>
  );
}

/** Mirrors Flutter MainShell AnimatedSwitcher — fade + slight slide */
export function TabTransition({ children, routeKey }: { children: React.ReactNode; routeKey: string }) {
  return (
    <motion.div
      key={routeKey}
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.32, ease: [0.33, 1, 0.68, 1] }}
      className="h-full"
    >
      {children}
    </motion.div>
  );
}

/** Mirrors Flutter FadeRoute — fade-in for light transitions */
export function FadeTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="min-h-full flex flex-1 flex-col"
    >
      {children}
    </motion.div>
  );
}
