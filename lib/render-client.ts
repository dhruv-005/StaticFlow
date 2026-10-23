const RENDER_BASE = process.env.RENDER_API_URL || "https://staticflow.onrender.com";

interface RenderResponse<T = any> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
  entity: string;
}

async function request<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${RENDER_BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "Unknown error");
    throw new Error(`Render API ${res.status}: ${text}`);
  }

  return res.json();
}

// GET /api/v1/{entity}?limit=N&offset=N
export async function getEntities(
  entity: string,
  limit = 100,
  offset = 0
): Promise<RenderResponse> {
  return request<RenderResponse>(
    `/api/v1/${entity}?limit=${limit}&offset=${offset}`
  );
}

// GET /api/v1/{entity}/{id}
export async function getEntityById(
  entity: string,
  id: string | number
): Promise<any> {
  return request(`/api/v1/${entity}/${id}`);
}

// POST /api/v1/{entity}
export async function createEntity(
  entity: string,
  data: Record<string, any>
): Promise<any> {
  return request(`/api/v1/${entity}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// PUT /api/v1/{entity}/{id}
export async function updateEntity(
  entity: string,
  id: string | number,
  data: Record<string, any>
): Promise<any> {
  return request(`/api/v1/${entity}/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// DELETE /api/v1/{entity}/{id}
export async function deleteEntity(
  entity: string,
  id: string | number
): Promise<any> {
  return request(`/api/v1/${entity}/${id}`, {
    method: "DELETE",
  });
}

// GET /health
export async function healthCheck(): Promise<any> {
  return request("/health");
}
