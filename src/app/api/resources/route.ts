import { NextResponse } from "next/server";

import { auth } from "../../../auth";
import { connectDB } from "../../../lib/db";

import Resource from "../../../models/Resource.model";
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

    const {
      hubId,
      projectId,
      title,
      url,
      type,
    } = await req.json();

    if (!title || !url) {
      return NextResponse.json(
        { message: "Title and URL are required" },
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

    const resource = await Resource.create({
      hub: hubId,
      project: projectId,
      title,
      url,
      type,
      createdBy: session.user.id,
    });

    return NextResponse.json(resource, { status: 201 });
  } catch (error) {
    console.error("RESOURCE CREATE ERROR:", error);

    return NextResponse.json(
      { message: "Failed to create resource" },
      { status: 500 }
    );
  }
}