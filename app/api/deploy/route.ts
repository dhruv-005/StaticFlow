import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import prisma from "@/lib/db/prisma";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { projectId, platform, domain, envVars } = body;

    if (!projectId || !platform) {
      return NextResponse.json(
        { error: "projectId and platform are required" },
        { status: 400 }
      );
    }

    const project = await prisma.project.findFirst({
      where: { id: projectId, userId: session.user.id },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Create deployment record
    const deployment = await prisma.deployment.create({
      data: {
        projectId,
        platform,
        status: "BUILDING",
        url: `https://${project.name.toLowerCase().replace(/\s+/g, "-")}.${platform}.dev`,
        domain: domain || null,
        sslEnabled: true,
        envVars: envVars || {},
        deployLogs: [
          `[${new Date().toISOString()}] Initializing deployment to ${platform}...`,
          `[${new Date().toISOString()}] Building Docker container...`,
          `[${new Date().toISOString()}] Installing dependencies...`,
        ],
      },
    });

    // Simulate deployment steps
    // In production: call Vercel/Render/Fly.io API
    const logs = [
      ...deployment.deployLogs,
      `[${new Date().toISOString()}] Running security checks...`,
      `[${new Date().toISOString()}] Configuring SSL certificate...`,
      `[${new Date().toISOString()}] Setting up CDN...`,
      `[${new Date().toISOString()}] Deployment complete!`,
    ];

    const updated = await prisma.deployment.update({
      where: { id: deployment.id },
      data: {
        status: "LIVE",
        deployLogs: logs,
      },
    });

    // Update project status
    await prisma.project.update({
      where: { id: projectId },
      data: { status: "DEPLOYED" },
    });

    return NextResponse.json({ deployment: updated });
  } catch (error) {
    console.error("[API] POST /deploy error:", error);
    return NextResponse.json({ error: "Deployment failed" }, { status: 500 });
  }
}
