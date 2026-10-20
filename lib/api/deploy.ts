import { frontendApi } from "./client";

export interface Deployment {
  id: string;
  projectId: string;
  platform: string;
  status: "building" | "deploying" | "live" | "failed" | "rolled_back";
  url: string;
  domain?: string;
  sslEnabled: boolean;
  deployLogs: string[];
  createdAt: string;
}

export async function deployProject(data: {
  projectId: string;
  platform: string;
  domain?: string;
  envVars?: Record<string, string>;
}): Promise<Deployment | null> {
  const res = await frontendApi.post<{ deployment: Deployment }>("/deploy", data);
  return res.ok ? res.data.deployment : null;
}

export async function getDeployment(projectId: string): Promise<Deployment | null> {
  const res = await frontendApi.get<{ deployment: Deployment }>(`/deploy/${projectId}`);
  return res.ok ? res.data.deployment : null;
}

export async function rollbackDeployment(deploymentId: string): Promise<boolean> {
  const res = await frontendApi.post(`/deploy/${deploymentId}/rollback`);
  return res.ok;
}
