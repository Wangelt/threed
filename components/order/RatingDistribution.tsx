import { Star } from "lucide-react";

interface RatingDistributionProps {
  percentages: number[];
  rating: number;
}

export function RatingDistribution({ percentages, rating }: RatingDistributionProps) {
  return (
    <div className="flex gap-5">
      <div className="flex flex-col items-center">
        <span className="text-4xl font-extrabold">{rating.toFixed(1)}</span>
        <div className="mt-1 flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={14}
              className={i < Math.floor(rating) ? "fill-black text-black" : "text-border"}
            />
          ))}
        </div>
      </div>
      <div className="flex-1 space-y-1.5">
        {Array.from({ length: 5 }).map((_, i) => {
          const star = 5 - i;
          const pct = percentages[i];
          return (
            <div key={star} className="flex items-center gap-1.5">
              <span className="w-3 text-[11px] text-text-secondary">{star}</span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-sm bg-border">
                <div className="h-full bg-black" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
