import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { notifyHub } from "../../../../lib/hubStream";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { hubId } = await req.json();
  if (!hubId) {
    return NextResponse.json({ message: "hubId required" }, { status: 400 });
  }

  notifyHub(hubId, { type: "typing", userId: session.user.id });

  return NextResponse.json({ ok: true });
}