"use client";

import { Suspense, useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { AppLogo } from "@/components/ui/AppLogo";
import { AuthTabBar } from "@/components/ui/AuthTabBar";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";
import { fadeUp, heroStagger } from "@/lib/motion";

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "signup" ? 1 : 0;
  const [tab, setTab] = useState(initialTab);

  const handleTabChange = useCallback(
    (index: number) => {
      setTab(index);
      router.replace(index === 0 ? "/auth?tab=login" : "/auth?tab=signup", { scroll: false });
    },
    [router],
  );

  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <div className="mx-auto w-full max-w-md px-6">
      <motion.div initial="hidden" animate="visible" variants={heroStagger}>
        <div className="h-3" />
        <motion.div variants={fadeUp} className="flex justify-center">
          <AppLogo />
        </motion.div>
        <div className="h-4" />
        <motion.div variants={fadeUp}>
          <AuthTabBar selectedIndex={tab} onChange={handleTabChange} />
        </motion.div>
      </motion.div>
      <div className="flex-1 overflow-y-auto">
        {tab === 0 ? <LoginForm embedded /> : <SignupForm embedded />}
      </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <AuthContent />
    </Suspense>
  );
}
