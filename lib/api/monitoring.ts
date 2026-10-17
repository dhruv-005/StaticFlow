import { frontendApi } from "./client";

export interface MonitoringData {
  projectId: string;
  uptime: number;
  avgResponseTime: number;
  totalRequests: number;
  errorRate: number;
  statusCodes: Record<string, number>;
  responseTimeHistory: { timestamp: number; value: number }[];
  requestVolumeHistory: { timestamp: number; value: number }[];
}

export async function getMonitoringData(projectId: string): Promise<MonitoringData | null> {
  const res = await frontendApi.get<{ data: MonitoringData }>(`/monitoring/${projectId}`);
  return res.ok ? res.data.data : null;
}
