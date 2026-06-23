import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { connectDB } from "../../../../lib/db";
import Invitation from "../../../../models/Invitation.model";

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

    if (status !== "ACCEPTED" && status !== "DECLINED") {
      return NextResponse.json(
        { message: "Invalid status" },
        { status: 400 }
      );
    }

    await connectDB();

    const invitation = await Invitation.findById(id);

    if (!invitation) {
      return NextResponse.json(
        { message: "Invitation not found" },
        { status: 404 }
      );
    }

    // if (invitation.receiver.toString() !== session.user.id) {
    //   return NextResponse.json(
    //     { message: "Not allowed" },
    //     { status: 403 }
    //   );
    // }
    if (
  process.env.NODE_ENV !== "development" &&
  invitation.receiver.toString() !== session.user.id
) {
  return NextResponse.json(
    { message: "Not allowed" },
    { status: 403 }
  );
}

    if (invitation.status !== "PENDING") {
      return NextResponse.json(
        { message: "Invitation already processed" },
        { status: 400 }
      );
    }

    invitation.status = status;
    await invitation.save();

    return NextResponse.json(invitation);
  } catch (error) {
    console.error("INVITATION RESPONSE ERROR:", error);

    return NextResponse.json(
      { message: "Failed to update invitation" },
      { status: 500 }
    );
  }
}