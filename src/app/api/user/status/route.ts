import { NextResponse } from "next/server";

import { auth } from "../../../../auth";
import { connectDB } from "../../../../lib/db";
import User from "../../../../models/User.model";

export async function PATCH(req: Request) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { status } = await req.json();

    const allowedStatuses = [
      "AVAILABLE",
      "BUSY",
      "LOOKING_FOR_TEAM",
      "LOOKING_FOR_PROJECT",
    ];

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        { message: "Invalid status" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findByIdAndUpdate(
      session.user.id,
      { status },
      { new: true }
    );

    return NextResponse.json(user);
  } catch (error) {
    console.error("STATUS UPDATE ERROR:", error);

    return NextResponse.json(
      { message: "Failed to update status" },
      { status: 500 }
    );
  }
}