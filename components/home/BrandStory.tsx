"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { fadeUp, viewport } from "@/lib/motion";

export function BrandStory() {
  const router = useRouter();

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={fadeUp}
      className="mt-12 border-y border-border bg-background px-1 py-10 text-center sm:py-14"
    >
      <p className="text-[11px] font-semibold tracking-[1.8px] text-text-secondary">
        WELCOME TO
      </p>
      <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl">
        Threedus
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-text-secondary sm:text-[15px]">
        We design and print pieces meant for the hours after work — display models,
        custom cases, and workshop-grade details that turn a desk or shelf into a
        space you actually want to return to.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => router.push("/search/results?q=All+Products")}
          className="h-11 bg-black px-6 text-[13px] font-semibold tracking-wide text-white hover:bg-grey-dark"
        >
          SHOP ALL
        </button>
      </div>
    </motion.section>
  );
}
