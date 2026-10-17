export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface EndpointParameter {
  name: string;
  in: "path" | "query" | "header" | "cookie";
  required: boolean;
  type: string;
  description?: string;
}

export interface Endpoint {
  id: string;
  projectId: string;
  method: HttpMethod;
  path: string;
  summary: string;
  description?: string;
  parameters: EndpointParameter[];
  requestBody?: Record<string, unknown>;
  responseBody?: Record<string, unknown>;
  authRequired: boolean;
  roles: string[];
  createdAt: string;
}
