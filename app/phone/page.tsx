"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { NumericKeypad } from "@/components/ui/NumericKeypad";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { appendPhoneDigit, backspacePhone } from "@/store/slices/authSlice";
import { fadeUp, stagger } from "@/lib/motion";

export default function PhonePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const phone = useAppSelector((s) => s.auth.phone);
  const canSave = phone.length >= 10;

  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
      <motion.header
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="flex items-center gap-2 px-2 py-3 border-b border-border"
      >
        <button type="button" onClick={() => router.back()} className="p-2">
          <ArrowLeft size={22} className="text-black" />
        </button>
        <h1 className="text-[17px] font-semibold flex-1 text-center pr-10">Add Mobile Number</h1>
      </motion.header>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="flex-1 p-6"
      >
        <motion.p variants={fadeUp} className="text-sm text-text-secondary">
          Enter your phone number
        </motion.p>
        <motion.div variants={fadeUp} className="mt-4 flex gap-2.5">
          <div className="flex h-12 items-center gap-1 rounded-[10px] border border-border px-3">
            <span className="text-lg">🇬🇧</span>
            <ChevronDown size={18} />
          </div>
          <div className="flex h-12 flex-1 items-center rounded-[10px] border border-border-focus border-[1.4px] px-3.5">
            <span className={`text-sm ${phone ? "text-text-primary" : "text-text-muted"}`}>
              {phone || "Phone number"}
            </span>
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="mt-6">
          <PrimaryButton
            label="Save"
            disabled={!canSave}
            onClick={canSave ? () => router.replace("/home") : undefined}
          />
        </motion.div>
      </motion.div>

      <NumericKeypad
        onKeyTap={(key) => dispatch(appendPhoneDigit(key))}
        onBackspace={() => dispatch(backspacePhone())}
      />
      </div>
    </div>
  );
}
