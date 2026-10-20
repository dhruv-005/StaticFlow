"use client";

import { useDeployStore } from "@/stores/deploy-store";
import { DeploymentPlatform } from "@/types/deployment";

export function useDeploy(projectId?: string) {
  const {
    deployments,
    activeDeployment,
    isDeploying,
    deployLogs,
    setIsDeploying,
    setActiveDeployment,
    appendLog,
    clearLogs,
  } = useDeployStore();

  const deploy = async (platform: DeploymentPlatform = "vercel") => {
    if (!projectId) return;

    setIsDeploying(true);
    clearLogs();
    appendLog(`Initializing deployment to ${platform}...`);

    try {
      const res = await fetch("/api/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, platform }),
      });

      appendLog("Building project containers...");
      const data = await res.json();

      if (res.ok && data.deployment) {
        appendLog(`Deployment successful! URL: ${data.deployment.url}`);
        setActiveDeployment(data.deployment);
      } else {
        appendLog(`Error: ${data.error || "Deployment failed"}`);
      }
    } catch (err) {
      appendLog(`Failed to connect to deployment engine.`);
    } finally {
      setIsDeploying(false);
    }
  };

  return {
    deployments,
    activeDeployment,
    isDeploying,
    deployLogs,
    deploy,
  };
}
