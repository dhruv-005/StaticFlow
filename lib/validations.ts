import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  remember: z.boolean().optional(),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms",
  }),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const projectSchema = z.object({
  name: z.string().min(2, "Project name must be at least 2 characters").max(100),
  description: z.string().max(500).optional(),
  language: z.enum([
    "node-express",
    "python-fastapi",
    "python-django",
    "java-spring",
    "go-gin",
    "php-laravel",
  ]),
  database: z.enum(["postgresql", "mongodb", "mysql", "sqlite"]),
  features: z.array(z.string()).optional(),
});

export const generateApiSchema = z.object({
  prompt: z.string().min(10, "Prompt must be at least 10 characters").max(2000),
  language: z.string().optional(),
  database: z.string().optional(),
  includeAuth: z.boolean().default(true),
  includeValidation: z.boolean().default(true),
  includeTests: z.boolean().default(false),
  includeDocker: z.boolean().default(true),
});

export const securityScanSchema = z.object({
  projectId: z.string().uuid(),
  scanType: z.enum(["quick", "deep", "full"]),
  targetUrl: z.string().url().optional(),
});

export const performanceTestSchema = z.object({
  projectId: z.string().uuid(),
  testType: z.enum(["load", "stress", "spike", "soak"]),
  duration: z.number().min(10).max(3600),
  concurrentUsers: z.number().min(1).max(10000),
  requestsPerSecond: z.number().min(1).max(50000),
});

export const deploySchema = z.object({
  projectId: z.string().uuid(),
  platform: z.enum(["vercel", "render", "flyio", "railway", "aws", "gcp", "azure"]),
  domain: z.string().optional(),
  envVars: z.record(z.string()).optional(),
});

export const apiKeySchema = z.object({
  name: z.string().min(1).max(50),
  permissions: z.array(z.string()).optional(),
  ipWhitelist: z.array(z.string().ip()).optional(),
  expiresAt: z.string().datetime().optional(),
});

export const teamInviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(["admin", "developer", "tester", "viewer"]),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type GenerateApiInput = z.infer<typeof generateApiSchema>;
export type SecurityScanInput = z.infer<typeof securityScanSchema>;
export type PerformanceTestInput = z.infer<typeof performanceTestSchema>;
export type DeployInput = z.infer<typeof deploySchema>;
export type ApiKeyInput = z.infer<typeof apiKeySchema>;
