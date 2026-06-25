import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { connectDB } from "../../../../../lib/db";
import Project from "../../../../../models/Project.model";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { status } = await req.json();

    const validStatuses = ["RECRUITING", "ACTIVE", "COMPLETED", "ARCHIVED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { message: "Invalid status" },
        { status: 400 }
      );
    }

    await connectDB();

    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    if (project.owner.toString() !== session.user.id) {
      return NextResponse.json(
        { message: "Only the project owner can update status" },
        { status: 403 }
      );
    }

    project.status = status;
    await project.save();

    return NextResponse.json({ message: "Status updated", status });
  } catch (error) {
    console.error("STATUS UPDATE ERROR:", error);
    return NextResponse.json(
      { message: "Failed to update status" },
      { status: 500 }
    );
  }
}