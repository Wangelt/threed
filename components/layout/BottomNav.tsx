"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ShoppingBag, User } from "lucide-react";

const tabs = [
  { href: "/home", label: "Home", icon: Home, activeIcon: Home },
  { href: "/search", label: "Search", icon: Search, activeIcon: Search },
  { href: "/cart", label: "Cart", icon: ShoppingBag, activeIcon: ShoppingBag },
  { href: "/profile", label: "Profile", icon: User, activeIcon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 z-50 border-t border-transparent bg-white shadow-[0_-2px_12px_rgba(0,0,0,0.06)] lg:rounded-t-2xl lg:border lg:border-border/60">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-2 sm:px-4 lg:max-w-5xl">
        {tabs.map(({ href, label, icon: Icon }) => {
          const selected = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center rounded-xl px-4 py-1.5 transition-colors duration-220 ${
                selected ? "bg-surface" : "bg-transparent"
              }`}
            >
              <Icon
                size={24}
                className={selected ? "text-black" : "text-text-muted"}
                strokeWidth={selected ? 2.2 : 1.8}
              />
              <span
                className={`mt-1 text-[11px] ${
                  selected ? "font-semibold text-black" : "font-normal text-text-muted"
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
