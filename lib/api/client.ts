import { BACKEND_URL } from "@/lib/constants";

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
  timeout?: number;
}

interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  ok: boolean;
  error?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    // Remove trailing slash to avoid double-slash in paths
    this.baseUrl = baseUrl.replace(/\/+$/, "");
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = "GET",
      body,
      headers = {},
      timeout = 30000,
    } = options;

    // Ensure endpoint starts with /
    const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    const url = `${this.baseUrl}${normalizedEndpoint}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const config: RequestInit = {
        method,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        signal: controller.signal,
      };

      if (body && method !== "GET") {
        config.body = JSON.stringify(body);
      }

      const response = await fetch(url, config);
      const data = await response.json().catch(() => ({}));

      return {
        data: data as T,
        status: response.status,
        ok: response.ok,
        error: response.ok ? undefined : data.message || data.error || "Request failed",
      };
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return { data: {} as T, status: 408, ok: false, error: "Request timeout" };
      }
      return {
        data: {} as T,
        status: 0,
        ok: false,
        error: error instanceof Error ? error.message : "Network error",
      };
    } finally {
      clearTimeout(timeoutId);
    }
  }

  get<T>(endpoint: string, headers?: Record<string, string>) {
    return this.request<T>(endpoint, { method: "GET", headers });
  }

  post<T>(endpoint: string, body?: unknown, headers?: Record<string, string>) {
    return this.request<T>(endpoint, { method: "POST", body, headers });
  }

  put<T>(endpoint: string, body?: unknown, headers?: Record<string, string>) {
    return this.request<T>(endpoint, { method: "PUT", body, headers });
  }

  patch<T>(endpoint: string, body?: unknown, headers?: Record<string, string>) {
    return this.request<T>(endpoint, { method: "PATCH", body, headers });
  }

  delete<T>(endpoint: string, headers?: Record<string, string>) {
    return this.request<T>(endpoint, { method: "DELETE", headers });
  }
}

// Backend client uses the Vercel service binding URL or localhost fallback
export const apiClient = new ApiClient(BACKEND_URL);

// Frontend client for Next.js internal API routes
export const frontendApi = new ApiClient("/api");

export default ApiClient;
