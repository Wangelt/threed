"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Store,
  Receipt,
  Heart,
  Settings,
  ChevronRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { AppTextField } from "@/components/ui/AppTextField";
import { fadeUp, heroStagger, stagger } from "@/lib/motion";
import { api } from "@/lib/api";

interface ProfileAddress {
  _id?: string;
  label?: string;
  fullName?: string;
  phone?: string;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  isDefault?: boolean;
}

interface ProfileUser {
  name?: string;
  email?: string;
  phone?: string;
  addresses?: ProfileAddress[];
}

export function ProfileView() {
  const router = useRouter();
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [addressError, setAddressError] = useState("");
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    api.auth.me()
      .then((result) => setUser((result as { user: ProfileUser }).user))
      .catch(() => setUser(null));
    api.wishlist.get()
      .then((result) => setWishlistCount(((result as { products?: unknown[] }).products || []).length))
      .catch(() => setWishlistCount(0));
  }, []);

  return (
    <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
      <div className="h-3" />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={heroStagger}
        className="flex flex-col items-center"
      >
        <motion.div
          variants={fadeUp}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-black"
        >
          <span className="text-[28px] font-bold text-white">{(user?.name || "U")[0].toUpperCase()}</span>
        </motion.div>
        <motion.h1 variants={fadeUp} className="mt-3 text-xl font-bold">
          {user?.name || "Your profile"}
        </motion.h1>
        <motion.p variants={fadeUp} className="text-[13px] text-text-secondary">
          {user?.email || user?.phone || "Sign in to view your account"}
        </motion.p>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="mt-8 space-y-2.5"
      >
        <ProfileTile
          icon={Store}
          title="Store"
          subtitle="Store Front · Products · Profile"
          onClick={() => router.push("/store")}
        />
        <ProfileTile
          icon={Receipt}
          title="My Orders"
          subtitle="Paid · Shipped · Delivered · Returned"
          onClick={() => router.push("/orders")}
        />
        <ProfileTile
          icon={Heart}
          title="Wishlist"
          subtitle={`${wishlistCount} saved product${wishlistCount === 1 ? "" : "s"}`}
          onClick={() => router.push("/wishlist")}
        />
        <ProfileTile
          icon={Settings}
          title="Settings"
          subtitle={`${user?.addresses?.length || 0} saved address${user?.addresses?.length === 1 ? "" : "es"}`}
          onClick={() => setShowAddressForm((visible) => !visible)}
        />
      </motion.div>

      {showAddressForm && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mt-6 rounded-[14px] border border-border p-4"
        >
          <h2 className="text-base font-semibold">Add delivery address</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <AppTextField label="Full name" value={address.fullName} onChange={(value) => setAddress((current) => ({ ...current, fullName: value }))} />
            <AppTextField label="Phone" value={address.phone} onChange={(value) => setAddress((current) => ({ ...current, phone: value }))} type="tel" />
            <div className="sm:col-span-2">
              <AppTextField label="Address line 1" value={address.line1} onChange={(value) => setAddress((current) => ({ ...current, line1: value }))} />
            </div>
            <div className="sm:col-span-2">
              <AppTextField label="Address line 2" value={address.line2} onChange={(value) => setAddress((current) => ({ ...current, line2: value }))} />
            </div>
            <AppTextField label="City" value={address.city} onChange={(value) => setAddress((current) => ({ ...current, city: value }))} />
            <AppTextField label="State" value={address.state} onChange={(value) => setAddress((current) => ({ ...current, state: value }))} />
            <AppTextField label="Pincode" value={address.pincode} onChange={(value) => setAddress((current) => ({ ...current, pincode: value }))} type="tel" />
          </div>
          {addressError && <p className="mt-3 text-sm text-red-600">{addressError}</p>}
          <div className="mt-4">
            <PrimaryButton
              label={isSavingAddress ? "Saving..." : "Save address"}
              disabled={isSavingAddress}
              onClick={async () => {
                setAddressError("");
                setIsSavingAddress(true);
                try {
                  const result = await api.users.updateAddresses({
                    addresses: [
                      ...(user?.addresses || []).map(({ _id, ...savedAddress }) => savedAddress),
                      { ...address, label: "Home", isDefault: !(user?.addresses?.length) },
                    ],
                  }) as { addresses?: ProfileAddress[] };
                  setUser((current) => current ? { ...current, addresses: result.addresses || [] } : current);
                  setAddress({ fullName: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "" });
                  setShowAddressForm(false);
                } catch (error) {
                  setAddressError(error instanceof Error ? error.message : "Unable to save address.");
                } finally {
                  setIsSavingAddress(false);
                }
              }}
            />
          </div>
        </motion.div>
      )}

      {user?.addresses?.length ? (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mt-6 space-y-2.5"
        >
          <h2 className="text-base font-semibold">Saved Addresses</h2>
          {user.addresses.map((address) => (
            <div key={address._id || `${address.line1}-${address.pincode}`} className="rounded-[14px] border border-border p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold">{address.label || "Address"}</p>
                {address.isDefault && <span className="text-xs text-text-secondary">Default</span>}
              </div>
              <p className="mt-1 text-[13px] leading-[1.5] text-text-secondary">
                {[address.fullName, address.line1, address.line2, address.city, address.state, address.pincode].filter(Boolean).join(", ")}
              </p>
              {address.phone && <p className="mt-1 text-xs text-text-secondary">{address.phone}</p>}
            </div>
          ))}
        </motion.div>
      ) : null}

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="mt-6"
      >
        <PrimaryButton label="Sign Out" onClick={() => api.auth.logout().then(() => router.replace("/auth"))} />
      </motion.div>
      </div>
    </div>
  );
}

function ProfileTile({
  icon: Icon,
  title,
  subtitle,
  onClick,
}: {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      variants={fadeUp}
      onClick={onClick}
      className="flex w-full items-center gap-3.5 rounded-[14px] border border-border p-4 text-left transition-colors hover:bg-surface/50"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface">
        <Icon size={22} className="text-black" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-semibold">{title}</p>
        <p className="mt-0.5 text-xs text-text-secondary">{subtitle}</p>
      </div>
      <ChevronRight size={20} className="shrink-0 text-text-muted" />
    </motion.button>
  );
}
