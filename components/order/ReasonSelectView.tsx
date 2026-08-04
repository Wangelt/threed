"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Circle, CircleDot } from "lucide-react";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { fadeUp, stagger } from "@/lib/motion";

interface ReasonSelectViewProps {
  title: string;
  subtitle?: string;
  reasons: string[];
  successMessage: string;
  onBack?: () => void;
}

export function ReasonSelectView({
  title,
  subtitle,
  reasons,
  successMessage,
  onBack,
}: ReasonSelectViewProps) {
  const router = useRouter();
  const [selected, setSelected] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  function handleNext() {
    setToast(successMessage);
    setTimeout(() => {
      if (onBack) onBack();
      else router.back();
    }, 1200);
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <motion.header
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="flex items-center gap-2 border-b border-border px-2 py-3"
      >
        <button type="button" onClick={() => router.back()} className="p-2">
          <ArrowLeft size={22} />
        </button>
        <h1 className="flex-1 text-center text-[17px] font-semibold pr-10">{title}</h1>
      </motion.header>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 lg:px-8"
      >
        {subtitle && (
          <motion.p variants={fadeUp} className="mb-3 text-[13px] text-text-secondary">
            {subtitle}
          </motion.p>
        )}
        <div className="space-y-2.5">
          {reasons.map((reason, i) => {
            const isSelected = selected === i;
            return (
              <motion.button
                key={reason}
                type="button"
                variants={fadeUp}
                onClick={() => setSelected(i)}
                className={`flex w-full items-center gap-3 rounded-xl border p-3.5 text-left transition-colors duration-200 ${
                  isSelected
                    ? "border-[1.4px] border-black bg-surface"
                    : "border-border bg-white"
                }`}
              >
                {isSelected ? (
                  <CircleDot size={20} className="shrink-0 text-black" />
                ) : (
                  <Circle size={20} className="shrink-0 text-black" />
                )}
                <span className="text-sm">{reason}</span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="flex gap-3 border-t border-border p-4"
      >
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 rounded-xl border border-border py-3.5 font-semibold"
        >
          Back
        </button>
        <div className="flex-1">
          <PrimaryButton label="Next" onClick={handleNext} />
        </div>
      </motion.div>

      {toast && (
        <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-black px-4 py-3 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
