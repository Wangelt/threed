"use client";

import { usePathname } from "next/navigation";
import { TabTransition } from "@/components/layout/PageTransition";

export function MainLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <main className="w-full flex-1 overflow-y-auto">
      <TabTransition routeKey={pathname}>{children}</TabTransition>
    </main>
  );
}
