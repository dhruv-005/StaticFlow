const VERCEL_API = "https://api.vercel.com";

interface VercelDeployOptions {
  name: string;
  framework: string;
  envVars?: Record<string, string>;
  token: string;
}

interface VercelDeployResult {
  url: string;
  id: string;
  readyState: string;
}

export async function deployToVercel(
  options: VercelDeployOptions
): Promise<VercelDeployResult> {
  const token = options.token || process.env.VERCEL_TOKEN || "";

  if (!token) {
    throw new Error("Vercel token not configured");
  }

  // Step 1: Create project
  const projectRes = await fetch(`${VERCEL_API}/v9/projects`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: options.name,
      framework: options.framework,
    }),
  });

  if (!projectRes.ok) {
    const err = await projectRes.text();
    throw new Error(`Vercel project creation failed: ${err}`);
  }

  const project = await projectRes.json();

  // Step 2: Set environment variables
  if (options.envVars) {
    for (const [key, value] of Object.entries(options.envVars)) {
      await fetch(`${VERCEL_API}/v9/projects/${project.id}/env`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key,
          value,
          type: "encrypted",
          target: ["production", "preview", "development"],
        }),
      });
    }
  }

  return {
    url: `https://${project.name}.vercel.app`,
    id: project.id,
    readyState: "BUILDING",
  };
}

export async function getVercelDeploymentStatus(
  deploymentId: string,
  token: string
): Promise<string> {
  const res = await fetch(`${VERCEL_API}/v13/deployments/${deploymentId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  return data.readyState;
}
