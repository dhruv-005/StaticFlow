export type ProjectLanguage =
  | "node-express"
  | "python-fastapi"
  | "python-django"
  | "java-spring"
  | "go-gin"
  | "php-laravel";

export type ProjectDatabase = "postgresql" | "mongodb" | "mysql" | "sqlite";
export type ProjectStatus = "draft" | "active" | "deployed" | "archived";

export interface ProjectFile {
  path: string;
  content: string;
  language: string;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  description?: string;
  language: ProjectLanguage;
  framework: string;
  database: ProjectDatabase;
  status: ProjectStatus;
  code: Record<string, string>;
  schema?: Record<string, unknown>;
  endpointsCount: number;
  securityScore: number;
  createdAt: string;
  updatedAt: string;
}
