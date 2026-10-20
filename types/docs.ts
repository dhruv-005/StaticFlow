export interface DocEndpoint {
  id: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;
  summary: string;
  description: string;
  tag: string;
  authRequired: boolean;
  requestBody?: {
    contentType: string;
    example: Record<string, unknown>;
  };
  responses: Array<{
    status: number;
    description: string;
    example: Record<string, unknown>;
  }>;
}

export const sampleEndpoints: DocEndpoint[] = [
  {
    id: "ep-1",
    method: "GET",
    path: "/api/v1/health",
    summary: "Service Health Check",
    description: "Returns the health and uptime status of the API engine.",
    tag: "System",
    authRequired: false,
    responses: [
      {
        status: 200,
        description: "API is healthy",
        example: { status: "healthy", uptime: 3600, engine: "StaticFlow AI" },
      },
    ],
  },
  {
    id: "ep-2",
    method: "POST",
    path: "/api/v1/auth/login",
    summary: "User Authentication",
    description: "Authenticates credentials and returns JWT access and refresh tokens.",
    tag: "Auth",
    authRequired: false,
    requestBody: {
      contentType: "application/json",
      example: { email: "alex@example.com", password: "SuperSecretPassword123!" },
    },
    responses: [
      {
        status: 200,
        description: "Login successful",
        example: { token: "eyJhbGciOiJIUzI1Ni...", user: { id: "usr_1", email: "alex@example.com" } },
      },
    ],
  },
  {
    id: "ep-3",
    method: "GET",
    path: "/api/v1/items",
    summary: "List Resources",
    description: "Returns a paginated collection of database resources.",
    tag: "Resources",
    authRequired: true,
    responses: [
      {
        status: 200,
        description: "Items retrieved",
        example: { items: [{ id: 1, name: "Sample Item" }], total: 1 },
      },
    ],
  },
];
