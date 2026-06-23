import { NextResponse } from "next/server";

import { auth } from "../../../../auth";
import { connectDB } from "../../../../lib/db";
import Application from "../../../../models/Application.model";
import Project from "../../../../models/Project.model";

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

    if (!["ACCEPTED", "REJECTED"].includes(status)) {
      return NextResponse.json(
        { message: "Invalid status" },
        { status: 400 }
      );
    }

    await connectDB();

    const application = await Application.findById(id);

    if (!application) {
      return NextResponse.json(
        { message: "Application not found" },
        { status: 404 }
      );
    }

    if (application.status !== "PENDING") {
      return NextResponse.json(
        { message: "Application already processed" },
        { status: 400 }
      );
    }

    const project = await Project.findById(application.project);

    if (!project || project.owner.toString() !== session.user.id) {
      return NextResponse.json(
        { message: "Not allowed" },
        { status: 403 }
      );
    }

    if (project.status !== "RECRUITING") {
      return NextResponse.json(
        { message: "Project is not recruiting" },
        { status: 400 }
      );
    }

    application.status = status;
    await application.save();

    if (status === "ACCEPTED") {
      const acceptedCount = await Application.countDocuments({
        project: project._id,
        status: "ACCEPTED",
      });

      if (acceptedCount >= project.maxTeamSize - 1) {
        project.status = "ACTIVE";
        await project.save();
      }
    }

    return NextResponse.json(application);
  } catch (error) {
    console.error("UPDATE APPLICATION ERROR:", error);

    return NextResponse.json(
      { message: "Failed to update application" },
      { status: 500 }
    );
  }
}