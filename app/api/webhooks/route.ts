import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-webhook-signature");
    const secret = process.env.WEBHOOK_SECRET || "staticflow-webhook-secret";

    if (signature) {
      const expected = crypto
        .createHmac("sha256", secret)
        .update(body)
        .digest("hex");

      if (signature !== expected) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    }

    const payload = JSON.parse(body);
    const { event, data } = payload;

    switch (event) {
      case "deployment.completed":
        console.log("[Webhook] Deployment completed:", data?.url);
        break;
      case "security.scan.completed":
        console.log("[Webhook] Security scan completed:", data?.grade);
        break;
      case "api.key.expiring":
        console.log("[Webhook] API key expiring:", data?.keyPrefix);
        break;
      default:
        console.log("[Webhook] Unknown event:", event);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[API] POST /webhooks error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
