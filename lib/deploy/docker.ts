import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

interface DockerBuildOptions {
  projectName: string;
  dockerfilePath?: string;
  context?: string;
  tags?: string[];
  buildArgs?: Record<string, string>;
}

interface DockerBuildResult {
  success: boolean;
  imageId: string;
  tags: string[];
  size: string;
  duration: number;
}

export async function buildDockerImage(
  options: DockerBuildOptions
): Promise<DockerBuildResult> {
  const start = Date.now();
  const dockerfile = options.dockerfilePath || "Dockerfile";
  const context = options.context || ".";
  const tags = options.tags || [`${options.projectName}:latest`];

  let cmd = `docker build -f ${dockerfile}`;

  for (const tag of tags) {
    cmd += ` -t ${tag}`;
  }

  if (options.buildArgs) {
    for (const [key, value] of Object.entries(options.buildArgs)) {
      cmd += ` --build-arg ${key}="${value}"`;
    }
  }

  cmd += ` ${context}`;

  try {
    const { stdout } = await execAsync(cmd, {
      maxBuffer: 50 * 1024 * 1024, // 50MB
    });

    const imageIdMatch = stdout.match(/Successfully built ([a-f0-9]+)/);
    const imageId = imageIdMatch ? imageIdMatch[1] : "unknown";

    return {
      success: true,
      imageId,
      tags,
      size: "N/A",
      duration: Date.now() - start,
    };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    throw new Error(`Docker build failed: ${msg}`);
  }
}

export async function runDockerContainer(
  imageName: string,
  options: {
    name?: string;
    ports?: Record<string, string>;
    envVars?: Record<string, string>;
    detach?: boolean;
    network?: string;
  } = {}
): Promise<string> {
  let cmd = `docker run`;

  if (options.detach !== false) cmd += " -d";
  if (options.name) cmd += ` --name ${options.name}`;
  if (options.network) cmd += ` --network ${options.network}`;

  if (options.ports) {
    for (const [host, container] of Object.entries(options.ports)) {
      cmd += ` -p ${host}:${container}`;
    }
  }

  if (options.envVars) {
    for (const [key, value] of Object.entries(options.envVars)) {
      cmd += ` -e ${key}="${value}"`;
    }
  }

  cmd += ` ${imageName}`;

  try {
    const { stdout } = await execAsync(cmd);
    return stdout.trim();
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    throw new Error(`Docker run failed: ${msg}`);
  }
}

export async function stopDockerContainer(
  containerId: string
): Promise<boolean> {
  try {
    await execAsync(`docker stop ${containerId}`);
    return true;
  } catch {
    return false;
  }
}

export async function removeDockerContainer(
  containerId: string,
  force: boolean = false
): Promise<boolean> {
  try {
    const flag = force ? "-f" : "";
    await execAsync(`docker rm ${flag} ${containerId}`);
    return true;
  } catch {
    return false;
  }
}

export async function getDockerLogs(
  containerId: string,
  lines: number = 100
): Promise<string> {
  try {
    const { stdout } = await execAsync(
      `docker logs --tail ${lines} ${containerId}`
    );
    return stdout;
  } catch {
    return "";
  }
}

export function generateDockerfile(
  language: string,
  options: {
    port?: number;
    buildCommand?: string;
    startCommand?: string;
  } = {}
): string {
  const port = options.port || 3000;

  const templates: Record<string, string> = {
    "node-express": `# StaticFlow Generated Dockerfile — Node.js/Express
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN ${options.buildCommand || "npm run build"}

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 staticflow
COPY --from=builder /app ./
USER staticflow
EXPOSE ${port}
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:${port}/health || exit 1
CMD ["${options.startCommand || "node"}", "${options.startCommand ? "" : "dist/index.js"}"]`,

    "python-fastapi": `# StaticFlow Generated Dockerfile — Python/FastAPI
FROM python:3.12-slim AS builder

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

FROM python:3.12-slim AS runner
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
RUN useradd --create-home staticflow
COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=builder /app ./
USER staticflow
EXPOSE ${port}
HEALTHCHECK --interval=30s --timeout=3s CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:${port}/health')" || exit 1
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "${port}"]`,

    "go-gin": `# StaticFlow Generated Dockerfile — Go/Gin
FROM golang:1.22-alpine AS builder

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o server .

FROM alpine:3.19 AS runner
RUN apk --no-cache add ca-certificates
RUN adduser -D staticflow
WORKDIR /app
COPY --from=builder /app/server .
USER staticflow
EXPOSE ${port}
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:${port}/health || exit 1
CMD ["./server"]`,
  };

  return (
    templates[language] ||
    templates["node-express"]
  );
}

export function generateDockerCompose(
  projectName: string,
  options: {
    language?: string;
    database?: string;
    port?: number;
    includeRedis?: boolean;
  } = {}
): string {
  const port = options.port || 3000;
  const dbPort = options.database === "mongodb" ? 27017 : 5432;
  const dbImage =
    options.database === "mongodb"
      ? "mongo:7"
      : "postgres:16-alpine";
  const dbName =
    options.database === "mongodb" ? "mongo" : "postgres";

  let compose = `# StaticFlow Generated Docker Compose
version: "3.9"

services:
  app:
    build: .
    ports:
      - "${port}:${port}"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${options.database === "mongodb" ? "mongodb://staticflow:password@db:27017/staticflow" : "postgresql://staticflow:password@db:5432/staticflow"}
      ${options.includeRedis ? "- REDIS_URL=redis://redis:6379" : ""}
    depends_on:
      - db
      ${options.includeRedis ? "- redis" : ""}
    restart: unless-stopped
    networks:
      - ${projectName}-net

  db:
    image: ${dbImage}
    ports:
      - "${dbPort}:${dbPort}"
    environment:
      ${options.database === "mongodb" ? "- MONGO_INITDB_ROOT_USERNAME=staticflow\n      - MONGO_INITDB_ROOT_PASSWORD=password" : "- POSTGRES_USER=staticflow\n      - POSTGRES_PASSWORD=password\n      - POSTGRES_DB=staticflow"}
    volumes:
      - ${dbName}_data:/data
    restart: unless-stopped
    networks:
      - ${projectName}-net
`;

  if (options.includeRedis) {
    compose += `
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped
    networks:
      - ${projectName}-net
`;
  }

  compose += `
volumes:
  ${dbName}_data:
  ${options.includeRedis ? "  redis_data:" : ""}

networks:
  ${projectName}-net:
    driver: bridge
`;

  return compose;
}
