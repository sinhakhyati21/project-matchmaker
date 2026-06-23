import { NextResponse } from "next/server";

import { auth } from "../../../auth";
import { connectDB } from "../../../lib/db";
import Project from "../../../models/Project.model";

export async function GET() {
  try {
    await connectDB();

    const projects = await Project.find()
      .populate("owner", "name email image githubUsername")
      .sort({ createdAt: -1 });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("GET PROJECTS ERROR:", error);

    return NextResponse.json(
      { message: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    await connectDB();

    const project = await Project.create({
      ...body,
      owner: session.user.id,
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("CREATE PROJECT ERROR:", error);

    return NextResponse.json(
      { message: "Failed to create project" },
      { status: 500 }
    );
  }
}