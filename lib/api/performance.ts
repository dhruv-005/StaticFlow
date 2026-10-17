import { frontendApi } from "./client";

export interface PerformanceTest {
  id: string;
  projectId: string;
  testType: "load" | "stress" | "spike" | "soak";
  status: "running" | "completed" | "failed";
  avgResponseTime: number;
  p95ResponseTime: number;
  p99ResponseTime: number;
  throughput: number;
  errorRate: number;
  maxConcurrentUsers: number;
  results: PerformanceDataPoint[];
  startedAt: string;
  completedAt?: string;
}

export interface PerformanceDataPoint {
  timestamp: number;
  responseTime: number;
  throughput: number;
  errorRate: number;
  activeUsers: number;
}

export async function startPerformanceTest(data: {
  projectId: string;
  testType: "load" | "stress" | "spike" | "soak";
  duration: number;
  concurrentUsers: number;
}): Promise<PerformanceTest | null> {
  const res = await frontendApi.post<{ test: PerformanceTest }>("/performance/test", data);
  return res.ok ? res.data.test : null;
}

export async function getPerformanceTest(testId: string): Promise<PerformanceTest | null> {
  const res = await frontendApi.get<{ test: PerformanceTest }>(`/performance/${testId}`);
  return res.ok ? res.data.test : null;
}
