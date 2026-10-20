"use client";

import { usePerformanceStore } from "@/stores/performance-store";
import { PerformanceTestType } from "@/types/performance";

export function usePerformanceTest(projectId?: string) {
  const {
    tests,
    currentTest,
    isRunningTest,
    setIsRunningTest,
    setCurrentTest,
    addTest,
  } = usePerformanceStore();

  const startTest = async (type: PerformanceTestType = "load") => {
    if (!projectId) return;

    setIsRunningTest(true);

    try {
      const res = await fetch("/api/performance/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, testType: type }),
      });

      const data = await res.json();
      if (res.ok && data.test) {
        setCurrentTest(data.test);
        addTest(data.test);
      }
    } catch (err) {
      console.error("Performance test error:", err);
    } finally {
      setIsRunningTest(false);
    }
  };

  return {
    tests,
    currentTest,
    isRunningTest,
    startTest,
  };
}
