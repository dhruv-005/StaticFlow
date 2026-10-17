"use client";

import { useState } from "react";
import { AlertTriangle, Loader2, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "cyan";
  onConfirm: () => Promise<void> | void;
  onClose: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await onConfirm();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const variantStyles = {
    danger: "border-cyber-red/40 bg-cyber-red/10 text-cyber-red shadow-[0_0_20px_rgba(255,51,102,0.2)]",
    warning: "border-cyber-yellow/40 bg-cyber-yellow/10 text-cyber-yellow shadow-[0_0_20px_rgba(255,215,0,0.2)]",
    cyan: "border-cyber-cyan/40 bg-cyber-cyan/10 text-cyber-cyan shadow-[0_0_20px_rgba(0,240,255,0.2)]",
  };

  const btnConfirmStyles = {
    danger: "bg-cyber-red text-white hover:bg-cyber-red/90 shadow-[0_0_15px_rgba(255,51,102,0.4)]",
    warning: "bg-cyber-yellow text-cyber-space hover:bg-cyber-yellow/90 shadow-[0_0_15px_rgba(255,215,0,0.4)]",
    cyan: "neon-button",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-cyber-white/10 bg-cyber-navy/95 p-6 shadow-2xl backdrop-blur-2xl space-y-4">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-cyber-white/40 hover:bg-cyber-white/5 hover:text-cyber-white"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-3.5">
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border",
              variantStyles[variant]
            )}
          >
            <AlertTriangle className="h-5 w-5" />
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-bold text-cyber-white">{title}</h3>
            <p className="text-xs text-cyber-white/60 leading-relaxed">{description}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-cyber-white/10">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-cyber-white/10 bg-cyber-white/5 px-4 py-2 text-xs font-semibold text-cyber-white hover:bg-cyber-white/10 transition-all disabled:opacity-50"
          >
            {cancelLabel}
          </button>

          <button
            onClick={handleConfirm}
            disabled={loading}
            className={cn(
              "flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50",
              btnConfirmStyles[variant]
            )}
          >
            {loading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>{confirmLabel}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
