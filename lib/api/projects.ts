import { frontendApi } from "./client";

export interface Project {
  id: string;
  name: string;
  description: string;
  language: string;
  database: string;
  framework: string;
  status: "draft" | "active" | "deployed";
  endpointCount: number;
  securityScore: number;
  createdAt: string;
  updatedAt: string;
}

export async function getProjects(): Promise<Project[]> {
  const res = await frontendApi.get<{ projects: Project[] }>("/projects");
  return res.data.projects || [];
}

export async function getProject(id: string): Promise<Project | null> {
  const res = await frontendApi.get<{ project: Project }>(`/projects/${id}`);
  return res.ok ? res.data.project : null;
}

export async function createProject(data: {
  name: string;
  description?: string;
  language: string;
  database: string;
}): Promise<Project | null> {
  const res = await frontendApi.post<{ project: Project }>("/projects", data);
  return res.ok ? res.data.project : null;
}

export async function deleteProject(id: string): Promise<boolean> {
  const res = await frontendApi.delete(`/projects/${id}`);
  return res.ok;
}
