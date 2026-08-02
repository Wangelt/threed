"use client";

import { Suspense, useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, MoreVertical, Search } from "lucide-react";
import { StoreFrontTab } from "./StoreFrontTab";
import { StoreProductsTab } from "./StoreProductsTab";
import { StoreProfileTab } from "./StoreProfileTab";

const TABS = [
  { id: "front", label: "Store Front" },
  { id: "products", label: "Products" },
  { id: "profile", label: "Store Profile" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function StoreShellContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as TabId) || "front";
  const [tab, setTab] = useState<TabId>(
    TABS.some((t) => t.id === initialTab) ? initialTab : "front",
  );

  const handleTabChange = useCallback(
    (id: TabId) => {
      setTab(id);
      router.replace(`/store?tab=${id}`, { scroll: false });
    },
    [router],
  );

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col bg-white lg:max-w-5xl">
      <header className="flex items-center gap-1 px-2 pt-1">
        <button type="button" onClick={() => router.back()} className="p-2">
          <ArrowLeft size={22} className="text-black" />
        </button>
        <h1 className="flex-1 text-center text-[17px] font-bold">3D Game Store</h1>
        <button type="button" className="p-2" aria-label="Search">
          <Search size={22} />
        </button>
        <button type="button" className="p-2" aria-label="More">
          <MoreVertical size={22} />
        </button>
      </header>

      <div className="flex border-b border-border">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => handleTabChange(id)}
            className={`flex-1 border-b-2 py-3 text-[13px] transition-colors ${
              tab === id
                ? "border-black font-semibold text-black"
                : "border-transparent font-normal text-text-muted"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {tab === "front" && <StoreFrontTab />}
        {tab === "products" && <StoreProductsTab />}
        {tab === "profile" && <StoreProfileTab />}
      </div>
    </div>
  );
}

export function StoreShellView() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <StoreShellContent />
    </Suspense>
  );
}
