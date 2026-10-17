export * from "./user";
export * from "./project";
export * from "./endpoint";
export * from "./api-key";
export * from "./security";
export * from "./performance";
export * from "./deployment";
export * from "./monitoring";
export * from "./ai";
export * from "./marketplace";
export * from "./team";
export * from "./docs";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  statusCode: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
