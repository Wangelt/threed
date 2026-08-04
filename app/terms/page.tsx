"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { useAppDispatch } from "@/store/hooks";
import { setTermsAgreed } from "@/store/slices/authSlice";
import { fadeUp, stagger } from "@/lib/motion";

export default function TermsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  function handleAgree() {
    dispatch(setTermsAgreed(true));
    router.back();
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col">
      <motion.header
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="flex items-center gap-2 px-2 py-3 border-b border-border"
      >
        <button type="button" onClick={() => router.back()} className="p-2">
          <ArrowLeft size={22} className="text-black" />
        </button>
        <h1 className="text-[17px] font-semibold flex-1 text-center pr-10">Terms of Use</h1>
      </motion.header>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="flex-1 overflow-y-auto px-6 py-6"
      >
        <motion.h2 variants={fadeUp} className="text-xl font-bold">
          Welcome to 3D Game
        </motion.h2>
        <motion.p
          variants={fadeUp}
          className="mt-4 text-sm leading-[1.6] text-text-secondary whitespace-pre-line"
        >
          {`By using our application, you agree to comply with and be bound by the following terms and conditions. Please review them carefully before using our services.

1. Acceptance of Terms
By accessing or using 3D Game, you agree to be bound by these Terms of Use and all applicable laws and regulations.

2. Use of Service
You may use our service for lawful purposes only. You agree not to use the service in any way that violates any applicable laws.

3. Account Registration
When you create an account, you must provide accurate and complete information. You are responsible for maintaining the confidentiality of your account.

4. Products and Orders
All 3D printed products are subject to availability. We reserve the right to modify or discontinue products without notice.

5. Privacy
Your privacy is important to us. Please review our Privacy Policy to understand how we collect and use your information.

6. Limitation of Liability
3D Game shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the service.`}
        </motion.p>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="p-6 border-t border-border"
      >
        <PrimaryButton label="Agree" onClick={handleAgree} />
      </motion.div>
      </div>
    </div>
  );
}
