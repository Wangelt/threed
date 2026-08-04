"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FigmaProgressBar } from "@/components/onboarding/FigmaProgressBar";
import { OnboardingSlide } from "@/components/onboarding/OnboardingSlide";
import { OnboardingButton } from "@/components/onboarding/OnboardingButton";
import { ease, fadeUp, slideLeft } from "@/lib/motion";

const slides = [
  {
    title: "Wishing for an item but it is too expensive?",
    subtitle: "You will be notified of promotions for products in your wishlist.",
    image: "/images/onboard1.jpg",
    imageHeight: 300,
  },
  {
    title: "Immerse in a seamless online shopping experience.",
    subtitle: "We promise that you'll have the most fuss-free time with us ever.",
    image: "/images/onboard2.jpg",
    imageHeight: 246,
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const isLast = page === slides.length - 1;

  function handleNext() {
    if (page < slides.length - 1) {
      setPage((p) => p + 1);
    } else {
      router.replace("/auth?tab=login");
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <FigmaProgressBar total={slides.length} current={page} />

      <div className="flex-1 overflow-hidden pt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, x: -40, transition: { duration: 0.35, ease } }}
            variants={slideLeft}
            className="h-full"
          >
            <OnboardingSlide
              title={slides[page].title}
              subtitle={slides[page].subtitle}
              image={slides[page].image}
              imageHeight={slides[page].imageHeight}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="mx-auto w-full max-w-md px-8 pb-10 pt-4"
      >
        <OnboardingButton isLast={isLast} onClick={handleNext} />
      </motion.div>
    </div>
  );
}
