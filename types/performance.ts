export type PerformanceTestType = "load" | "stress" | "spike" | "soak";
export type PerformanceTestStatus = "queued" | "running" | "completed" | "failed";

export interface PerformanceMetricPoint {
  timestamp: number;
  virtualUsers: number;
  responseTime: number;
  throughput: number;
  errorRate: number;
}

export interface PerformanceTest {
  id: string;
  projectId: string;
  testType: PerformanceTestType;
  status: PerformanceTestStatus;
  avgResponseMs: number;
  p95ResponseMs: number;
  p99ResponseMs: number;
  throughputReqSec: number;
  errorRatePercent: number;
  maxUsers: number;
  metrics: PerformanceMetricPoint[];
  startedAt: string;
  completedAt?: string;
}
