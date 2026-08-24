"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/layout/SiteHeader";

const HIDE_HEADER_PREFIXES = [
  "/auth",
  "/otp",
  "/phone",
  "/terms",
];

export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideHeader = HIDE_HEADER_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {!hideHeader && <SiteHeader />}
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
