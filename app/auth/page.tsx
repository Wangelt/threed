"use client";

import { Suspense, useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AppLogo } from "@/components/ui/AppLogo";
import { AuthTabBar } from "@/components/ui/AuthTabBar";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";

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
    <div className="min-h-screen bg-white flex flex-col max-w-lg mx-auto w-full">
      <div className="h-3" />
      <div className="flex justify-center">
        <AppLogo />
      </div>
      <div className="h-4" />
      <div className="px-6">
        <AuthTabBar selectedIndex={tab} onChange={handleTabChange} />
      </div>
      <div className="flex-1 overflow-y-auto">
        {tab === 0 ? <LoginForm embedded /> : <SignupForm embedded />}
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
