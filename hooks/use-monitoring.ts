"use client";

import { useEffect, useState } from "react";
import { useMonitoringStore } from "@/stores/monitoring-store";
import { ProjectMonitoring } from "@/types/monitoring";

export function useMonitoring(projectId?: string) {
  const { projectMetrics, setProjectMetrics } = useMonitoringStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!projectId) return;

    const fetchMetrics = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/monitoring/${projectId}`);
        if (res.ok) {
          const data: ProjectMonitoring = await res.json();
          setProjectMetrics(projectId, data);
        }
      } catch (err) {
        console.error("Monitoring metric fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, [projectId, setProjectMetrics]);

  return {
    metrics: projectId ? projectMetrics[projectId] : null,
    loading,
  };
}
