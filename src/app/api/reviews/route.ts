import { NextResponse } from "next/server";

import { auth } from "../../../auth";
import { connectDB } from "../../../lib/db";

import Review from "../../../models/Review.model";
import Hub from "../../../models/Hub.model";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const {
      projectId,
      revieweeId,
      communication,
      technicalSkills,
      reliability,
      teamwork,
      comment,
    } = await req.json();

    await connectDB();

    const hub = await Hub.findOne({
      project: projectId,
    });

    if (!hub) {
      return NextResponse.json(
        { message: "Hub not found" },
        { status: 404 }
      );
    }

    const isMember = hub.members.some(
      (memberId: any) =>
        memberId.toString() === session.user.id
    );

    if (!isMember && process.env.NODE_ENV !== "development") {
      return NextResponse.json(
        { message: "Not allowed" },
        { status: 403 }
      );
    }

    // if (revieweeId === session.user.id) {
    //   return NextResponse.json(
    //     { message: "You cannot review yourself" },
    //     { status: 400 }
    //   );
    // }

    if (
  process.env.NODE_ENV !== "development" &&
  revieweeId === session.user.id
) {
  return NextResponse.json(
    { message: "You cannot review yourself" },
    { status: 400 }
  );
}

    const review = await Review.create({
      project: projectId,
      reviewer: session.user.id,
      reviewee: revieweeId,
      communication,
      technicalSkills,
      reliability,
      teamwork,
      comment,
    });

    return NextResponse.json(review, {
      status: 201,
    });
  } catch (error: any) {
    console.error("REVIEW CREATE ERROR:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        {
          message:
            "You have already reviewed this teammate",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Failed to create review" },
      { status: 500 }
    );
  }
}