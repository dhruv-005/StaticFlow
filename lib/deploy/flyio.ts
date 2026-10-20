const FLY_API = "https://api.machines.dev/v1";

interface FlyDeployOptions {
  appName: string;
  image?: string;
  region?: string;
  envVars?: Record<string, string>;
  memoryMb?: number;
  cpuKind?: "shared" | "performance";
  cpus?: number;
}

interface FlyDeployResult {
  id: string;
  appName: string;
  url: string;
  status: string;
  region: string;
}

export async function deployToFlyio(
  options: FlyDeployOptions
): Promise<FlyDeployResult> {
  const token = process.env.FLYIO_TOKEN || "";

  if (!token) {
    throw new Error("Fly.io token not configured");
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const region = options.region || "iad";
  const image = options.image || "registry.fly.io/staticflow:latest";

  // Step 1: Create App
  const appRes = await fetch(`${FLY_API}/apps`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      app_name: options.appName,
      org_slug: "personal",
    }),
  });

  if (!appRes.ok && appRes.status !== 409) {
    const err = await appRes.text();
    throw new Error(`Fly.io app creation failed: ${err}`);
  }

  // Step 2: Set Secrets (Environment Variables)
  if (options.envVars && Object.keys(options.envVars).length > 0) {
    await fetch(`${FLY_API}/apps/${options.appName}/secrets`, {
      method: "POST",
      headers,
      body: JSON.stringify(options.envVars),
    });
  }

  // Step 3: Create Machine (Deploy)
  const machineRes = await fetch(
    `${FLY_API}/apps/${options.appName}/machines`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        name: `${options.appName}-web`,
        region,
        config: {
          image,
          env: options.envVars || {},
          services: [
            {
              protocol: "tcp",
              internal_port: 8000,
              ports: [
                { port: 80, handlers: ["http"] },
                { port: 443, handlers: ["tls", "http"] },
              ],
            },
          ],
          resources: {
            memory_mb: options.memoryMb || 256,
            cpu_kind: options.cpuKind || "shared",
            cpus: options.cpus || 1,
          },
          auto_destroy: false,
          restart: {
            policy: "always",
          },
        },
      }),
    }
  );

  if (!machineRes.ok) {
    const err = await machineRes.text();
    throw new Error(`Fly.io machine creation failed: ${err}`);
  }

  const machine = await machineRes.json();

  return {
    id: machine.id,
    appName: options.appName,
    url: `https://${options.appName}.fly.dev`,
    status: "DEPLOYING",
    region,
  };
}

export async function getFlyioAppStatus(
  appName: string
): Promise<{ status: string; machines: number }> {
  const token = process.env.FLYIO_TOKEN || "";

  const res = await fetch(`${FLY_API}/apps/${appName}/machines`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error(`Failed to get Fly.io app status: ${res.status}`);
  }

  const machines = await res.json();
  const running = machines.filter(
    (m: { state: string }) => m.state === "started"
  ).length;

  return {
    status: running > 0 ? "RUNNING" : "STOPPED",
    machines: machines.length,
  };
}

export async function getFlyioLogs(
  appName: string,
  limit: number = 50
): Promise<string[]> {
  const token = process.env.FLYIO_TOKEN || "";

  const res = await fetch(
    `${FLY_API}/apps/${appName}/logs?limit=${limit}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!res.ok) return [];

  const data = await res.json();
  return data.map((log: { message: string }) => log.message);
}

export async function scaleFlyioApp(
  appName: string,
  machineCount: number
): Promise<boolean> {
  const token = process.env.FLYIO_TOKEN || "";

  const res = await fetch(`${FLY_API}/apps/${appName}/scale`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ count: machineCount }),
  });

  return res.ok;
}

export async function deleteFlyioApp(appName: string): Promise<boolean> {
  const token = process.env.FLYIO_TOKEN || "";

  const res = await fetch(`${FLY_API}/apps/${appName}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.ok;
}
