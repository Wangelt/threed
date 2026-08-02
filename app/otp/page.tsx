"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { NumericKeypad } from "@/components/ui/NumericKeypad";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fillNextOtpDigit, backspaceOtp, selectOtpComplete } from "@/store/slices/authSlice";

const DEFAULT_PHONE = "+44 8580 0660 309";

function OtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const otpDigits = useAppSelector((s) => s.auth.otpDigits);
  const isComplete = useAppSelector(selectOtpComplete);
  const phoneNumber = searchParams.get("phone") ?? DEFAULT_PHONE;

  return (
    <div className="flex min-h-screen flex-col bg-white max-w-lg mx-auto w-full">
      <header className="px-2 py-3">
        <button type="button" onClick={() => router.back()} className="p-2">
          <ArrowLeft size={22} className="text-black" />
        </button>
      </header>

      <div className="flex-1 px-6">
        <div className="h-2" />
        <h1 className="text-[22px] font-bold">Verify your Phone Number</h1>
        <p className="mt-2 text-[13px] leading-[1.5] text-text-secondary">
          Enter the 4 digit PIN that we sent to
          <br />
          <span className="font-semibold text-black">{phoneNumber}</span>
        </p>

        <div className="mt-8 flex justify-between gap-3">
          {otpDigits.map((digit, index) => {
            const filled = digit !== "";
            return (
              <div
                key={index}
                className={`flex h-16 w-16 items-center justify-center rounded-xl text-2xl font-semibold transition-all duration-200 ${
                  filled
                    ? "border-[1.4px] border-black bg-white"
                    : "border border-border bg-surface"
                }`}
              >
                {digit}
              </div>
            );
          })}
        </div>

        <div className="mt-6 text-center">
          <button type="button" className="text-sm text-black">
            Resend PIN
          </button>
        </div>

        <div className={`mt-4 transition-opacity duration-250 ${isComplete ? "opacity-100" : "opacity-40"}`}>
          <PrimaryButton
            label="Verify"
            disabled={!isComplete}
            onClick={isComplete ? () => router.push("/phone") : undefined}
          />
        </div>
      </div>

      <NumericKeypad
        onKeyTap={(key) => dispatch(fillNextOtpDigit(key))}
        onBackspace={() => dispatch(backspaceOtp())}
      />
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
