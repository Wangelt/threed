"use client";

interface AppTextFieldProps {
  label?: string;
  hint?: string;
  obscure?: boolean;
  focused?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  type?: string;
}

export function AppTextField({
  label,
  hint,
  obscure = false,
  focused = false,
  value,
  onChange,
  type,
}: AppTextFieldProps) {
  return (
    <div>
      {label && (
        <label className="block text-[13px] font-medium text-text-primary mb-1.5">{label}</label>
      )}
      <div
        className={`h-12 px-3.5 rounded-[10px] border flex items-center ${
          focused ? "border-border-focus border-[1.4px]" : "border-border"
        }`}
      >
        <input
          type={type ?? (obscure ? "password" : "text")}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={hint}
          className="w-full text-sm text-text-primary placeholder:text-text-muted bg-transparent outline-none"
        />
      </div>
    </div>
  );
}
