import { NextResponse } from "next/server";

import { auth } from "../../../auth";
import { connectDB } from "../../../lib/db";

import Message from "../../../models/Message.model";
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

    const { hubId, projectId, content, imageUrl } = await req.json();

    if (!content || !content.trim()) {
      return NextResponse.json(
        { message: "Message cannot be empty" },
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
      (memberId: any) => memberId.toString() === session.user.id
    );

    if (!isMember && process.env.NODE_ENV !== "development") {
      return NextResponse.json(
        { message: "Not allowed" },
        { status: 403 }
      );
    }

    const message = await Message.create({
      hub: hubId,
      project: projectId,
      sender: session.user.id,
      content,
      imageUrl,
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("MESSAGE CREATE ERROR:", error);

    return NextResponse.json(
      { message: "Failed to send message" },
      { status: 500 }
    );
  }
}