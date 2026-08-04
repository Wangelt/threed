"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { MockStore } from "@/lib/data/mock-store";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { RatingDistribution } from "@/components/order/RatingDistribution";
import { fadeUp, stagger, viewport } from "@/lib/motion";

export function StoreProfileTab() {
  const router = useRouter();

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="space-y-6 px-4 py-4 pb-6 sm:px-6 lg:px-8"
    >
      <motion.div variants={fadeUp} className="flex items-center gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-black">
          <span className="font-bold text-white">3D</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-base font-bold">{MockStore.name}</p>
          <p className="text-xs text-text-secondary">{MockStore.tagline}</p>
        </div>
        <button
          type="button"
          className="shrink-0 rounded-full border border-black px-4 py-2 text-[13px] font-semibold"
        >
          Follow
        </button>
      </motion.div>

      <motion.div variants={fadeUp}>
        <RatingDistribution percentages={MockStore.starDistribution} rating={MockStore.rating} />
        <p className="mt-2 text-xs text-text-secondary">{MockStore.totalReviews} reviews</p>
      </motion.div>

      <motion.div variants={fadeUp}>
        <h2 className="text-base font-bold">About the store</h2>
        <p className="mt-2 text-[13px] leading-[1.55] text-text-secondary">
          We craft premium 3D printed products with precision and care. From custom models to
          everyday accessories — quality you can feel.
        </p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={stagger}
      >
        <motion.h2 variants={fadeUp} className="text-base font-bold">
          Customer Reviews
        </motion.h2>
        <div className="mt-3 space-y-3">
          {MockStore.reviews.map((review) => (
            <motion.div
              key={review.author}
              variants={fadeUp}
              className="rounded-[14px] border border-border p-3.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-semibold">{review.author}</span>
                <span className="text-[11px] text-text-muted">{review.date}</span>
              </div>
              <div className="mt-1 flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    className={i < Math.floor(review.rating) ? "fill-black text-black" : "text-border"}
                  />
                ))}
              </div>
              <p className="mt-2 text-[13px] leading-[1.5] text-text-secondary">{review.text}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div variants={fadeUp}>
        <PrimaryButton label="Message Us" onClick={() => {}} />
      </motion.div>
      <motion.button
        type="button"
        variants={fadeUp}
        onClick={() => router.push("/orders")}
        className="w-full rounded-xl border border-border py-3.5 font-semibold text-black"
      >
        My Orders
      </motion.button>
    </motion.div>
  );
}
