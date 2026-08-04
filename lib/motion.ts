import type { Transition, Variants } from "framer-motion";

/** Hillride ease curve — adapted for snappier shop UX */
export const ease = [0.16, 1, 0.3, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.9, ease },
  },
};

/** Same scaleIn motion, with original stagger delay — for per-card whileInView */
export const scaleInOnScroll: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: (column: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: 8,
      ease,
      delay: 0.05 + column * 0.1,
    },
  }),
};

export const slideLeft: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease },
  },
};

export const slideRight: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease },
  },
};

export const stagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

export const heroStagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

/** Shared scroll-trigger defaults (Hillride-style whileInView) */
export const viewport = { once: true, margin: "-60px" as const };

/** Per-card reveal — only when the card itself is on screen */
export const cardViewport = { once: true, amount: 0.25 as const, margin: "0px 0px -40px 0px" as const };

export const pageFadeTransition: Transition = {
  duration: 0.28,
  ease: [0.22, 1, 0.36, 1],
};

export const tabSlideTransition: Transition = {
  duration: 0.32,
  ease: [0.33, 1, 0.68, 1],
};
