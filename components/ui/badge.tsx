import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-[var(--border)] bg-[var(--surface-muted)] text-[var(--text-muted)]",
        accent: "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-text)]",
        success: "border-transparent bg-[var(--success)]/10 text-[var(--success)]",
        warning: "border-transparent bg-[var(--warning)]/10 text-[var(--warning)]",
        destructive: "border-transparent bg-[var(--danger)]/10 text-[var(--danger)]",
        outline: "border-[var(--border)] text-[var(--text-muted)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
