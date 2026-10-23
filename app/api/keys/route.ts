import { NextRequest, NextResponse } from "next/server";
import { requireAuth, createAuditLog } from "@/lib/auth";
import { getEntities, createEntity } from "@/lib/render-client";
import crypto from "crypto";

export async function GET(req: NextRequest) {
  try {
    await requireAuth(req);

    const res = await getEntities("apikeys", 10000);

    const keys = res.data.map((k: any) => ({
      id: k.id,
      key: k.name || `sf_live_${k.id}`,
      name: k.description || `Key ${k.id}`,
      status: (k.category || "ACTIVE").toUpperCase(),
      createdAt: k.createdAt,
      project: {
        id: k.value || 0,
        name: `Project ${k.value || k.id}`,
      },
    }));

    return NextResponse.json({ keys });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    const { name, projectId } = await req.json();

    const res = await getEntities("apikeys", 10000);
    if (res.total >= 10) {
      return NextResponse.json(
        { error: "Maximum 10 API keys" },
        { status: 400 }
      );
    }

    const keyValue = "sf_live_" + crypto.randomBytes(24).toString("hex");

    const apiKey = await createEntity("apikeys", {
      name: keyValue,
      description: name || `Key ${res.total + 1}`,
      value: projectId || 0,
      category: "ACTIVE",
    });

    await createAuditLog(
      session.id,
      "APIKEY_CREATED",
      `Created API key: ${name || keyValue.slice(0, 20)}`,
      req
    );

    return NextResponse.json(
      {
        apiKey: {
          id: apiKey?.id || Date.now(),
          key: keyValue,
          name: name || `Key ${res.total + 1}`,
          status: "ACTIVE",
          createdAt: new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
