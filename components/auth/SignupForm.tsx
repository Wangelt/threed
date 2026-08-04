"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { AppLogo } from "@/components/ui/AppLogo";
import { AppTextField } from "@/components/ui/AppTextField";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { useAppSelector } from "@/store/hooks";
import { fadeUp, stagger } from "@/lib/motion";

interface SignupFormProps {
  embedded?: boolean;
}

export function SignupForm({ embedded = false }: SignupFormProps) {
  const router = useRouter();
  const agreed = useAppSelector((s) => s.auth.termsAgreed);

  async function openTerms() {
    router.push("/terms");
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={stagger}
      className={`px-6 ${embedded ? "pt-6" : "pt-3"}`}
    >
      {!embedded && (
        <>
          <motion.div variants={fadeUp} className="flex justify-center">
            <AppLogo />
          </motion.div>
          <div className="h-8" />
        </>
      )}

      <motion.h2 variants={fadeUp} className="text-xl font-bold">
        Manual Sign Up
      </motion.h2>
      <motion.div variants={fadeUp} className="mt-5 space-y-4">
        <AppTextField label="Username" hint="Johnappleseed" />
        <AppTextField label="Email ID" hint="qadfru@Al.com" />
        <AppTextField label="Password" hint="" obscure />
        <AppTextField label="Confirm Password" hint="" obscure />
      </motion.div>

      <motion.button
        type="button"
        variants={fadeUp}
        onClick={openTerms}
        className="mt-4 flex items-start gap-2.5 text-left w-full"
      >
        <div
          className={`mt-0.5 w-5 h-5 rounded shrink-0 flex items-center justify-center border transition-colors duration-200 ${
            agreed ? "bg-black border-black" : "bg-white border-border"
          }`}
        >
          {agreed && <Check size={14} className="text-white" />}
        </div>
        <p className="text-xs text-text-secondary leading-[1.4]">
          By continuing, you agree to our{" "}
          <span className="text-black font-semibold underline">Terms of Use</span> and{" "}
          <span className="text-black font-semibold underline">Privacy Policy.</span>
        </p>
      </motion.button>

      <motion.div variants={fadeUp} className="mt-6">
        <PrimaryButton
          label="Sign Up"
          disabled={!agreed}
          onClick={agreed ? () => router.push("/otp") : undefined}
        />
      </motion.div>

      <motion.div variants={fadeUp} className="mt-6 flex items-center gap-2">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-text-secondary px-2">Connect with Social Media</span>
        <div className="flex-1 h-px bg-border" />
      </motion.div>

      <motion.div variants={fadeUp} className="mt-4 flex justify-center gap-4">
        <SocialIcon label="f" />
        <SocialIcon label="G" />
      </motion.div>

      <div className="h-6" />
    </motion.div>
  );
}
