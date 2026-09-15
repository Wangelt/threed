"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  clearRecaptcha,
  requestPhoneOtp,
  formatPhoneNumber,
  isValidPhoneNumber,
} from "@/lib/firebase-phone-auth";
import { phoneSchema } from "@/lib/schemas";

function LoginPageContent() {
  const [phoneInput, setPhoneInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRedirect = searchParams.get("redirect") || "/home";
  const redirectTo = rawRedirect.startsWith("/") && !rawRedirect.startsWith("/auth") && !rawRedirect.startsWith("/otp") && !rawRedirect.startsWith("/phone")
    ? rawRedirect
    : "/home";

  useEffect(() => clearRecaptcha, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Remove any non-digit characters and format phone number
      const digits = phoneInput.replace(/\D/g, "");


      

      const phoneResult = phoneSchema.safeParse(digits);
      if (!phoneResult.success) {
        throw new Error(phoneResult.error.issues[0]?.message ?? "Invalid phone number");
      }

      const fullPhone = formatPhoneNumber(digits, "91");

      if (!isValidPhoneNumber(fullPhone)) {
        throw new Error("Invalid phone number format");
      }

      // Request OTP from Firebase
      await requestPhoneOtp(fullPhone);

      // Navigate to OTP verification page
      router.push(`/otp?phone=${encodeURIComponent(fullPhone)}&redirect=${encodeURIComponent(redirectTo)}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to send OTP";
      setError(errorMessage);
      console.error("Auth error:", err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-stretch overflow-hidden bg-black">
      <div className="relative hidden w-[46%] flex-col justify-between border-r border-white/10 p-10 text-white lg:flex">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sidebar-text">
            THREEDUS
          </p>
          <h1 className="font-display mt-20 text-5xl leading-[1.05] font-semibold tracking-[-0.02em]">
            Shop without
            <br />
            hesitation
          </h1>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-sidebar-text">
          Customised 3D designs and premium prints delivered to your doorstep
        </p>
      </div>

      <div className="relative flex flex-1 items-center justify-center bg-background px-4 py-10">
        <form
          onSubmit={onSubmit}
          className="w-full max-w-md border border-border bg-card p-8"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
            ThreedUs
          </p>
          <h2 className="font-display mt-2 text-4xl font-semibold tracking-[-0.02em] text-ink">
            Sign in
          </h2>
          <p className="mt-2 text-sm text-muted">Quick verification with your phone.</p>

          <div className="mt-7 space-y-4">
            <div>
              <label
                htmlFor="phone"
                className="mb-1.5 block text-[0.72rem] font-semibold uppercase tracking-[0.06em] text-muted"
              >
                Phone Number
              </label>
              <div className="flex gap-2">
                <div className="flex items-center gap-1 rounded border border-border bg-white px-3 py-2 min-w-max">
                  <span>🇮🇳</span>
                  <span className="text-sm font-medium">+91</span>
                </div>
                <input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  placeholder="98765 43210"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  className="flex-1 rounded-[3px] border border-border bg-white px-3 py-2 text-foreground outline-none focus:border-ink"
                />
              </div>
              <p className="mt-1 text-[0.7rem] text-muted">
                {phoneInput.length}/10 digits
              </p>
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded bg-red-50 p-3 text-sm text-red-700 border border-red-200">
              {error}
            </div>
          )}

          <div id="recaptcha-container" className="mt-4" />

          <button
            type="submit"
            disabled={isLoading || phoneInput.length < 10}
            className="mt-6 inline-flex w-full cursor-pointer items-center justify-center gap-[0.45rem] rounded border border-ink bg-white px-4 py-2 text-sm font-semibold text-ink disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            {isLoading ? "Sending OTP..." : "Send OTP"}
          </button>

          <p className="mt-4 text-center text-xs text-muted">
            We&apos;ll send a verification code to your phone number
          </p>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}