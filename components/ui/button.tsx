import * as React from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  glow?: boolean;
}

const variants: Record<Variant, string> = {
  primary: "bg-crimson text-white hover:bg-crimson-hover hover:shadow-glow",
  secondary: "bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border)] hover:border-crimson hover:bg-[var(--bg-elevated)]",
  ghost: "text-[var(--text-secondary)] hover:bg-crimson-soft hover:text-crimson",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5",
  md: "px-5 py-2.5 text-sm rounded-xl gap-2",
  lg: "px-7 py-3.5 text-base rounded-2xl gap-2.5",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  glow = false,
  className = "",
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center font-medium
        transition-all duration-200 active:scale-[0.98]
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none
        ${variants[variant]} ${sizes[size]}
        ${glow ? "shadow-glow animate-pulse-glow" : ""} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
