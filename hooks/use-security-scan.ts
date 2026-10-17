"use client";

import { useSecurityStore } from "@/stores/security-store";
import { ScanType } from "@/types/security";

export function useSecurityScan(projectId?: string) {
  const {
    scans,
    currentScan,
    isScanning,
    scanProgress,
    setIsScanning,
    setScanProgress,
    setCurrentScan,
    addScan,
  } = useSecurityStore();

  const triggerScan = async (type: ScanType = "quick") => {
    if (!projectId) return;

    setIsScanning(true);
    setScanProgress(10);

    try {
      const res = await fetch("/api/security/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, scanType: type }),
      });

      setScanProgress(70);
      const data = await res.json();

      if (res.ok && data.scan) {
        setScanProgress(100);
        setCurrentScan(data.scan);
        addScan(data.scan);
      }
    } catch (error) {
      console.error("Scan error:", error);
    } finally {
      setIsScanning(false);
    }
  };

  return {
    scans,
    currentScan,
    isScanning,
    scanProgress,
    triggerScan,
  };
}
