"use client";

import { useKeysStore } from "@/stores/keys-store";

export function useKeys(projectId?: string) {
  const { apiKeys, secrets, setApiKeys, setSecrets, addApiKey, removeApiKey } =
    useKeysStore();

  const fetchKeys = async () => {
    if (!projectId) return;
    try {
      const res = await fetch(`/api/keys?projectId=${projectId}`);
      if (res.ok) {
        const data = await res.json();
        setApiKeys(data.keys || []);
        setSecrets(data.secrets || []);
      }
    } catch (err) {
      console.error("Keys fetch failed", err);
    }
  };

  const createKey = async (keyName: string) => {
    if (!projectId) return null;
    try {
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, keyName }),
      });
      if (res.ok) {
        const data = await res.json();
        addApiKey(data.key);
        return data.fullKey;
      }
    } catch (err) {
      console.error("Key creation error", err);
    }
    return null;
  };

  const revokeKey = async (keyId: string) => {
    try {
      const res = await fetch(`/api/keys/${keyId}`, { method: "DELETE" });
      if (res.ok) {
        removeApiKey(keyId);
      }
    } catch (err) {
      console.error("Revoke key error", err);
    }
  };

  return {
    apiKeys,
    secrets,
    fetchKeys,
    createKey,
    revokeKey,
  };
}
