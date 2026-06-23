import { NextResponse } from "next/server";

import { auth } from "../../../auth";
import { connectDB } from "../../../lib/db";

import Discussion from "../../../models/Discussion.model";
import Hub from "../../../models/Hub.model";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { hubId, projectId, title, content } = await req.json();

    if (!title || !content) {
      return NextResponse.json(
        { message: "Title and content are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const hub = await Hub.findById(hubId);

    if (!hub) {
      return NextResponse.json(
        { message: "Hub not found" },
        { status: 404 }
      );
    }

    const isMember = hub.members.some(
      (memberId: any) =>
        memberId.toString() === session.user.id
    );

    if (!isMember && process.env.NODE_ENV !== "development") {
      return NextResponse.json(
        { message: "Not allowed" },
        { status: 403 }
      );
    }

    const discussion = await Discussion.create({
      hub: hubId,
      project: projectId,
      author: session.user.id,
      title,
      content,
      replies: [],
    });

    return NextResponse.json(discussion, { status: 201 });
  } catch (error) {
    console.error("DISCUSSION CREATE ERROR:", error);

    return NextResponse.json(
      { message: "Failed to create discussion" },
      { status: 500 }
    );
  }
}