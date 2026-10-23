"use client";

import * as React from "react";
import { useEffect, useRef } from "react";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export function Dialog({ open, onClose, title, description, children, maxWidth = "max-w-md" }: DialogProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
      window.addEventListener("keydown", handleEsc);
      return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", handleEsc); };
    }
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className={`w-full ${maxWidth} rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 shadow-card animate-fade-up`}>
        {title && (
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold font-display text-[var(--text-primary)]">{title}</h2>
              {description && <p className="text-sm text-[var(--text-secondary)] mt-1">{description}</p>}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] transition-colors"
              aria-label="Close"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

export function ConfirmDialog({
  open, onClose, onConfirm, title, description,
  confirmLabel = "Confirm", cancelLabel = "Cancel", danger = false, loading = false,
}: {
  open: boolean; onClose: () => void; onConfirm: () => void;
  title: string; description: string;
  confirmLabel?: string; cancelLabel?: string; danger?: boolean; loading?: boolean;
}) {
  return (
    <Dialog open={open} onClose={onClose} title={title} description={description}>
      <div className="flex justify-end gap-3 mt-6">
        <button onClick={onClose} className="btn-secondary btn-sm">{cancelLabel}</button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className={`btn-sm ${danger ? "bg-red-600 text-white hover:bg-red-700" : "btn-primary"}`}
        >
          {loading ? "Processing..." : confirmLabel}
        </button>
      </div>
    </Dialog>
  );
}
