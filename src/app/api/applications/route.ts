import { NextResponse } from "next/server";
import { auth } from "../../../auth";
import { connectDB } from "../../../lib/db";
import Application from "../../../models/Application.model";
import Project from "../../../models/Project.model";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const applications = await Application.find({ user: session.user.id })
      .populate("project", "title description status")
      .sort({ updatedAt: -1 });

    return NextResponse.json(applications);
  } catch (error) {
    console.error("GET APPLICATIONS ERROR:", error);
    return NextResponse.json(
      { message: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = await req.json();
    await connectDB();

    const project = await Project.findById(projectId);
    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    if (project.owner.toString() === session.user.id) {
      return NextResponse.json(
        { message: "You cannot apply to your own project" },
        { status: 400 }
      );
    }

    const existingApplication = await Application.findOne({
      user: session.user.id,
      project: projectId,
    });

    if (existingApplication) {
      return NextResponse.json(
        { message: "You already applied to this project" },
        { status: 400 }
      );
    }

    const application = await Application.create({
      user: session.user.id,
      project: projectId,
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error("APPLICATION ERROR:", error);
    return NextResponse.json(
      { message: "Failed to apply" },
      { status: 500 }
    );
  }
}