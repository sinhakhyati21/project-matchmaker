import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { connectDB } from "../../../../lib/db";
import User from "../../../../models/User.model";

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { skills } = await req.json();

    if (!Array.isArray(skills)) {
      return NextResponse.json(
        { message: "Skills must be an array" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findByIdAndUpdate(
      session.user.id,
      { skills: skills.map((s: string) => s.trim()).filter(Boolean) },
      { new: true }
    );

    return NextResponse.json(user);
  } catch (error) {
    console.error("SKILLS UPDATE ERROR:", error);
    return NextResponse.json(
      { message: "Failed to update skills" },
      { status: 500 }
    );
  }
}