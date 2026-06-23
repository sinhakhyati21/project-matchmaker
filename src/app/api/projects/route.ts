import { NextResponse } from "next/server";

import { auth } from "../../../auth";
import { connectDB } from "../../../lib/db";
import Project from "../../../models/Project.model";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    if (!session.user?.id) {
      console.error("Session user ID is missing", session);
      return NextResponse.json(
        {
          message: "User ID not found in session",
        },
        {
          status: 401,
        }
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
    console.error("Error creating project:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        message: "Failed to create project",
        error: errorMessage,
      },
      {
        status: 500,
      }
    );
  }
}