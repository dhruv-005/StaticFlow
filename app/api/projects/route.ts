import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import prisma from "@/lib/db/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {
      userId: session.user.id,
    };

    if (status) {
      where.status = status.toUpperCase();
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          description: true,
          language: true,
          framework: true,
          database: true,
          status: true,
          endpointsCount: true,
          securityScore: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.project.count({ where }),
    ]);

    return NextResponse.json({
      projects,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[API] GET /projects error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, description, language, database } = body;

    if (!name || !language || !database) {
      return NextResponse.json(
        { error: "Missing required fields: name, language, database" },
        { status: 400 }
      );
    }

    // Check project limit for free plan
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { plan: true },
    });

    if (user?.plan === "FREE") {
      const count = await prisma.project.count({
        where: { userId: session.user.id },
      });
      if (count >= 3) {
        return NextResponse.json(
          { error: "Free plan limit reached (3 projects). Upgrade to Pro." },
          { status: 403 }
        );
      }
    }

    const frameworkMap: Record<string, string> = {
      "node-express": "express",
      "python-fastapi": "fastapi",
      "python-django": "django",
      "java-spring": "spring-boot",
      "go-gin": "gin",
      "php-laravel": "laravel",
    };

    const project = await prisma.project.create({
      data: {
        userId: session.user.id,
        name,
        description,
        language,
        framework: frameworkMap[language] || "express",
        database,
        status: "DRAFT",
      },
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error("[API] POST /projects error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
