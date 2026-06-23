import { NextResponse } from "next/server";

import { auth } from "../../../auth";
import { connectDB } from "../../../lib/db";

import User from "../../../models/User.model";
import Project from "../../../models/Project.model";

function normalizeSkill(skill: string) {
  return skill.toLowerCase().replace(/[^a-z0-9]/g, "");
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

    const { projectId } = await req.json();

    await connectDB();

    const project = await Project.findById(projectId);

    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    if (
      project.owner.toString() !== session.user.id &&
      process.env.NODE_ENV !== "development"
    ) {
      return NextResponse.json(
        { message: "Only project owner can view recommendations" },
        { status: 403 }
      );
    }

    const users = await User.find({
      _id: {
        $ne: project.owner,
        $nin: project.members || [],
      },
    });

    const requiredSkills = project.requiredSkills.map((skill: string) => ({
      original: skill,
      normalized: normalizeSkill(skill),
    }));

    const recommendations = users
      .map((user: any) => {
        const userSkills = (user.skills || []).map((skill: string) => ({
          original: skill,
          normalized: normalizeSkill(skill),
        }));

        const matchedSkills = requiredSkills
          .filter((requiredSkill: any) =>
            userSkills.some(
              (userSkill: any) =>
                userSkill.normalized === requiredSkill.normalized
            )
          )
          .map((skill: any) => skill.original);

        const score =
          requiredSkills.length === 0
            ? 0
            : Math.round(
                (matchedSkills.length / requiredSkills.length) * 100
              );

        return {
          _id: user._id,
          name: user.name,
          image: user.image,
          githubUsername: user.githubUsername,
          status: user.status,
          skills: user.skills || [],
          matchedSkills,
          score,
        };
      })
      .sort((a, b) => b.score - a.score);

    return NextResponse.json(recommendations);
  } catch (error) {
    console.error("RECOMMENDATION ERROR:", error);

    return NextResponse.json(
      { message: "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}