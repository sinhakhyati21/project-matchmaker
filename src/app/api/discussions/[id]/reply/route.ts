import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { auth } from "../../../../../auth";
import { connectDB } from "../../../../../lib/db";

import Discussion from "../../../../../models/Discussion.model";
import Hub from "../../../../../models/Hub.model";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const { content } = await req.json();

    if (!content?.trim()) {
      return NextResponse.json(
        { message: "Reply cannot be empty" },
        { status: 400 }
      );
    }

    await connectDB();

    const discussion = await Discussion.findById(id);

    if (!discussion) {
      return NextResponse.json(
        { message: "Discussion not found" },
        { status: 404 }
      );
    }

    const hub = await Hub.findById(discussion.hub);

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

    discussion.replies.push({
        author: new mongoose.Types.ObjectId(session.user.id),
        content,
        createdAt: new Date(),
    });

    await discussion.save();

    return NextResponse.json(discussion);
  } catch (error) {
    console.error("DISCUSSION REPLY ERROR:", error);

    return NextResponse.json(
      { message: "Failed to add reply" },
      { status: 500 }
    );
  }
}