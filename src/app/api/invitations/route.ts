import { NextResponse } from "next/server";

import { auth } from "../../../auth";
import { connectDB } from "../../../lib/db";

import User from "../../../models/User.model";
import Project from "../../../models/Project.model";
import Invitation from "../../../models/Invitation.model";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { receiverId, projectId } = await req.json();

    await connectDB();

    const project = await Project.findById(projectId);

    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    if (project.owner.toString() !== session.user.id) {
      return NextResponse.json(
        { message: "Only project owner can invite users" },
        { status: 403 }
      );
    }

    const receiver = await User.findById(receiverId);

    if (!receiver) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const existingInvitation =
      await Invitation.findOne({
        receiver: receiverId,
        project: projectId,
      });

    if (existingInvitation) {
      return NextResponse.json(
        { message: "Invitation already exists" },
        { status: 400 }
      );
    }

    const invitation =
      await Invitation.create({
        sender: session.user.id,
        receiver: receiverId,
        project: projectId,
      });

    return NextResponse.json(
      invitation,
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "SEND INVITATION ERROR:",
      error
    );

    return NextResponse.json(
      {
        message: "Failed to send invitation",
      },
      {
        status: 500,
      }
    );
  }
}