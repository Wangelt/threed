"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { useAppDispatch } from "@/store/hooks";
import { setAuthenticated } from "@/store/slices/authSlice";
import { api } from "@/lib/api";

const HIDE_HEADER_PREFIXES = [
  "/auth",
  "/otp",
  "/phone",
  "/terms",
];

export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  useEffect(() => {
    api.auth.me()
      .then((data) => {
        const user = (data as { user: { id: string } })?.user;
        if (user?.id) dispatch(setAuthenticated({ uid: user.id }));
      })
      .catch(() => {});
  }, [dispatch]);
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
