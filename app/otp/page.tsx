"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { NumericKeypad } from "@/components/ui/NumericKeypad";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fillNextOtpDigit, backspaceOtp, selectOtpComplete } from "@/store/slices/authSlice";
import { fadeUp, scaleIn, stagger } from "@/lib/motion";

const DEFAULT_PHONE = "+44 8580 0660 309";

function OtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const otpDigits = useAppSelector((s) => s.auth.otpDigits);
  const isComplete = useAppSelector(selectOtpComplete);
  const phoneNumber = searchParams.get("phone") ?? DEFAULT_PHONE;

  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
      <motion.header
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="px-2 py-3"
      >
        <button type="button" onClick={() => router.back()} className="p-2">
          <ArrowLeft size={22} className="text-black" />
        </button>
      </motion.header>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="flex-1 px-6"
      >
        <div className="h-2" />
        <motion.h1 variants={fadeUp} className="text-[22px] font-bold">
          Verify your Phone Number
        </motion.h1>
        <motion.p variants={fadeUp} className="mt-2 text-[13px] leading-[1.5] text-text-secondary">
          Enter the 4 digit PIN that we sent to
          <br />
          <span className="font-semibold text-black">{phoneNumber}</span>
        </motion.p>

        <motion.div variants={stagger} className="mt-8 flex justify-between gap-3">
          {otpDigits.map((digit, index) => {
            const filled = digit !== "";
            return (
              <motion.div
                key={index}
                variants={scaleIn}
                className={`flex h-16 w-16 items-center justify-center rounded-xl text-2xl font-semibold transition-all duration-200 ${
                  filled
                    ? "border-[1.4px] border-black bg-white"
                    : "border border-border bg-surface"
                }`}
              >
                {digit}
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div variants={fadeUp} className="mt-6 text-center">
          <button type="button" className="text-sm text-black">
            Resend PIN
          </button>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className={`mt-4 transition-opacity duration-250 ${isComplete ? "opacity-100" : "opacity-40"}`}
        >
          <PrimaryButton
            label="Verify"
            disabled={!isComplete}
            onClick={isComplete ? () => router.push("/phone") : undefined}
          />
        </motion.div>
      </motion.div>

      <NumericKeypad
        onKeyTap={(key) => dispatch(fillNextOtpDigit(key))}
        onBackspace={() => dispatch(backspaceOtp())}
      />
      </div>
    </div>
  );
}

export default function OtpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <OtpContent />
    </Suspense>
  );
}
