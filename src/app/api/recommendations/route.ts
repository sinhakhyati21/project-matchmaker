import { NextResponse } from "next/server";
import { auth } from "../../../auth";
import { connectDB } from "../../../lib/db";
import User from "../../../models/User.model";
import Project from "../../../models/Project.model";
import "../../../models/Review.model";
import { getTrustScore } from "../../../lib/trustScore";

function normalizeSkill(skill: string) {
  return skill.toLowerCase().replace(/[^a-z0-9]/g, "");
}

async function getGitHubActivityScore(
  githubUsername: string
): Promise<number> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${githubUsername}/events?per_page=30`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
        next: { revalidate: 3600 },
      }
    );
    if (!res.ok) return 0;
    const events = await res.json();
    if (!Array.isArray(events)) return 0;
    // Max 20 points — 1 point per event, capped at 20
    return Math.min(events.length, 20);
  } catch {
    return 0;
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

    const { projectId } = await req.json();
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

    const recommendations = await Promise.all(
      users.map(async (user: any) => {
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

        const skillScore =
          requiredSkills.length === 0
            ? 0
            : Math.round(
                (matchedSkills.length / requiredSkills.length) * 80
              );

        const activityScore = user.githubUsername
          ? await getGitHubActivityScore(user.githubUsername)
          : 0;

        const score = skillScore + activityScore;

        const trustScore = await getTrustScore(user._id.toString());

        const statusBonus =
          user.status === "LOOKING_FOR_TEAM" ||
          user.status === "LOOKING_FOR_PROJECT"
            ? 5
            : 0;

        return {
          _id: user._id,
          name: user.name,
          image: user.image,
          githubUsername: user.githubUsername,
          status: user.status,
          skills: user.skills || [],
          matchedSkills,
          score: score + statusBonus,
          skillScore,
          activityScore,
          trustScore,
        };
      })
    );

    recommendations.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.trustScore.average - a.trustScore.average;
    });

    const filtered = recommendations.filter((r) => r.score > 0);

    return NextResponse.json(filtered);
  } catch (error) {
    console.error("RECOMMENDATION ERROR:", error);
    return NextResponse.json(
      { message: "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}