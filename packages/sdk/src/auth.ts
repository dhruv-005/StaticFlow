import { AuthenticationError } from "./errors.js";

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}

export interface UserSession {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

export class AuthManager {
  private baseUrl: string;
  private tokens: AuthTokens | null = null;
  private onTokenChange?: (tokens: AuthTokens | null) => void;

  constructor(baseUrl: string, initialToken?: string, onTokenChange?: (tokens: AuthTokens | null) => void) {
    this.baseUrl = baseUrl;
    this.onTokenChange = onTokenChange;

    if (initialToken) {
      this.tokens = { accessToken: initialToken };
    }
  }

  public setTokens(tokens: AuthTokens | null): void {
    this.tokens = tokens;
    if (this.onTokenChange) {
      this.onTokenChange(tokens);
    }
  }

  public getAccessToken(): string | null {
    return this.tokens?.accessToken || null;
  }

  public isAuthenticated(): boolean {
    return !!this.tokens?.accessToken;
  }

  public async login(credentials: { email: string; password: string }): Promise<{ user: UserSession; tokens: AuthTokens }> {
    const res = await fetch(`${this.baseUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new AuthenticationError(err.message || "Invalid email or password.");
    }

    const data = await res.json();
    const tokens: AuthTokens = {
      accessToken: data.token,
      refreshToken: data.refreshToken,
      expiresIn: data.expiresIn,
    };

    this.setTokens(tokens);
    return { user: data.user, tokens };
  }

  public async register(details: { email: string; password: string; name: string }): Promise<{ user: UserSession; tokens: AuthTokens }> {
    const res = await fetch(`${this.baseUrl}/api/v1/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(details),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new AuthenticationError(err.message || "Registration failed.");
    }

    const data = await res.json();
    const tokens: AuthTokens = {
      accessToken: data.token,
      refreshToken: data.refreshToken,
    };

    this.setTokens(tokens);
    return { user: data.user, tokens };
  }

  public logout(): void {
    this.setTokens(null);
  }
}
