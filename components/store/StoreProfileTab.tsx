"use client";

import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { MockStore } from "@/lib/data/mock-store";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { RatingDistribution } from "@/components/order/RatingDistribution";

export function StoreProfileTab() {
  const router = useRouter();

  return (
    <div className="space-y-6 p-4 pb-6">
      <div className="flex items-center gap-3">
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
      </div>

      <RatingDistribution percentages={MockStore.starDistribution} rating={MockStore.rating} />
      <p className="text-xs text-text-secondary">{MockStore.totalReviews} reviews</p>

      <div>
        <h2 className="text-base font-bold">About the store</h2>
        <p className="mt-2 text-[13px] leading-[1.55] text-text-secondary">
          We craft premium 3D printed products with precision and care. From custom models to
          everyday accessories — quality you can feel.
        </p>
      </div>

      <div>
        <h2 className="text-base font-bold">Customer Reviews</h2>
        <div className="mt-3 space-y-3">
          {MockStore.reviews.map((review) => (
            <div key={review.author} className="rounded-[14px] border border-border p-3.5">
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
            </div>
          ))}
        </div>
      </div>

      <PrimaryButton label="Message Us" onClick={() => {}} />
      <button
        type="button"
        onClick={() => router.push("/orders")}
        className="w-full rounded-xl border border-border py-3.5 font-semibold text-black"
      >
        My Orders
      </button>
    </div>
  );
}
