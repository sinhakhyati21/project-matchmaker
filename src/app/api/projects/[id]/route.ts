import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { connectDB } from "../../../../lib/db";
import Project from "../../../../models/Project.model";

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
    const { title, description, category, requiredSkills, requiredRoles, maxTeamSize } =
      await req.json();

    await connectDB();

    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }

    if (project.owner.toString() !== session.user.id) {
      return NextResponse.json({ message: "Not allowed" }, { status: 403 });
    }

    if (project.status === "ACTIVE" || project.status === "COMPLETED") {
      return NextResponse.json(
        { message: "Cannot edit an active or completed project" },
        { status: 400 }
      );
    }

    if (title) project.title = title;
    if (description) project.description = description;
    if (category) project.category = category;
    if (requiredSkills) project.requiredSkills = requiredSkills;
    if (requiredRoles) project.requiredRoles = requiredRoles;
    if (maxTeamSize) project.maxTeamSize = maxTeamSize;

    await project.save();

    return NextResponse.json(project);
  } catch (error) {
    console.error("PATCH PROJECT ERROR:", error);
    return NextResponse.json(
      { message: "Failed to update project" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }

    if (project.owner.toString() !== session.user.id) {
      return NextResponse.json({ message: "Not allowed" }, { status: 403 });
    }

    if (project.status === "ACTIVE") {
      return NextResponse.json(
        { message: "Cannot delete an active project" },
        { status: 400 }
      );
    }

    await Project.findByIdAndDelete(id);

    return NextResponse.json({ message: "Project deleted" });
  } catch (error) {
    console.error("DELETE PROJECT ERROR:", error);
    return NextResponse.json(
      { message: "Failed to delete project" },
      { status: 500 }
    );
  }
}