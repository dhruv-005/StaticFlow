import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getEntities, updateEntity } from "@/lib/render-client";

export async function GET(req: NextRequest) {
  try {
    await requireAuth(req);

    const res = await getEntities("notifications", 50);

    const notifications = res.data.map((n: any) => ({
      id: n.id,
      title: n.name || "Notification",
      message: n.description || "",
      read: (n.category || "").toUpperCase() === "READ",
      createdAt: n.createdAt,
    }));

    return NextResponse.json({ notifications });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await requireAuth(req);
    const { ids } = await req.json();

    const res = await getEntities("notifications", 10000);

    if (ids && ids.length > 0) {
      for (const id of ids) {
        const n = res.data.find((x: any) => x.id === id);
        if (n) {
          await updateEntity("notifications", id, {
            ...n,
            category: "READ",
          });
        }
      }
    } else {
      for (const n of res.data) {
        if ((n.category || "").toUpperCase() !== "READ") {
          await updateEntity("notifications", n.id, {
            ...n,
            category: "READ",
          });
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
