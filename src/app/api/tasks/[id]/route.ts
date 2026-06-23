import { NextResponse } from "next/server";

import { auth } from "../../../../auth";
import { connectDB } from "../../../../lib/db";

import Task from "../../../../models/Task.model";
import Hub from "../../../../models/Hub.model";

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
    const { status } = await req.json();

    const allowedStatuses = [
      "TODO",
      "IN_PROGRESS",
      "REVIEW",
      "DONE",
    ];

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        { message: "Invalid status" },
        { status: 400 }
      );
    }

    await connectDB();

    const task = await Task.findById(id);

    if (!task) {
      return NextResponse.json(
        { message: "Task not found" },
        { status: 404 }
      );
    }

    const hub = await Hub.findById(task.hub);

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
    if (status === "TODO" && task.status !== "TODO") {
  return NextResponse.json(
    {
      message: "A started task cannot be moved back to To Do",
    },
    {
      status: 400,
    }
  );
}
    task.status = status;
    await task.save();

    return NextResponse.json(task);
  } catch (error) {
    console.error("TASK UPDATE ERROR:", error);

    return NextResponse.json(
      { message: "Failed to update task" },
      { status: 500 }
    );
  }
}