import { AuthManager, AuthTokens } from "./auth.js";
import { RealtimeChannel } from "./realtime.js";
import {
  StaticFlowError,
  AuthenticationError,
  PermissionError,
  ValidationError,
  RateLimitError,
} from "./errors.js";

export interface StaticFlowClientOptions {
  baseUrl?: string;
  apiKey?: string;
  onTokenChange?: (tokens: AuthTokens | null) => void;
  headers?: Record<string, string>;
  timeout?: number;
}

export interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  params?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  headers?: Record<string, string>;
  auth?: boolean;
}

export class StaticFlowClient {
  public baseUrl: string;
  public auth: AuthManager;
  public realtime: RealtimeChannel;
  private defaultHeaders: Record<string, string>;
  private timeout: number;

  constructor(options: StaticFlowClientOptions = {}) {
    this.baseUrl = (options.baseUrl || "https://api.staticflow.dev").replace(/\/$/, "");
    this.defaultHeaders = options.headers || {};
    this.timeout = options.timeout || 30000;

    this.auth = new AuthManager(this.baseUrl, options.apiKey, options.onTokenChange);
    this.realtime = new RealtimeChannel(this.baseUrl, options.apiKey);
  }

  public async request<T = unknown>(path: string, options: RequestOptions = {}): Promise<T> {
    const { method = "GET", params, body, headers = {}, auth = true } = options;

    let url = `${this.baseUrl}${path.startsWith("/") ? path : `/${path}`}`;

    // Append query params
    if (params) {
      const searchParams = new URLSearchParams();
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) {
          searchParams.append(key, String(value));
        }
      }
      const qs = searchParams.toString();
      if (qs) {
        url += (url.includes("?") ? "&" : "?") + qs;
      }
    }

    // Build headers
    const reqHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...this.defaultHeaders,
      ...headers,
    };

    if (auth) {
      const token = this.auth.getAccessToken();
      if (token) {
        reqHeaders["Authorization"] = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
      }
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        method,
        headers: reqHeaders,
        body: body && method !== "GET" ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = errorData.message || errorData.error || `HTTP ${response.status} ${response.statusText}`;

        if (response.status === 401) throw new AuthenticationError(message);
        if (response.status === 403) throw new PermissionError(message);
        if (response.status === 422 || response.status === 400) throw new ValidationError(message, errorData.details);
        if (response.status === 429) {
          const retry = Number(response.headers.get("Retry-After")) || 60;
          throw new RateLimitError(message, retry);
        }

        throw new StaticFlowError(message, response.status, errorData);
      }

      // If empty response
      if (response.status === 204) {
        return {} as T;
      }

      return (await response.json()) as T;
    } catch (err: unknown) {
      clearTimeout(timer);
      if (err instanceof StaticFlowError) throw err;
      if (err instanceof DOMException && err.name === "AbortError") {
        throw new StaticFlowError(`Request timeout after ${this.timeout}ms`, 408);
      }
      const message = err instanceof Error ? err.message : "Network error";
      throw new StaticFlowError(message, 0);
    }
  }

  // Convenience HTTP Methods
  public get<T>(path: string, params?: Record<string, string | number | boolean | undefined>, options?: Omit<RequestOptions, "method" | "params">): Promise<T> {
    return this.request<T>(path, { ...options, method: "GET", params });
  }

  public post<T>(path: string, body?: unknown, options?: Omit<RequestOptions, "method" | "body">): Promise<T> {
    return this.request<T>(path, { ...options, method: "POST", body });
  }

  public put<T>(path: string, body?: unknown, options?: Omit<RequestOptions, "method" | "body">): Promise<T> {
    return this.request<T>(path, { ...options, method: "PUT", body });
  }

  public patch<T>(path: string, body?: unknown, options?: Omit<RequestOptions, "method" | "body">): Promise<T> {
    return this.request<T>(path, { ...options, method: "PATCH", body });
  }

  public delete<T>(path: string, options?: Omit<RequestOptions, "method">): Promise<T> {
    return this.request<T>(path, { ...options, method: "DELETE" });
  }
}
