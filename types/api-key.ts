export interface ApiKey {
  id: string;
  projectId: string;
  userId: string;
  keyName: string;
  keyPrefix: string;
  apiKeyMasked: string;
  permissions: string[];
  ipWhitelist: string[];
  expiresAt?: string | null;
  isActive: boolean;
  lastUsedAt?: string | null;
  createdAt: string;
}

export interface SecretItem {
  id: string;
  projectId: string;
  key: string;
  valueMasked: string;
  createdAt: string;
  updatedAt: string;
}
