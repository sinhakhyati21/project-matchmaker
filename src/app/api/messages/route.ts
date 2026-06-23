import { NextResponse } from "next/server";
import { auth } from "../../../auth";
import { connectDB } from "../../../lib/db";
import Message from "../../../models/Message.model";
import Hub from "../../../models/Hub.model";
import "../../../models/User.model";
import { notifyHub } from "./stream/route";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const hubId = searchParams.get("hubId");
    if (!hubId) {
      return NextResponse.json({ message: "Hub ID is required" }, { status: 400 });
    }

    await connectDB();

    const hub = await Hub.findById(hubId);
    if (!hub) {
      return NextResponse.json({ message: "Hub not found" }, { status: 404 });
    }

    const isMember = hub.members.some(
      (memberId: any) => memberId.toString() === session.user.id
    );
    if (!isMember) {
      return NextResponse.json({ message: "Not allowed" }, { status: 403 });
    }

    const messages = await Message.find({ hub: hubId })
      .populate("sender", "name githubUsername image")
      .sort({ createdAt: 1 });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("MESSAGE FETCH ERROR:", error);
    return NextResponse.json({ message: "Failed to fetch messages" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { hubId, projectId, content, imageUrl } = await req.json();

    if ((!content || !content.trim()) && !imageUrl) {
      return NextResponse.json(
        { message: "Message or image is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const hub = await Hub.findById(hubId);
    if (!hub) {
      return NextResponse.json({ message: "Hub not found" }, { status: 404 });
    }

    const isMember = hub.members.some(
      (memberId: any) => memberId.toString() === session.user.id
    );
    if (!isMember) {
      return NextResponse.json({ message: "Not allowed" }, { status: 403 });
    }

    const message = await Message.create({
      hub: hubId,
      project: projectId,
      sender: session.user.id,
      content: content || "Shared an image",
      imageUrl,
    });

    const populated = await message.populate("sender", "name githubUsername image");
    notifyHub(hubId, {
      type: "message",
      message: JSON.parse(JSON.stringify(populated)),
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("MESSAGE CREATE ERROR:", error);
    return NextResponse.json({ message: "Failed to send message" }, { status: 500 });
  }
}