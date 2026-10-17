"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { resolvedTheme } = useTheme();

  return (
    <Sonner
      theme={resolvedTheme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-[var(--surface)] group-[.toaster]:text-[var(--text)] group-[.toaster]:border-[var(--border)] group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-[var(--text-muted)]",
          actionButton: "group-[.toast]:bg-[var(--accent)] group-[.toast]:text-[var(--accent-text)]",
          cancelButton: "group-[.toast]:bg-[var(--surface-muted)] group-[.toast]:text-[var(--text)]",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
