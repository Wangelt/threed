"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Eye, EyeOff } from "lucide-react";
import { AppLogo } from "@/components/ui/AppLogo";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { SocialIcon } from "@/components/ui/SocialIcon";

interface LoginFormProps {
  embedded?: boolean;
}

export function LoginForm({ embedded = false }: LoginFormProps) {
  const router = useRouter();
  const [obscure, setObscure] = useState(true);

  return (
    <div className={`px-6 ${embedded ? "pt-6" : "pt-3"}`}>
      {!embedded && (
        <>
          <div className="flex justify-center">
            <AppLogo />
          </div>
          <div className="h-8" />
        </>
      )}

      <h2 className="text-[22px] font-bold">Hello again,</h2>
      <div className="flex items-center gap-2">
        <span className="text-[22px] font-bold">Wangel</span>
        <div className="w-7 h-7 rounded-full bg-surface" />
      </div>
      <p className="mt-1 text-[13px] text-text-secondary">This are you.</p>

      <div className="mt-6">
        <label className="block text-[13px] font-medium mb-1.5">Username</label>
        <div className="h-12 px-3.5 rounded-[10px] border border-border flex items-center justify-between">
          <span className="text-sm">Johnappleseed</span>
          <ChevronDown size={18} />
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-[13px] font-medium mb-1.5">Password</label>
        <div className="h-12 px-3.5 rounded-[10px] border border-border-focus border-[1.4px] flex items-center">
          <input
            type={obscure ? "password" : "text"}
            className="flex-1 text-sm bg-transparent outline-none"
          />
          <button type="button" onClick={() => setObscure(!obscure)} className="p-1">
            {obscure ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button type="button" className="text-[13px] text-black py-2">
          Forgot Password?
        </button>
      </div>

      <div className="mt-2">
        <PrimaryButton label="Login" onClick={() => router.push("/otp")} />
      </div>

      <div className="mt-3">
        <SecondaryButton label="Login with Face ID" />
      </div>

      <div className="mt-6 flex items-center gap-2">
        <div className="flex-1 h-px bg-border" />
        <span className="text-[13px] text-text-secondary px-2">Or connect with</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <div className="mt-4 flex justify-center gap-4">
        <SocialIcon label="f" />
        <SocialIcon label="G" />
      </div>

      <div className="h-6" />
    </div>
  );
}
