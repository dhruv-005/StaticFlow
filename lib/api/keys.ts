import { frontendApi } from "./client";

export interface ApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  permissions: string[];
  ipWhitelist: string[];
  isActive: boolean;
  lastUsedAt?: string;
  expiresAt?: string;
  createdAt: string;
}

export async function getApiKeys(projectId: string): Promise<ApiKey[]> {
  const res = await frontendApi.get<{ keys: ApiKey[] }>(`/keys?projectId=${projectId}`);
  return res.data.keys || [];
}

export async function createApiKey(data: {
  projectId: string;
  name: string;
  permissions?: string[];
  expiresAt?: string;
}): Promise<{ key: ApiKey; fullKey: string } | null> {
  const res = await frontendApi.post<{ key: ApiKey; fullKey: string }>("/keys", data);
  return res.ok ? res.data : null;
}

export async function revokeApiKey(keyId: string): Promise<boolean> {
  const res = await frontendApi.delete(`/keys/${keyId}`);
  return res.ok;
}

export async function rotateApiKey(keyId: string): Promise<{ fullKey: string } | null> {
  const res = await frontendApi.post<{ fullKey: string }>(`/keys/${keyId}/rotate`);
  return res.ok ? res.data : null;
}
