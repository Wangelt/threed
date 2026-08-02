"use client";

import { usePathname } from "next/navigation";
import { BottomNav } from "@/components/layout/BottomNav";
import { TabTransition } from "@/components/layout/PageTransition";

export function MainLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <main className="mx-auto w-full max-w-lg flex-1 overflow-y-auto lg:max-w-5xl">
        <TabTransition routeKey={pathname}>{children}</TabTransition>
      </main>
      <div className="mx-auto w-full max-w-lg shrink-0 lg:max-w-5xl">
        <BottomNav />
      </div>
    </div>
  );
}
