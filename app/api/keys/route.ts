import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function GET(req: NextRequest) {
  return NextResponse.json({ keys: [] });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { keyName = "Default API Key", projectId = "default" } = body;

    // Generate a real cryptographic API key
    const rawKey = `sf_live_${crypto.randomBytes(24).toString("base64url")}`;
    const keyPrefix = rawKey.slice(0, 12) + "...";

    return NextResponse.json({
      success: true,
      key: {
        id: crypto.randomUUID(),
        keyName,
        keyPrefix,
        projectId,
        permissions: ["read", "write", "admin"],
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      fullKey: rawKey,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Key generation failed" },
      { status: 500 }
    );
  }
}
