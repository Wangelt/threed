"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fillNextOtpDigit,
  backspaceOtp,
} from "@/store/slices/authSlice";
import { fadeUp, scaleIn, stagger } from "@/lib/motion";
import { verifyPhoneOtp } from "@/lib/firebase-phone-auth";
import { getOtpConfirmation, clearOtpConfirmation } from "@/lib/phone-otp-state";
import { api } from "@/lib/api";
import { otpSchema } from "@/lib/schemas";

const DEFAULT_PHONE = "+91 98765 43210";

function OtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const otpDigits = useAppSelector((s) => s.auth.otpDigits);
  const phoneNumber = searchParams.get("phone") ?? DEFAULT_PHONE;
  const rawRedirect = searchParams.get("redirect") || "/home";
  const redirectTo = rawRedirect.startsWith("/") && !rawRedirect.startsWith("/auth") && !rawRedirect.startsWith("/otp") && !rawRedirect.startsWith("/phone")
    ? rawRedirect
    : "/home";
  const inputRef = useRef<HTMLInputElement>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleVerifyOtp = async () => {
    try {
      setIsVerifying(true);
      setError("");

      const otp = otpDigits.join("");

      const otpResult = otpSchema.safeParse(otp);
      if (!otpResult.success) {
        setError(otpResult.error.issues[0]?.message ?? "Invalid OTP");
        return;
      }

      const confirmation = getOtpConfirmation();

      if (!confirmation) {
        throw new Error("OTP session expired. Please try again.");
      }

      // Verify OTP with Firebase
      const { idToken } = await verifyPhoneOtp(otp, confirmation);

      // Create server session
      await api.auth.firebasePhoneLogin(idToken);

      // Clear stored confirmation
      clearOtpConfirmation();

      // Redirect to the requested page after login
      router.replace(redirectTo);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Verification failed";
      setError(errorMessage);
      console.error("OTP verification error:", err);
    } finally {
      setIsVerifying(false);
    }
  };

  const focusInput = () => inputRef.current?.focus();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (!value) return;
    for (const char of value) {
      dispatch(fillNextOtpDigit(char));
    }
    e.target.value = "";
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      dispatch(backspaceOtp());
    }
  };

  return (
    <div className="relative flex min-h-screen items-stretch overflow-hidden bg-black">
      <div className="relative hidden w-[46%] flex-col justify-between border-r border-white/10 p-10 text-white lg:flex">
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sidebar-text">
            Workshop console
          </p>
          <h1 className="font-display mt-4 text-5xl leading-[1.05] font-semibold tracking-[-0.02em]">
            Confirm the line
            <br />
            before you enter.
          </h1>
        </motion.div>
        <motion.p
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="max-w-sm text-sm leading-relaxed text-sidebar-text"
        >
          A 6-digit verification code keeps your account secure.
        </motion.p>
      </div>

      <div className="relative flex flex-1 items-center justify-center bg-background px-4 py-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="w-full max-w-md border border-border bg-card p-8"
        >
          <motion.button
            type="button"
            variants={fadeUp}
            onClick={() => router.back()}
            className="mb-6 inline-flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.06em] text-muted"
          >
            <ArrowLeft size={16} className="text-ink" />
            Back
          </motion.button>

          <motion.p
            variants={fadeUp}
            className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted"
          >
            ThreedUs
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="font-display mt-2 text-4xl font-semibold tracking-[-0.02em] text-ink"
          >
            Verify phone
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-2 text-sm leading-relaxed text-muted">
            Enter the 6 digit code sent to{" "}
            <span className="font-semibold text-ink">{phoneNumber}</span>
          </motion.p>

          <motion.div
            variants={stagger}
            className="relative mt-7 flex justify-between gap-2 sm:gap-3"
            onClick={focusInput}
          >
            <input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              aria-label="6 digit verification code"
              className="absolute inset-0 z-10 cursor-text opacity-0"
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
            {otpDigits.map((digit, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                className={`pointer-events-none flex h-14 min-w-0 flex-1 items-center justify-center text-2xl font-semibold sm:h-16 ${
                  digit
                    ? "border border-ink bg-white text-ink"
                    : "border border-border bg-white text-ink"
                }`}
              >
                {digit}
              </motion.div>
            ))}
          </motion.div>

          {error && (
            <motion.div variants={fadeUp} className="mt-4 rounded bg-red-50 p-3 text-sm text-red-700 border border-red-200">
              {error}
            </motion.div>
          )}

          <motion.div variants={fadeUp} className="mt-5 text-center">
            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={isVerifying || otpDigits.some(d => !d)}
              className="inline-flex items-center justify-center bg-black py-3 px-5 gap-2 text-sm font-semibold text-white *:disabled:opacity-50"
            >
              {isVerifying ? "Verifying..." : "Verify Code"}
            </button>
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="mt-4 text-center text-xs text-muted"
          >
            Didn&apos;t receive the code? <br />
            <button type="button" className="font-semibold text-ink hover:underline">
              Resend
            </button>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}

export default function OtpPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OtpContent />
    </Suspense>
  );
}