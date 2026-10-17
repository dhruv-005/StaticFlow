export interface MonitoringMetric {
  timestamp: string;
  avgResponseTime: number;
  requestCount: number;
  errorCount: number;
}

export interface ProjectMonitoring {
  projectId: string;
  uptimePercentage: number;
  avgResponseTimeMs: number;
  totalRequests: number;
  errorRate: number;
  metrics24h: MonitoringMetric[];
  status: "operational" | "degraded" | "down";
}
