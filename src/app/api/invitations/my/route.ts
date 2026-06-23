import { NextResponse } from "next/server";

import { auth } from "../../../../auth";
import { connectDB } from "../../../../lib/db";
import Invitation from "../../../../models/Invitation.model";

export async function GET() {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const invitations = await Invitation.find({
      receiver: session.user.id,
    })
      .populate("sender", "name githubUsername image")
      .populate("project", "title description")
      .sort({ createdAt: -1 });

    return NextResponse.json(invitations);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to fetch invitations" },
      { status: 500 }
    );
  }
}