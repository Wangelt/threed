"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { HeroSlide } from "@/lib/data/mock-products";
import { SafeImage } from "@/components/ui/SafeImage";
import { fadeUp, scaleIn } from "@/lib/motion";

interface HeroCarouselProps {
  slides: HeroSlide[];
}

export function HeroCarousel({ slides }: HeroCarouselProps) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const slide = slides[index] ?? slides[0];

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 5000);
    return () => window.clearInterval(id);
  }, [slides.length]);

  if (!slide) return null;

  function go(delta: number) {
    setIndex((i) => (i + delta + slides.length) % slides.length);
  }

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={scaleIn}
      className="relative -mx-4 h-[52vw] max-h-[420px] min-h-[220px] overflow-hidden sm:-mx-6 lg:-mx-8 lg:h-[380px]"
      aria-roledescription="carousel"
      aria-label="Featured"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="absolute inset-0"
        >
          <SafeImage
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover brightness-[0.45]"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-8 lg:p-10">
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <p className="text-[11px] font-semibold tracking-[1.6px] text-white/80">
            {slide.eyebrow}
          </p>
          <h1 className="mt-1.5 max-w-xl text-2xl font-extrabold leading-tight text-white sm:text-3xl lg:text-4xl">
            {slide.title}
          </h1>
          <p className="mt-1.5 max-w-md text-[13px] text-white/80 sm:text-base">
            {slide.subtitle}
          </p>
          <button
            type="button"
            onClick={() => router.push(slide.href)}
            className="mt-4 inline-flex h-11 items-center justify-center bg-white px-6 text-[13px] font-semibold tracking-wide text-black hover:bg-white/90"
          >
            SHOP NOW
          </button>
        </motion.div>
      </div>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => go(-1)}
            className="absolute left-2 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/90 p-2 sm:left-4 lg:flex"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => go(1)}
            className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/90 p-2 sm:right-4 lg:flex"
          >
            <ChevronRight size={20} />
          </button>
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-5 bg-white" : "w-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </motion.section>
  );
}
