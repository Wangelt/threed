"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { NumericKeypad } from "@/components/ui/NumericKeypad";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { appendPhoneDigit, backspacePhone } from "@/store/slices/authSlice";

export default function PhonePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const phone = useAppSelector((s) => s.auth.phone);
  const canSave = phone.length >= 10;

  return (
    <div className="flex min-h-screen flex-col bg-white max-w-lg mx-auto w-full">
      <header className="flex items-center gap-2 px-2 py-3 border-b border-border">
        <button type="button" onClick={() => router.back()} className="p-2">
          <ArrowLeft size={22} className="text-black" />
        </button>
        <h1 className="text-[17px] font-semibold flex-1 text-center pr-10">Add Mobile Number</h1>
      </header>

      <div className="flex-1 p-6">
        <p className="text-sm text-text-secondary">Enter your phone number</p>
        <div className="mt-4 flex gap-2.5">
          <div className="flex h-12 items-center gap-1 rounded-[10px] border border-border px-3">
            <span className="text-lg">🇬🇧</span>
            <ChevronDown size={18} />
          </div>
          <div className="flex h-12 flex-1 items-center rounded-[10px] border border-border-focus border-[1.4px] px-3.5">
            <span className={`text-sm ${phone ? "text-text-primary" : "text-text-muted"}`}>
              {phone || "Phone number"}
            </span>
          </div>
        </div>

        <div className="mt-6">
          <PrimaryButton
            label="Save"
            disabled={!canSave}
            onClick={canSave ? () => router.replace("/home") : undefined}
          />
        </div>
      </div>

      <NumericKeypad
        onKeyTap={(key) => dispatch(appendPhoneDigit(key))}
        onBackspace={() => dispatch(backspacePhone())}
      />
    </div>
  );
}
