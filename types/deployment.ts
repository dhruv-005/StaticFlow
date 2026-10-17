export type DeploymentPlatform =
  | "vercel"
  | "render"
  | "flyio"
  | "railway"
  | "aws"
  | "gcp"
  | "azure";

export type DeploymentStatus = "building" | "deploying" | "live" | "failed" | "rolled_back";

export interface Deployment {
  id: string;
  projectId: string;
  platform: DeploymentPlatform;
  status: DeploymentStatus;
  url: string;
  domain?: string;
  sslEnabled: boolean;
  envVarsMasked: Record<string, string>;
  deployLogs: string[];
  createdAt: string;
}
