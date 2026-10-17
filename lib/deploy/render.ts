const RENDER_API = "https://api.render.com/v1";

interface RenderDeployOptions {
  name: string;
  repo: string;
  branch?: string;
  runtime?: "node" | "python" | "go" | "ruby" | "rust";
  buildCommand?: string;
  startCommand?: string;
  envVars?: Record<string, string>;
  plan?: "free" | "starter" | "standard";
  region?: string;
}

interface RenderDeployResult {
  id: string;
  name: string;
  url: string;
  status: string;
  serviceType: string;
}

export async function deployToRender(
  options: RenderDeployOptions
): Promise<RenderDeployResult> {
  const apiKey = process.env.RENDER_API_KEY || "";

  if (!apiKey) {
    throw new Error("Render API key not configured");
  }

  const headers = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  // Step 1: Create Web Service
  const serviceRes = await fetch(`${RENDER_API}/services`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      type: "web_service",
      name: options.name,
      ownerId: "", // Will use authenticated user
      repo: options.repo,
      branch: options.branch || "main",
      runtime: options.runtime || "node",
      buildCommand: options.buildCommand || "npm install && npm run build",
      startCommand: options.startCommand || "npm start",
      plan: options.plan || "free",
      region: options.region || "oregon",
      autoDeploy: true,
    }),
  });

  if (!serviceRes.ok) {
    const err = await serviceRes.text();
    throw new Error(`Render service creation failed: ${err}`);
  }

  const service = await serviceRes.json();
  const serviceId = service.id;

  // Step 2: Set Environment Variables
  if (options.envVars && Object.keys(options.envVars).length > 0) {
    const envVarsArray = Object.entries(options.envVars).map(([key, value]) => ({
      key,
      value,
    }));

    await fetch(`${RENDER_API}/services/${serviceId}/env-vars`, {
      method: "POST",
      headers,
      body: JSON.stringify(envVarsArray),
    });
  }

  // Step 3: Trigger Deploy
  await fetch(`${RENDER_API}/services/${serviceId}/deploys`, {
    method: "POST",
    headers,
  });

  return {
    id: serviceId,
    name: options.name,
    url: `https://${options.name}.onrender.com`,
    status: "BUILDING",
    serviceType: "web_service",
  };
}

export async function getRenderServiceStatus(
  serviceId: string
): Promise<string> {
  const apiKey = process.env.RENDER_API_KEY || "";

  const res = await fetch(`${RENDER_API}/services/${serviceId}`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to get Render service status: ${res.status}`);
  }

  const data = await res.json();
  return data.serviceDetails?.status || "unknown";
}

export async function getRenderDeploys(
  serviceId: string
): Promise<Array<{ id: string; status: string; createdAt: string }>> {
  const apiKey = process.env.RENDER_API_KEY || "";

  const res = await fetch(`${RENDER_API}/services/${serviceId}/deploys`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
    },
  });

  if (!res.ok) return [];

  const data = await res.json();
  return data.map((d: { deploy: { id: string; status: string; createdAt: string } }) => ({
    id: d.deploy.id,
    status: d.deploy.status,
    createdAt: d.deploy.createdAt,
  }));
}

export async function rollbackRenderDeploy(
  serviceId: string,
  deployId: string
): Promise<boolean> {
  const apiKey = process.env.RENDER_API_KEY || "";

  const res = await fetch(
    `${RENDER_API}/services/${serviceId}/deploys/${deployId}/rollback`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
    }
  );

  return res.ok;
}

export async function deleteRenderService(serviceId: string): Promise<boolean> {
  const apiKey = process.env.RENDER_API_KEY || "";

  const res = await fetch(`${RENDER_API}/services/${serviceId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
    },
  });

  return res.ok;
}
