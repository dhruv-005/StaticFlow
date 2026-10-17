"use client";

import { useUIStore } from "@/stores/ui-store";

export function useCommandPalette() {
  const { isCommandPaletteOpen, setCommandPaletteOpen } = useUIStore();

  const toggle = () => setCommandPaletteOpen(!isCommandPaletteOpen);
  const open = () => setCommandPaletteOpen(true);
  const close = () => setCommandPaletteOpen(false);

  return {
    isOpen: isCommandPaletteOpen,
    toggle,
    open,
    close,
  };
}
